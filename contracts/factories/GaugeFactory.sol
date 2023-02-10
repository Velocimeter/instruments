// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "contracts/interfaces/IGaugeFactory.sol";
import "contracts/Gauge.sol";

// abstract contract GaugeFactory is
//     IGaugeFactory // marked as abstract - has functions that are not implemented
// {
//     address public last_gauge;

//     function createGauge(
//         address _stake,
//         address _pool,
//         address _external_bribe,
//         address _ve,
//         bool isPair,
//         address[] memory allowedRewards
//     ) external returns (address) {
//         last_gauge = address(
//             new Gauge(
//                 _stake,
//                 _pool,
//                 _external_bribe,
//                 _ve,
//                 msg.sender,
//                 isPair,
//                 allowedRewards
//             )
//         );
//         return last_gauge;
//     }
// }

contract GaugeFactory is IGaugeFactory {
    address public last_gauge;

    function createGauge(
        address _pool,
        address _internal_bribe,
        address _external_bribe,
        address _ve,
        bool isPair,
        address[] memory allowedRewards
    ) external returns (address) {
        last_gauge = address(
            new Gauge(
                _pool,
                _internal_bribe,
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
