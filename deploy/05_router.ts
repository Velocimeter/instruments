import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import cantoConfig from '../tasks/deploy/constants/cantoConfig'
const CANTO_CONFIG = cantoConfig

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const pairFactory = await deployments.get('PairFactory')

  await deploy('Router', {
    from: deployer,
    args: [pairFactory.address, CANTO_CONFIG.WETH],
    log: true,
    skipIfAlreadyDeployed: false
  })
}
export default func
func.tags = ['Router']
func.id = 'router'
