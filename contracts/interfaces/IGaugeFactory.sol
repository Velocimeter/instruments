pragma solidity 0.8.13;

interface IGaugeFactory {
    function createGauge(
        address,
        address,
        address,
        bool,
        address[] memory
    ) external returns (address);

    function last_gauge() external view returns (address);
}
//
