// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { OApp, Origin, MessagingFee, MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import "./interface/IGojoWrappedUsd.sol";
import "./interface/IGojoStoryUsdWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { IGroupingModule } from "./interface/story-protocol-core/IGroupingModule.sol";
import { ILicensingModule } from "./interface/story-protocol-core/ILicensingModule.sol";
import { IIPAssetRegistry } from "./interface/story-protocol-core/IIPAssetRegistry.sol";
import "./interface/INFT.sol";
import "./interface/IMockEvenSplitGroupPool.sol";

error InvalidCaller(address caller);
error NotProjectOwner(uint256 projectId, address owner);
error InvalidCrosschainCaller(uint32 eid, bytes32 caller);

contract GojoStoryCore is OApp{
    
    struct ConstructorParams{
        address endpoint;
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

    struct Resource {
        string metadata;
        string ipMetadata;
        address creator;
        uint32 aiAgentId;
        address ipId;
        uint256 tokenId;
    }

    struct CreateAiAgentsInput {
        string metadata;
        string ipMetadata;
    }

    struct DomainSpecificAiAgent{
        string metadata;
        string ipMetadata;
        address resourceGroupAddress;
        address agentAddress;
    }

    address public gojoCoreAIAgent;
    bytes32 public gojoCoreAddress;
    address public gojoStoryUsdWrapperAddress;
    IIPAssetRegistry public constant IP_ASSET_REGISTRY = IIPAssetRegistry(0x1a9d0d28a0422F26D31Be72Edc6f13ea4371E11B);
    IGroupingModule public constant GROUPING_MODULE = IGroupingModule(0x26Eb59B900FD158396931d2349Fd6B08f0390e76);
    ILicensingModule public constant LICENSING_MODULE = ILicensingModule(0xd81fd78f557b457b4350cB95D20b547bFEb4D857);
    IMockEvenSplitGroupPool public constant SPLIT_POOL = IMockEvenSplitGroupPool(0x69e0D5123bc0539a87a9dDcE82E803575e35cbb4);
    address public constant PIL_LICENSE_TEMPLATE=0x0752f61E59fD2D39193a74610F1bd9a6Ade2E3f9;
    uint256 public constant NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    uint256 public resourceIdCount;
    uint32 public aiAgentsCount;
    uint32 public exportedProjectsCount;

    INFT public immutable gojoAiAgentNft;
    INFT public immutable gojoResourceNft;

    mapping(uint256 => Resource) public resources;
    mapping(uint32 => DomainSpecificAiAgent) public domainSpecificAiAgents;
    mapping(uint32 => Project) public exportedProjects;
    mapping(uint32 => uint256) public aiAgentsRevenue;

    constructor(ConstructorParams memory _params) OApp(_params.endpoint, msg.sender) Ownable(msg.sender) {
        gojoCoreAIAgent = _params.gojoCoreAIAgent;
        resourceIdCount = 0;
    }

    event ResourceUploaded(uint256 resourceId, string metadata, address owner, uint256 assetTokenId, uint256 ipTokenId, uint32 aiAgentId);
    event DomainSpecificAiAgentAdded(DomainSpecificAiAgent[] agent);
    event MessageSent(bytes32 guid, uint32 dstEid, bytes payload, MessagingFee fee, uint64 nonce);
    event MessageReceived(bytes32 guid, Origin origin, address executor, bytes payload, bytes extraData);
    
    modifier onlyGojoCore(uint32 _eid, bytes32 _sender){
        if(_eid != SKALE_EID || _sender != gojoCoreAddress) revert InvalidCrosschainCaller(_eid, _sender);
        _;
    }

    function setGojoCoreAddress(address _gojoCoreAddress) external onlyOwner {
        gojoCoreAddress = addressToBytes32(_gojoCoreAddress);
        setPeer(STORY_EID, addressToBytes32(_gojoCoreAddress));
    }

    function setGojoStoryUsdWrapperAddress(address _gojoStoryUsdWrapperAddress) external onlyOwner {
        gojoStoryUsdWrapperAddress = _gojoStoryUsdWrapperAddress;
    }

    function createAiAgents(CreateAiAgentsInput[] memory aiAgents, bytes calldata _options) external payable onlyOwner {
        DomainSpecificAiAgent[] memory _domainSpecificAiAgents = new DomainSpecificAiAgent[](aiAgents.length);
        for(uint i = 0; i < aiAgents.length; i++){
            (address groupId, address aiAgentAddress) = _registerAiAgentIp(aiAgents[i].metadata, aiAgents[i].ipMetadata);
            domainSpecificAiAgents[aiAgentsCount] = DomainSpecificAiAgent(aiAgents[i].metadata, aiAgents[i].ipMetadata, groupId, aiAgentAddress);
            _domainSpecificAiAgents[i]=domainSpecificAiAgents[aiAgentsCount];
            aiAgentsCount++;
        }
        _send(abi.encode(aiAgents), _options);
        emit DomainSpecificAiAgentAdded(_domainSpecificAiAgents);
    }

    // TODO: How to use ipMetadata?
    function _registerAiAgentIp(string memory metadata, string memory ipMetadata) internal returns(address groupId, address aiAgentId) {
        groupId = GROUPING_MODULE.registerGroup(address(SPLIT_POOL));
        uint256 tokenId = gojoAiAgentNft.safeMint(address(this), metadata);

        aiAgentId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoAiAgentNft), tokenId);
        
        LICENSING_MODULE.attachLicenseTerms(groupId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);
        address[] memory parentIpIds = new address[](1);
        parentIpIds[0] = groupId;
        uint256[] memory licenseTermIds = new uint256[](1);
        licenseTermIds[0] = NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE;
        // TODO: How to mint derivative without having to mint license tokens and not allow anyone to mint any license tokens?
        // LICENSING_MODULE.registerDerivative(aiAgentId, parentIpIds, licenseTermIds, PIL_LICENSE_TEMPLATE, "", 0); 

        gojoAiAgentNft.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function createResource(string memory metadata, uint32 aiAgentId) external {
        resources[resourceIdCount] = Resource(metadata, msg.sender, 0, 0, 0);

        // TODO: Create IP
        uint256 assetTokenId = 0;
        uint256 ipTokenId = 0;

        emit ResourceUploaded(resourceIdCount, metadata, msg.sender, assetTokenId, ipTokenId, aiAgentId);
        resourceIdCount++;
    }

    function _send(
        bytes memory _payload,
        bytes calldata _options
    ) internal {
        MessagingReceipt memory _receipt = _lzSend(
            STORY_EID,
            _payload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
        emit MessageSent(_receipt.guid, STORY_EID, _payload, _receipt.fee, _receipt.nonce);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _payload,
        address _executor,  
        bytes calldata _extraData  
    ) internal override  onlyGojoCore(_origin.srcEid, _origin.sender){
        Project memory project = abi.decode(_payload, (Project));   
        IGojoStoryUsdWrapper(gojoStoryUsdWrapperAddress).unwrap(project.ipConsumption);
        exportedProjects[exportedProjectsCount] = project;
        uint256 aiAgentsUsed = project.aiAgentsUsed.length;
        uint256 revenuePerAgent = project.ipConsumption / aiAgentsUsed;
        for(uint i = 0; i < aiAgentsUsed; i++) aiAgentsRevenue[project.aiAgentsUsed[i]] += revenuePerAgent;
        emit MessageReceived(_guid, _origin, _executor, _payload, _extraData);
        exportedProjectsCount++;
    }

    function getQuote(uint32 _dstEid, string memory _message, bytes calldata _options) external view returns (uint256, uint256) {
        MessagingFee memory quote=_quote(_dstEid, abi.encode(_message), _options, false);
        return (quote.nativeFee, quote.lzTokenFee);
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }

}