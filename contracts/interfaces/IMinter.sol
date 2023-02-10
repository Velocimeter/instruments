pragma solidity 0.8.13;

interface IMinter {
  function update_period() external returns (uint);

  function tank() external view returns (address);
}
