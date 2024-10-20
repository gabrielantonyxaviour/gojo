// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { MessagingReceipt, MessagingParams } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IGojoWrappedUsd.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error InvalidCaller(address caller);
error AlreadyExported(uint256 projectId);
error NotProjectOwner(uint256 projectId, address owner);
error NotEnoughIP(uint256 projectId, uint256 ipConsumption, uint256 availableIP);
error InvalidCrosschainCaller(uint32 eid, bytes32 caller);
error InvalidMsgType();
error LzAltTokenUnavailable();

contract GojoCore is OApp, OAppOptionsType3{
    using SafeERC20 for IERC20;
    
    struct ConstructorParams{
        address endpoint;
        address gojoWrappedUsd;
        address gojoCoreAIAgent;
    }

    struct Project{
        string metadata;
        uint32[] aiAgentsUsed;
        address owner;
        uint256 ipConsumption;
        uint32 generationsCount;
        bool isExported;
    }
    
    struct GetQuoteParams{
        uint32 dstEid;
        Project project;
        bytes extraSendOptions;
        bytes extraRelayOptions;
    }

    struct DomainSpecificAiAgent{
        string metadata;
        address agentAddress;
    }

    address public gojoWrappedUsd;
    address public gojoCoreAIAgent;
    bytes32 public gojoStoryCoreAddress;
    bytes32 public gojoSignHookAddres;
    uint16 public constant SEND = 1;
    uint16 public constant SEND_ABC = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    uint256 public projectIdCount;
    uint32 public aiAgentsCount;

    mapping(uint256 => Project) public projects;
    mapping(uint32 => DomainSpecificAiAgent) public domainSpecificAiAgents;

    constructor(ConstructorParams memory _params) OApp(_params.endpoint, msg.sender) Ownable(msg.sender) {
        gojoWrappedUsd = _params.gojoWrappedUsd;
        gojoCoreAIAgent = _params.gojoCoreAIAgent;
        projectIdCount = 0;
    }

    event ProjectCreated(uint256 projectId, string metadata, address owner);
    event GenerationAction(uint256 projectId, uint32[] newAiAgentsUsed, uint256 ipConsumption);
    event DomainSpecificAiAgentAdded(DomainSpecificAiAgent[] agent);
    event MessageSent(bytes32 guid, uint32 dstEid, bytes payload);
    event MessageReceived(bytes32 guid, Origin origin, address executor, bytes payload, bytes extraData);
    
    modifier onlyGojoStoryCore(uint32 _eid, bytes32 _sender){
        if(_eid != STORY_EID || _sender != gojoStoryCoreAddress) revert InvalidCrosschainCaller(_eid, _sender);
        _;
    }

    modifier onlyGojoCoreAiAgent(address _sender){
        if(_sender != gojoCoreAIAgent) revert InvalidCaller(_sender);
        _;
    }

    function setGojoStoryAddress(address _gojoStoryCoreAddress) external onlyOwner {
        gojoStoryCoreAddress = addressToBytes32(_gojoStoryCoreAddress);
        setPeer(STORY_EID, addressToBytes32(_gojoStoryCoreAddress));
    }

    function setGojoSignHook(address _gojoSignHookAddress) external onlyOwner {
        gojoSignHookAddres = addressToBytes32(_gojoSignHookAddress);
        setPeer(POLYGON_EID, addressToBytes32(_gojoSignHookAddress));
    }

    function setGojoWrappedUsd(address _gojoWrappedUsd) external onlyOwner {
        gojoWrappedUsd = _gojoWrappedUsd;
    }
    
    function _payNative(uint256 _nativeFee) internal virtual override returns (uint256 nativeFee) {
        address nativeErc20 = endpoint.nativeToken();
        if (nativeErc20 == address(0)) revert LzAltTokenUnavailable();

        IERC20(nativeErc20).safeTransferFrom(msg.sender, address(endpoint), _nativeFee);
    }

    function _lzSend(uint32 _dstEid, bytes memory _message, bytes memory _options, MessagingFee memory _fee, address _refundAddress) internal virtual override returns (MessagingReceipt memory receipt) {
        _payNative(_fee.nativeFee);
        if (_fee.lzTokenFee > 0) _payLzToken(_fee.lzTokenFee);
        return endpoint.send(
            MessagingParams(_dstEid, _getPeerOrRevert(_dstEid), _message, _options, _fee.lzTokenFee > 0),
            _refundAddress
        );
    }

    function createProject(string memory _metadata) external {
        uint256 projectId = projectIdCount;
        projects[projectId] = Project(_metadata, new uint32[](0), msg.sender, 0, 0, false);
        projectIdCount++;
        emit ProjectCreated(projectId, _metadata, msg.sender);
    }

    function registerGeneration(uint256 _projectId, uint32[] memory newAiAgentsUsed, uint256 _ipConsumption) external onlyGojoCoreAiAgent(msg.sender) {
        if(projects[_projectId].isExported) revert AlreadyExported(_projectId);
        Project storage project = projects[_projectId];
        for(uint i = 0; i < newAiAgentsUsed.length; i++) project.aiAgentsUsed.push(newAiAgentsUsed[i]);
        project.ipConsumption += _ipConsumption;
        project.generationsCount++;
        emit GenerationAction(_projectId, newAiAgentsUsed, _ipConsumption);
    }

    function exportProject(uint256 _projectId, bytes calldata _extraSendOptions, bytes calldata _extraRelayOptions, uint256 _skaleFee) external payable {
        if(projects[_projectId].isExported) revert AlreadyExported(_projectId);
        if(projects[_projectId].owner != msg.sender) revert NotProjectOwner(_projectId, msg.sender);
        
        uint256 _availaleIP = IGojoWrappedUsd(gojoWrappedUsd).balanceOf(msg.sender);
        if(projects[_projectId].ipConsumption > _availaleIP) revert NotEnoughIP(_projectId, projects[_projectId].ipConsumption, _availaleIP);
        IGojoWrappedUsd(gojoWrappedUsd).exportProject(msg.sender, projects[_projectId].ipConsumption);
        
        Project storage project = projects[_projectId];
        project.isExported = true;
        _send(projects[_projectId], _extraSendOptions, _extraRelayOptions, _skaleFee);
    }

    function _send(
        Project memory _project,
        bytes calldata _extraSendOptions, 
        bytes calldata _extraRelayOptions,
        uint256 skaleFee
    ) public payable {
        bytes memory options = combineOptions(POLYGON_EID, SEND_ABC, _extraSendOptions);
        bytes memory _sendData = abi.encode(_project, _extraRelayOptions);
        MessagingReceipt memory receipt = _lzSend(
            POLYGON_EID,
            _sendData,
            options,
            MessagingFee(skaleFee, 0),
            payable(msg.sender)
        );

        emit MessageSent(receipt.guid, POLYGON_EID, _sendData);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _payload,
        address _executor,
        bytes calldata _extraData  
    ) internal override  onlyGojoStoryCore(_origin.srcEid, _origin.sender){
        DomainSpecificAiAgent[] memory agents = abi.decode(_payload, (DomainSpecificAiAgent[]));
        for(uint i = 0; i < agents.length; i++){
            domainSpecificAiAgents[aiAgentsCount] = agents[i];
            aiAgentsCount++;
        }
        emit DomainSpecificAiAgentAdded(agents);
        emit MessageReceived(_guid, _origin, _executor, _payload, _extraData);
    }

    function getQuote(
        GetQuoteParams[2] memory _params
    ) public view returns (MessagingFee memory totalFee) {
        for (uint i = 0; i < 2; i++) {
            bytes memory payload = abi.encode(_params[i].project, _params[i].extraRelayOptions);
            bytes memory options = this.combineOptionsHelper(_params[i].dstEid, SEND_ABC, _params[i].extraSendOptions);
            MessagingFee memory fee = _quote(_params[i].dstEid, payload, options, false);
            totalFee.nativeFee += fee.nativeFee;
        }
    }

    function combineOptionsHelper(uint32 _dstEid, uint16 _msgType, bytes calldata _extraOptions) external view returns (bytes memory) {
        return combineOptions(_dstEid, _msgType, _extraOptions);
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }

}