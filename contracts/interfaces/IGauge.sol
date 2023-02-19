pragma solidity 0.8.13;

interface IGauge {
    function notifyRewardAmount(address token, uint256 amount) external;
    function getReward(address account, address[] memory tokens) external;
    function left(address token) external view returns (uint256);
    function isForPair() external view returns (bool);
}
