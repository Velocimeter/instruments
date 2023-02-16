import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import cantoConfig from '../tasks/deploy/constants/cantoConfig'
const CANTO_CONFIG = cantoConfig

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre

  const { deployer } = await getNamedAccounts()

  const flow = await ethers.getContract('Flow')
  const pairFactory = await ethers.getContract('PairFactory')
  const escrow = await ethers.getContract('VotingEscrow')
  const voter = await ethers.getContract('Voter')
  const wrappedXBribeFactory = await ethers.getContract(
    'WrappedExternalBribeFactory'
  )
  const distributor = await ethers.getContract('RewardsDistributor')
  // const governor = await ethers.getContract('FlowGovernor')
  const minter = await ethers.getContract('Minter')
  // const receiver = await ethers.getContract('RedemptionReceiver')

  // const claim = await deployments.get('MerkleClaim')

  // Initialize
  await flow.initialMint(CANTO_CONFIG.teamEOA)
  console.log('400m Initial minted')

  // await flow.setRedemptionReceiver(receiver.address)
  // console.log('RedemptionReceiver set')

  // await flow.setMerkleClaim(claim.address)
  // console.log('MerkleClaim set')

  await flow.setMinter(minter.address)
  console.log('Minter set on flow contract')

  await pairFactory.setPauser(CANTO_CONFIG.teamMultisig)
  console.log(
    'Pauser set on pair factory to multisig: ',
    CANTO_CONFIG.teamMultisig
  )

  // how to use msg.sender in hardhat scripts is the deployer address

  await escrow.setVoter(voter.address)
  await wrappedXBribeFactory.setVoter(voter.address)
  console.log(
    'idk how Voter set when it requires msg.sender to be the voter contract print msg.sender:',
    deployer,
    'voter address: ',
    voter.address,
    'escrow address: ',
    escrow.address
  )

  await escrow.setTeam(CANTO_CONFIG.teamMultisig)
  console.log('Team multisig set for escrow', CANTO_CONFIG.teamMultisig)

  // await voter.setGovernor(CANTO_CONFIG.teamMultisig)
  // console.log('Governor set on voter to: ', CANTO_CONFIG.teamMultisig)

  await voter.setEmergencyCouncil(CANTO_CONFIG.teamMultisig)
  console.log('Emergency Council set on voter to: ', CANTO_CONFIG.teamMultisig)

  await distributor.setDepositor(minter.address)
  console.log('Depositor set to minter contract address')

  // await receiver.setTeam(CANTO_CONFIG.teamMultisig)
  // console.log('Team set for receiver')

  // await governor.setTeam(CANTO_CONFIG.teamMultisig)
  // console.log('Team set for governor')

  await minter.setTeam(CANTO_CONFIG.teamMultisig)
  console.log('Team set for minter to multisig: ', CANTO_CONFIG.teamMultisig)

  // new init settings for updated pair -> fees -> bribes system

  await pairFactory.setTeam(CANTO_CONFIG.teamMultisig)
  console.log(
    'Team set on Pair factory to multisig: ',
    CANTO_CONFIG.teamMultisig
  )

  await pairFactory.setTank(CANTO_CONFIG.teamMultisig)
  console.log(
    'Set tank on Pair factory to multisig for now - later we update to another multisig or contract: ',
    CANTO_CONFIG.teamMultisig
  )

  await pairFactory.setVoter(voter.address)
  console.log('Voter set on Pair factory to to voter contract: ', voter.address)

  // await minter.initialize(
  //   CANTO_CONFIG.partnerAddrs,
  //   CANTO_CONFIG.partnerAmts,
  //   CANTO_CONFIG.partnerMax
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
