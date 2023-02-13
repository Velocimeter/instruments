pragma solidity 0.8.13;

interface IBribe {
    function _deposit(uint256 amount, uint256 tokenId) external; // these were not here?
    function _withdraw(uint256 amount, uint256 tokenId) external;
    function getRewardForOwner(uint256 tokenId, address[] memory tokens) external;
    function notifyRewardAmount(address token, uint256 amount) external;
    function left(address token) external view returns (uint256);
}
