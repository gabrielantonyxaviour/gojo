

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


interface IGojoStoryUsdWrapper {
    function unwrap(uint256 _amount) external payable;
}