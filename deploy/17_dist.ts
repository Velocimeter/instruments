import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
// import * as tasks1 from 'tasks/deploy/arbHardhat'

import arbTestnetConfig from '../tasks/deploy/constants/arbTestnetConfig'
import arbConfig from '../tasks/deploy/constants/arbConfig'

const ARB_TEST_CONFIG = arbConfig

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre
  const minter = await ethers.getContract('Minter')

  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const flow = await deployments.get('Flow')

  // Initial veFLOW distro
  await minter.initialize(
    ARB_TEST_CONFIG.partnerAddrs,
    ARB_TEST_CONFIG.partnerAmts,
    ARB_TEST_CONFIG.partnerMax
  )
  // console.log('veVELO not distributed yet') // we will run this when we want to start the epoch and have the NFTs
  
  console.log('Velocimeter Instruments deployed')

  return true
}
export default func
func.tags = ['initial_dist']
func.id = 'initial_dist'
