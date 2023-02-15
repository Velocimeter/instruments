import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import cantoConfig from '../tasks/deploy/constants/cantoConfig'
const CANTO_CONFIG = cantoConfig

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre

  const flow = await ethers.getContract('Flow')
  const voter = await ethers.getContract('Voter')
  const minter = await ethers.getContract('Minter')

  // Whitelist
  const nativeToken = [flow.address]
  const tokenWhitelist = nativeToken.concat(CANTO_CONFIG.tokenWhitelist)
  await voter.initialize(tokenWhitelist, minter.address)
  console.log('Whitelist set')

  return true
}
export default func
func.tags = ['whitelist']
func.id = 'whitelist'
