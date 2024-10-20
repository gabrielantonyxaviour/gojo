// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { OApp, Origin, MessagingFee, MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
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

contract GojoStoryCore is OApp, OAppOptionsType3 {
    
    struct ConstructorParams{
        address endpoint;
        address gojoCoreAIAgent;
        address gojoRelayer;
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
    bytes32 public gojoRelayer;
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
        gojoRelayer = addressToBytes32(_params.gojoRelayer);
    }

    event ResourceUploaded(uint256 resourceId, string metadata, string ipMetadata, address owner, address registeredIp, uint32 aiAgentId, uint256 assetTokenId);
    event DomainSpecificAiAgentAdded(uint32 aiAgentId, DomainSpecificAiAgent agent);
    event MessageSent(bytes32 guid, uint32 dstEid, bytes payload, MessagingFee fee, uint64 nonce);
    event MessageReceived(bytes32 guid, Origin origin, address executor, bytes payload, bytes extraData);
    
    modifier onlyGojoRelayer(uint32 _eid, bytes32 _sender){
        if(_eid != POLYGON_EID || _sender != gojoRelayer) revert InvalidCrosschainCaller(_eid, _sender);
        _;
    }

    function setGojoCoreAddress(address _gojoCoreAddress) external onlyOwner {
        gojoCoreAddress = addressToBytes32(_gojoCoreAddress);
        setPeer(STORY_EID, addressToBytes32(_gojoCoreAddress));
    }

    function setGojoStoryUsdWrapperAddress(address _gojoStoryUsdWrapperAddress) external onlyOwner {
        gojoStoryUsdWrapperAddress = _gojoStoryUsdWrapperAddress;
    }

    function registerAiAgentIp(string memory metadata, string memory ipMetadata) external returns(address groupId, address aiAgentId) {
        groupId = GROUPING_MODULE.registerGroup(address(SPLIT_POOL));
        uint256 tokenId = gojoAiAgentNft.safeMint(address(this), metadata);

        aiAgentId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoAiAgentNft), tokenId);
        LICENSING_MODULE.attachLicenseTerms(aiAgentId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);

        address[] memory parentIpIds = new address[](1);
        parentIpIds[0] = aiAgentId;
        uint256[] memory licenseTermIds = new uint256[](1);
        licenseTermIds[0] = NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE;

        domainSpecificAiAgents[aiAgentsCount] = DomainSpecificAiAgent(metadata, ipMetadata, groupId, aiAgentId);
        LICENSING_MODULE.registerDerivative(groupId, parentIpIds, licenseTermIds, PIL_LICENSE_TEMPLATE, ""); 
        gojoAiAgentNft.safeTransferFrom(address(this), msg.sender, tokenId);
        emit DomainSpecificAiAgentAdded(aiAgentsCount, domainSpecificAiAgents[aiAgentsCount]);    
        aiAgentsCount++;
    }

    function createResource(uint32 aiAgentId, string memory metadata, string memory ipMetadata) external {
        uint256 tokenId = gojoResourceNft.safeMint(address(this), metadata);
        address groupId = domainSpecificAiAgents[aiAgentId].resourceGroupAddress;

        address resourceId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoResourceNft), tokenId);
        LICENSING_MODULE.attachLicenseTerms(resourceId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);
        
        address[] memory ipIds = new address[](1);
        ipIds[0] = resourceId;
        GROUPING_MODULE.addIp(groupId, ipIds); 
        
        gojoResourceNft.safeTransferFrom(address(this), msg.sender, tokenId);
        resources[resourceIdCount] = Resource(metadata, ipMetadata, msg.sender, aiAgentId, resourceId, tokenId);
        emit ResourceUploaded(resourceIdCount, metadata, ipMetadata, msg.sender, resourceId, aiAgentId, tokenId);
        resourceIdCount++;
    }

    function combineOptionsHelper(uint32 _dstEid, uint16 _msgType, bytes calldata _extraOptions) external view returns (bytes memory) {
        return combineOptions(_dstEid, _msgType, _extraOptions);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _payload,
        address _executor,  
        bytes calldata _extraData  
    ) internal override  onlyGojoRelayer(_origin.srcEid, _origin.sender){
        (Project memory project) = abi.decode(_payload, (Project));

        IGojoStoryUsdWrapper(gojoStoryUsdWrapperAddress).unwrap(project.ipConsumption);
        exportedProjects[exportedProjectsCount] = project;

        uint256 aiAgentsUsed = project.aiAgentsUsed.length;
        uint256 revenuePerAgent = project.ipConsumption / aiAgentsUsed;

        for(uint i = 0; i < aiAgentsUsed; i++) aiAgentsRevenue[project.aiAgentsUsed[i]] += revenuePerAgent;

        emit MessageReceived(_guid, _origin, _executor, _payload, _extraData);
        exportedProjectsCount++;
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
    
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

}