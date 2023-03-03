// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import 'contracts/interfaces/IPairFactory.sol';
import 'contracts/Pair.sol';

contract PairFactory is IPairFactory {

    bool public isPaused;
    address public pauser;
    address public pendingPauser;

    uint256 public stableFee;
    uint256 public volatileFee;
    uint256 public constant MAX_FEE = 50; // 0.5%
    address public feeManager;
    address public pendingFeeManager;
    address public voter;
    address public team;
    bool internal initial_voter_set;
    bool internal initial_tank_set;
    address public tank;
    address public deployer;

    mapping(address => mapping(address => mapping(bool => address))) public getPair;
    address[] public allPairs;
    mapping(address => bool) public isPair; // simplified check if its a pair, given that `stable` flag might not be available in peripherals

    address internal _temp0;
    address internal _temp1;
    bool internal _temp;

    event PairCreated(address indexed token0, address indexed token1, bool stable, address pair, uint);

    constructor() {
        pauser = msg.sender;
        isPaused = false;
        feeManager = msg.sender;
        stableFee = 3; // 0.03%
        volatileFee = 25; // 0.25%
        deployer = msg.sender;
    }

    function setTeam(address _team) external {
        require(msg.sender == deployer); // might need to set this to deployer?? or just make it
        require(team == address(0), 'The team has already been set.');
        team = _team;
    }

    function setVoter(address _voter) external {
        require(!initial_voter_set, 'The voter has already been set.');
        require(msg.sender == deployer); // have to make sure that this can be set to the voter addres during init script
        voter = _voter;
        initial_voter_set = true;
    }

    function setTank(address _tank) external {
        require(!initial_tank_set, 'The tank has already been set.');
        require(msg.sender == deployer); // this should be updateable to team but adding deployer so that init script can run..
        tank = _tank;
        initial_tank_set = true;
    }

    function acceptTank(address _tank) external {
        require(msg.sender == team, 'not pending team');
        tank = _tank;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function setPauser(address _pauser) external {
        require(msg.sender == pauser);
        pendingPauser = _pauser;
    }

    function acceptPauser() external {
        require(msg.sender == pendingPauser);
        pauser = pendingPauser;
    }

    function setPause(bool _state) external {
        require(msg.sender == pauser);
        isPaused = _state;
    }

    function setFeeManager(address _feeManager) external {
        require(msg.sender == feeManager, 'not fee manager');
        pendingFeeManager = _feeManager;
    }

    function acceptFeeManager() external {
        require(msg.sender == pendingFeeManager, 'not pending fee manager');
        feeManager = pendingFeeManager;
    }

    function setFee(bool _stable, uint256 _fee) external {
        require(msg.sender == feeManager, 'not fee manager');
        require(_fee <= MAX_FEE, 'fee too high');
        require(_fee != 0, 'fee must be nonzero');
        if (_stable) {
            stableFee = _fee;
        } else {
            volatileFee = _fee;
        }
    }

    function getFee(bool _stable) public view returns(uint256) {
        return _stable ? stableFee : volatileFee;
    }

    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(Pair).creationCode);
    }

    function getInitializable() external view returns (address, address, bool) {
        return (_temp0, _temp1, _temp);
    }

    function createPair(address tokenA, address tokenB, bool stable) external returns (address pair) {
        require(tokenA != tokenB, 'IA'); // Pair: IDENTICAL_ADDRESSES
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'ZA'); // Pair: ZERO_ADDRESS
        require(getPair[token0][token1][stable] == address(0), 'PE'); // Pair: PAIR_EXISTS - single check is sufficient
        bytes32 salt = keccak256(abi.encodePacked(token0, token1, stable)); // notice salt includes stable as well, 3 parameters
        (_temp0, _temp1, _temp) = (token0, token1, stable);
        pair = address(new Pair{salt:salt}());
        getPair[token0][token1][stable] = pair;
        getPair[token1][token0][stable] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        isPair[pair] = true;
        emit PairCreated(token0, token1, stable, pair, allPairs.length);
    }
}
