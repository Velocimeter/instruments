"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const optimismConfig_1 = __importDefault(require("./constants/optimismConfig"));
const testOptimismConfig_1 = __importDefault(require("./constants/testOptimismConfig"));
const fantomConfig_1 = __importDefault(require("./constants/fantomConfig"));
const testFantomConfig_1 = __importDefault(require("./constants/testFantomConfig"));
(0, config_1.task)('deploy:op', 'Deploys Optimism contracts').setAction(async function (taskArguments, { ethers }) {
    const mainnet = false;
    const OP_CONFIG = mainnet ? optimismConfig_1.default : testOptimismConfig_1.default;
    const FTM_CONFIG = mainnet ? fantomConfig_1.default : testFantomConfig_1.default;
    // Load
    const [Flow, GaugeFactory, BribeFactory, PairFactory, Router, Library, VeArtProxy, VotingEscrow, RewardsDistributor, Voter, Minter, FlowGovernor, RedemptionReceiver, MerkleClaim] = await Promise.all([
        ethers.getContractFactory('Flow'),
        ethers.getContractFactory('GaugeFactory'),
        ethers.getContractFactory('BribeFactory'),
        ethers.getContractFactory('PairFactory'),
        ethers.getContractFactory('Router'),
        ethers.getContractFactory('VelocimeterLibrary'),
        ethers.getContractFactory('VeArtProxy'),
        ethers.getContractFactory('VotingEscrow'),
        ethers.getContractFactory('RewardsDistributor'),
        ethers.getContractFactory('Voter'),
        ethers.getContractFactory('Minter'),
        ethers.getContractFactory('FlowGovernor'),
        ethers.getContractFactory('RedemptionReceiver'),
        ethers.getContractFactory('MerkleClaim')
    ]);
    const flow = await Flow.deploy();
    await flow.deployed();
    console.log('Flow deployed to: ', flow.address);
    const gaugeFactory = await GaugeFactory.deploy();
    await gaugeFactory.deployed();
    console.log('GaugeFactory deployed to: ', gaugeFactory.address);
    const bribeFactory = await BribeFactory.deploy();
    await bribeFactory.deployed();
    console.log('BribeFactory deployed to: ', bribeFactory.address);
    const pairFactory = await PairFactory.deploy();
    await pairFactory.deployed();
    console.log('PairFactory deployed to: ', pairFactory.address);
    const router = await Router.deploy(pairFactory.address, OP_CONFIG.WETH);
    await router.deployed();
    console.log('Router deployed to: ', router.address);
    console.log('Args: ', pairFactory.address, OP_CONFIG.WETH, '\n');
    const library = await Library.deploy(router.address);
    await library.deployed();
    console.log('VelocimeterLibrary deployed to: ', library.address);
    console.log('Args: ', router.address, '\n');
    const artProxy = await VeArtProxy.deploy();
    await artProxy.deployed();
    console.log('VeArtProxy deployed to: ', artProxy.address);
    const escrow = await VotingEscrow.deploy(flow.address, artProxy.address);
    await escrow.deployed();
    console.log('VotingEscrow deployed to: ', escrow.address);
    console.log('Args: ', flow.address, artProxy.address, '\n');
    const distributor = await RewardsDistributor.deploy(escrow.address);
    await distributor.deployed();
    console.log('RewardsDistributor deployed to: ', distributor.address);
    console.log('Args: ', escrow.address, '\n');
    const voter = await Voter.deploy(escrow.address, pairFactory.address, gaugeFactory.address, bribeFactory.address);
    await voter.deployed();
    console.log('Voter deployed to: ', voter.address);
    console.log('Args: ', escrow.address, pairFactory.address, gaugeFactory.address, bribeFactory.address, '\n');
    const minter = await Minter.deploy(voter.address, escrow.address, distributor.address);
    await minter.deployed();
    console.log('Minter deployed to: ', minter.address);
    console.log('Args: ', voter.address, escrow.address, distributor.address, '\n');
    const receiver = await RedemptionReceiver.deploy(OP_CONFIG.USDC, flow.address, FTM_CONFIG.lzChainId, OP_CONFIG.lzEndpoint);
    await receiver.deployed();
    console.log('RedemptionReceiver deployed to: ', receiver.address);
    console.log('Args: ', OP_CONFIG.USDC, flow.address, FTM_CONFIG.lzChainId, OP_CONFIG.lzEndpoint, '\n');
    const governor = await FlowGovernor.deploy(escrow.address);
    await governor.deployed();
    console.log('FlowGovernor deployed to: ', governor.address);
    console.log('Args: ', escrow.address, '\n');
    // Airdrop
    const claim = await MerkleClaim.deploy(flow.address, OP_CONFIG.merkleRoot);
    await claim.deployed();
    console.log('MerkleClaim deployed to: ', claim.address);
    console.log('Args: ', flow.address, OP_CONFIG.merkleRoot, '\n');
    // Initialize
    await flow.initialMint(OP_CONFIG.teamEOA);
    console.log('Initial minted');
    await flow.setRedemptionReceiver(receiver.address);
    console.log('RedemptionReceiver set');
    await flow.setMerkleClaim(claim.address);
    console.log('MerkleClaim set');
    await flow.setMinter(minter.address);
    console.log('Minter set');
    await pairFactory.setPauser(OP_CONFIG.teamMultisig);
    console.log('Pauser set');
    await escrow.setVoter(voter.address);
    console.log('Voter set');
    await escrow.setTeam(OP_CONFIG.teamMultisig);
    console.log('Team set for escrow');
    await voter.setGovernor(OP_CONFIG.teamMultisig);
    console.log('Governor set');
    await voter.setEmergencyCouncil(OP_CONFIG.teamMultisig);
    console.log('Emergency Council set');
    await distributor.setDepositor(minter.address);
    console.log('Depositor set');
    await receiver.setTeam(OP_CONFIG.teamMultisig);
    console.log('Team set for receiver');
    await governor.setTeam(OP_CONFIG.teamMultisig);
    console.log('Team set for governor');
    // Whitelist
    const nativeToken = [flow.address];
    const tokenWhitelist = nativeToken.concat(OP_CONFIG.tokenWhitelist);
    await voter.initialize(tokenWhitelist, minter.address);
    console.log('Whitelist set');
    // Initial veVELO distro
    await minter.initialize(OP_CONFIG.partnerAddrs, OP_CONFIG.partnerAmts, OP_CONFIG.partnerMax);
    console.log('veVELO distributed');
    await minter.setTeam(OP_CONFIG.teamMultisig);
    console.log('Team set for minter');
    console.log('Optimism contracts deployed');
});
