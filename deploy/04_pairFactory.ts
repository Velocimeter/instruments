import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy('PairFactory', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false
  })
}
export default func
func.tags = ['PairFactory']
func.id = 'pairFactory'
