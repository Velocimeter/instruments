import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy('WrappedExternalBribeFactory', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false
  })
}
export default func
func.tags = ['WrappedExternalBribeFactory']
func.id = 'wrapped-external-bribe-factory'
