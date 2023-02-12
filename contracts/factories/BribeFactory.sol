// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "contracts/interfaces/IBribeFactory.sol";
import "contracts/InternalBribe.sol";
import "contracts/ExternalBribe.sol";

contract BribeFactory is IBribeFactory {
    address public last_internal_bribe;
    address public last_external_bribe;
    address public last_nexternal_bribe;

    function createInternalBribe(address[] memory allowedRewards) external returns (address) {
        last_internal_bribe = address(new InternalBribe(msg.sender, allowedRewards));
        return last_internal_bribe;
    }

    function createExternalBribe(address[] memory allowedRewards) external returns (address) {
        last_external_bribe = address(new ExternalBribe(msg.sender, allowedRewards));
        return last_external_bribe;
    }

    // adding a new function instead of updating old one so tests still work

    function createNexternalBribe(address[] memory allowedRewards) external returns (address) {
        last_nexternal_bribe = address(new NexternalBribe(msg.sender, allowedRewards));
        return last_nexternal_bribe;
    }
}
