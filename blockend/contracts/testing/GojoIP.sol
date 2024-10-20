// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "../interface/IGojoWrappedUsd.sol";
import "../interface/IGojoStoryUsdWrapper.sol";
import { IGroupingModule } from "../interface/story-protocol-core/IGroupingModule.sol";
import { ILicensingModule } from "../interface/story-protocol-core/ILicensingModule.sol";
import { IIPAssetRegistry } from "../interface/story-protocol-core/IIPAssetRegistry.sol";
import "../interface/INFT.sol";
import "../interface/IMockEvenSplitGroupPool.sol";

error InvalidCaller(address caller);
error NotProjectOwner(uint256 projectId, address owner);
error InvalidCrosschainCaller(uint32 eid, bytes32 caller);

contract GojoIP {
    
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

    constructor(address gojoAiAgentNftAddress, address gojoResourceNftAddress) {
        gojoAiAgentNft = INFT(gojoAiAgentNftAddress);
        gojoResourceNft = INFT(gojoResourceNftAddress);
    }

    event ResourceUploaded(uint256 resourceId, string metadata, string ipMetadata, address owner, uint32 aiAgentId, uint256 assetTokenId, uint256 ipTokenId);
    event DomainSpecificAiAgentAdded(DomainSpecificAiAgent[] agent);

    function registerAiAgentIp(string memory metadata, string memory ipMetadata) external returns(address groupId, address aiAgentId) {
        groupId = GROUPING_MODULE.registerGroup(address(SPLIT_POOL));
        uint256 tokenId = gojoAiAgentNft.safeMint(address(this), metadata);

        aiAgentId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoAiAgentNft), tokenId);
        
        LICENSING_MODULE.attachLicenseTerms(aiAgentId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);

        address[] memory parentIpIds = new address[](1);
        parentIpIds[0] = aiAgentId;
        uint256[] memory licenseTermIds = new uint256[](1);
        licenseTermIds[0] = NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE;

        LICENSING_MODULE.registerDerivative(groupId, parentIpIds, licenseTermIds, PIL_LICENSE_TEMPLATE, ""); 

        gojoAiAgentNft.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    // TODO: How to use ipMetadata?
    function createResource(address groupId, string memory metadata, string memory ipMetadata) external {
        uint256 tokenId = gojoResourceNft.safeMint(address(this), metadata);

        address resourceId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoResourceNft), tokenId);
        LICENSING_MODULE.attachLicenseTerms(resourceId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);
        address[] memory ipIds = new address[](1);
        ipIds[0] = resourceId;

        GROUPING_MODULE.addIp(groupId, ipIds); 
        
        gojoResourceNft.safeTransferFrom(address(this), msg.sender, tokenId);
        // resources[resourceIdCount] = Resource(metadata, ipMetadata, msg.sender, aiAgentId, resourceId, tokenId);
        // emit ResourceUploaded(resourceIdCount, metadata, ipMetadata, msg.sender, aiAgentId, tokenId, resourceIdCount);
        resourceIdCount++;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

}