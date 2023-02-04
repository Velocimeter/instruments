import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import arbConfig from '../tasks/deploy/constants/arbConfig'

const ARB_TEST_CONFIG = arbConfig

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre

  const flow = await ethers.getContract('Flow')
  const pairFactory = await ethers.getContract('PairFactory')
  const escrow = await ethers.getContract('VotingEscrow')
  const voter = await ethers.getContract('Voter')
  const distributor = await ethers.getContract('RewardsDistributor')
  // const governor = await ethers.getContract('FlowGovernor')
  const minter = await ethers.getContract('Minter')
  // const receiver = await ethers.getContract('RedemptionReceiver')

  // const claim = await deployments.get('MerkleClaim')

  // Initialize
  await flow.initialMint(ARB_TEST_CONFIG.teamEOA)
  console.log('400m Initial minted')

  // await flow.setRedemptionReceiver(receiver.address)
  // console.log('RedemptionReceiver set')

  // await flow.setMerkleClaim(claim.address)
  // console.log('MerkleClaim set')

  await flow.setMinter(minter.address)
  console.log('Minter set on flow contract')

  await pairFactory.setPauser(ARB_TEST_CONFIG.teamMultisig)
  console.log(
    'Pauser set on pair factory to multisig: ',
    ARB_TEST_CONFIG.teamMultisig
  )

  await escrow.setVoter(voter.address)
  console.log(
    'Voter set',
    'voter address: ',
    voter.address,
    'escrow address: ',
    escrow.address
  )

  await escrow.setTeam(ARB_TEST_CONFIG.teamMultisig)
  console.log('Team multisig set for escrow', ARB_TEST_CONFIG.teamMultisig)

  await voter.setGovernor(ARB_TEST_CONFIG.teamMultisig)
  console.log('Governor set on voter to: ', ARB_TEST_CONFIG.teamMultisig)

  await voter.setEmergencyCouncil(ARB_TEST_CONFIG.teamMultisig)
  console.log(
    'Emergency Council set on voter to: ',
    ARB_TEST_CONFIG.teamMultisig
  )

  await distributor.setDepositor(minter.address)
  console.log('Depositor set to minter contract address')

  // await receiver.setTeam(ARB_TEST_CONFIG.teamMultisig)
  // console.log('Team set for receiver')

  // await governor.setTeam(ARB_TEST_CONFIG.teamMultisig)
  // console.log('Team set for governor')

  await minter.setTeam(ARB_TEST_CONFIG.teamMultisig)
  console.log('Team set for minter to multisig: ', ARB_TEST_CONFIG.teamMultisig)

  // await minter.initialize(
  //   ARB_TEST_CONFIG.partnerAddrs,
  //   ARB_TEST_CONFIG.partnerAmts,
  //   ARB_TEST_CONFIG.partnerMax
  // )

  // create pair
  // provide liq
  // etc etc
  // see forge tests for more details

  return true
}
export default func
func.tags = ['init_deploy']
func.id = 'init_deploy'
