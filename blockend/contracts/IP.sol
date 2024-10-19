// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IGroupingModule } from "./interface/story-protocol-core/IGroupingModule.sol";
import { ILicensingModule } from "./interface/story-protocol-core/ILicensingModule.sol";
import { IIPAssetRegistry } from "./interface/story-protocol-core/IIPAssetRegistry.sol";
import "./interface/INFT.sol";

contract GojoIP {
    IIPAssetRegistry public constant IP_ASSET_REGISTRY = IIPAssetRegistry(0x1a9d0d28a0422F26D31Be72Edc6f13ea4371E11B);
    IGroupingModule public constant GROUPING_MODULE = IGroupingModule(0x26Eb59B900FD158396931d2349Fd6B08f0390e76);
    ILicensingModule public constant LICENSING_MODULE = ILicensingModule(0xd81fd78f557b457b4350cB95D20b547bFEb4D857);

    INFT public immutable gojoAiAgentNft;
    INFT public immutable gojoResourceNft;
    INFT public immutable gojoResourceGroupNft;

    constructor(address gojoAiAgentNftAddress, address gojoResourceNftAddress, address gojoResourceGroupNftAddress) {
        gojoAiAgentNft = INFT(gojoAiAgentNftAddress);
        gojoResourceNft = INFT(gojoResourceNftAddress);
        gojoResourceGroupNft = INFT(gojoResourceGroupNftAddress);
    }

    function createAiAgent(string memory metadata, string memory ipMetadata) external{
        // Register group IP
        // Create AI Agent IP
        // Mint license token to the AI agent or make the AI agent derivtive of the group IP with commerical use License
    }

    function createResource() external{
        // Create Resource IP and add it to the group IP
    }

    function mintIp() external returns (address ipId, uint256 tokenId) {
        // tokenId = gojoResourceNft.mint(msg.sender);
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenId);
    }

    function createAiAgent(string memory metadata) external returns (address ipId, uint256 tokenId) {
        tokenId = SIMPLE_NFT.mint(msg.sender);
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenId);
    }





}