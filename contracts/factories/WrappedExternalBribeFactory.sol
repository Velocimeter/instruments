// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {WrappedExternalBribe} from 'contracts/WrappedExternalBribe.sol';

contract WrappedExternalBribeFactory {
    bool internal _initialized;
    address public voter;
    mapping(address => address) public oldBribeToNew;
    address public last_bribe;
    address immutable deployer;
    address team;

    constructor() {
        deployer = msg.sender;
    }

    function createBribe(address existing_bribe) external returns (address) {
        require(_initialized, "Not initialized");
        require(
            oldBribeToNew[existing_bribe] == address(0),
            "Wrapped bribe already created"
        );
        last_bribe = address(new WrappedExternalBribe(voter, existing_bribe));
        oldBribeToNew[existing_bribe] = last_bribe;
        return last_bribe;
    }

    function setVoter(address _voter) external {
        require(msg.sender == deployer, "Not authorized");
        require(!_initialized, "Already initialized");
        voter = _voter;
        _initialized = true;
    }

    function setTeam(address _team) external {
        require(msg.sender == deployer, "Not authorized");
        team = _team;
    }

    function acceptVoter(address _voter) external {
        require(msg.sender == team, "Not authorized");
        voter = _voter;
    }
}
