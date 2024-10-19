// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IIPAssetRegistry {
    function register(uint256 chainId, address tokenContract, uint256 tokenId) external returns (address);
}



contract GojoIP {
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;

    constructor(address ipAssetRegistry) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(ipAssetRegistry);
        SIMPLE_NFT = new SimpleNFT(msg.sender);
    }

    function mintIp() external returns (address ipId, uint256 tokenId) {
        tokenId = SIMPLE_NFT.mint(msg.sender);
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenId);
    }

    function createAiAgent(string memory metadata) external returns (address ipId, uint256 tokenId) {
        tokenId = SIMPLE_NFT.mint(msg.sender);
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(SIMPLE_NFT), tokenId);
    }


}