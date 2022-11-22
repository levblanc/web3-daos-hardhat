// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    /**
     * @dev Emitted when the stored value changes
     */
    event ValueChanged(uint256 newValue);

    /**
     * @dev Stores a new value in the contract
     */
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    /**
     * @dev Returns last stored value
     */
    function retrieve() public view returns (uint256) {
        return value;
    }
}
