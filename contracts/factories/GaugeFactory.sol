// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "contracts/interfaces/IGaugeFactory.sol";
import "contracts/Gauge.sol";

// check if github copilot is working

// function delaration

// solidity code

abstract contract GaugeFactory is
    IGaugeFactory // marked as abstract - has functions that are not implemented
{
    address public last_gauge;

    function createGauge(
        address _stake,
        address _pool,
        address _external_bribe,
        address _ve,
        bool isPair,
        address[] memory allowedRewards
    ) external returns (address) {
        last_gauge = address(
            new Gauge(
                stake = _stake,
                _pool,
                _external_bribe,
                _ve,
                msg.sender,
                isPair,
                allowedRewards
            )
        );
        return last_gauge;
    }
}
