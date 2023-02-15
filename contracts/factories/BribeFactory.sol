// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "contracts/interfaces/IBribeFactory.sol";
import "contracts/InternalBribe.sol";
import "contracts/ExternalBribe.sol";
import "contracts/interfaces/ITurnstile.sol";

contract BribeFactory is IBribeFactory {
    address internal multisig = 0x0a178469E3d08BEAA0a289E416Ab924F10807989;
    address internal turnstile = 0xEcf044C5B4b867CFda001101c617eCd347095B44;
    address public last_internal_bribe;
    address public last_external_bribe;

    constructor() {
        ITurnstile(turnstile).register(multisig);
    }

    function createInternalBribe(address[] memory allowedRewards) external returns (address) {
        last_internal_bribe = address(new InternalBribe(msg.sender, allowedRewards));
        return last_internal_bribe;
    }

    function createExternalBribe(address[] memory allowedRewards) external returns (address) {
        last_external_bribe = address(new ExternalBribe(msg.sender, allowedRewards));
        return last_external_bribe;
    }
}
