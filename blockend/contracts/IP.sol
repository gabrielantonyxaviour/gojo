// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IGroupingModule } from "./interface/story-protocol-core/IGroupingModule.sol";
import { ILicensingModule } from "./interface/story-protocol-core/ILicensingModule.sol";
import { IIPAssetRegistry } from "./interface/story-protocol-core/IIPAssetRegistry.sol";
import "./interface/INFT.sol";
import "./interface/IMockEvenSplitGroupPool.sol";

contract GojoIP {
    IIPAssetRegistry public constant IP_ASSET_REGISTRY = IIPAssetRegistry(0x1a9d0d28a0422F26D31Be72Edc6f13ea4371E11B);
    IGroupingModule public constant GROUPING_MODULE = IGroupingModule(0x26Eb59B900FD158396931d2349Fd6B08f0390e76);
    ILicensingModule public constant LICENSING_MODULE = ILicensingModule(0xd81fd78f557b457b4350cB95D20b547bFEb4D857);
    IMockEvenSplitGroupPool public constant SPLIT_POOL = IMockEvenSplitGroupPool(0x69e0D5123bc0539a87a9dDcE82E803575e35cbb4);
    address public constant PIL_LICENSE_TEMPLATE=0x0752f61E59fD2D39193a74610F1bd9a6Ade2E3f9;
    uint256 public constant NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE = 2;

    INFT public immutable gojoAiAgentNft;
    INFT public immutable gojoResourceNft;
    INFT public immutable gojoResourceGroupNft;

    uint32 public aiAgentIdCounter;
    mapping(uint32 => address) public aiAgents;
    constructor(address gojoAiAgentNftAddress, address gojoResourceNftAddress) {
        gojoAiAgentNft = INFT(gojoAiAgentNftAddress);
        gojoResourceNft = INFT(gojoResourceNftAddress);
    }

    function createAiAgent(string memory metadata, string memory ipMetadata) external {
        address groupId = GROUPING_MODULE.registerGroup(address(SPLIT_POOL));
        uint256 tokenId = gojoAiAgentNft.safeMint(address(this), metadata);

        address aiAgentId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoAiAgentNft), tokenId);
        
        LICENSING_MODULE.attachLicenseTerms(groupId, PIL_LICENSE_TEMPLATE, NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE);
        address[] memory parentIpIds = new address[](1);
        parentIpIds[0] = groupId;
        uint256[] memory licenseTermIds = new uint256[](1);
        licenseTermIds[0]=NON_TRANSFERRABLE_COMMERCIAL_USE_LICENSE;
        LICENSING_MODULE.registerDerivative(aiAgentId, parentIpIds, licenseTermIds, PIL_LICENSE_TEMPLATE, "", 0);

        gojoAiAgentNft.safeTransferFrom(address(this), msg.sender, tokenId);
        aiAgents[aiAgentIdCounter] = aiAgentId;
        aiAgentIdCounter++;
    }

    function createResource(uint32 aiAgentId, string memory metadata) external{
        uint256 tokenId = gojoResourceNft.safeMint(address(this), metadata);

        address resourceId = IP_ASSET_REGISTRY.register(block.chainid, address(gojoResourceNft), tokenId);
        address[] memory ipIds = new address[](1);
        ipIds[0] = resourceId;
        GROUPING_MODULE.addIp(aiAgents[aiAgentId], ipIds);
        
        gojoResourceNft.safeTransferFrom(address(this), msg.sender, tokenId);
    }

}