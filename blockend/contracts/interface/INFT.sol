// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;


interface INFT  {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeMint(address to, string memory uri) external returns (uint256);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}