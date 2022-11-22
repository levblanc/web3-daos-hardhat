// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Give user time to "get out" if they don't like a governance update

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay: How long you have to wait before executing
    // proposers: the list of addresses that can propose
    // executors: who can execute when a proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors, msg.sender) {}
}
