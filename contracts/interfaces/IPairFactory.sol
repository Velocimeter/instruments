pragma solidity 0.8.13;

interface IPairFactory {
    function allPairsLength() external view returns (uint256);

    function isPair(address pair) external view returns (bool);

    function pairCodeHash() external pure returns (bytes32);

    function getPair(
        address tokenA,
        address token,
        bool stable
    ) external view returns (address);

    function createPair(
        address tokenA,
        address tokenB,
        bool stable
    ) external returns (address pair);

    // function setVoter(address _voter) external; it seems we dont need to add these to the interface??

    // function getVoter(address pair) external view returns (uint256);
}
