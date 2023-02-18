import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

task('setArtProxy', 'Sets the art proxy address in the VotingEscrow contract')
  .addParam('address', 'The address of the art proxy contract')
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { VotingEscrow } = await hre.ethers.getContract('VotingEscrow')
    const votingEscrow = await VotingEscrow.attach(
      '0x990efF367C6c4aece43c1E98099061c897730F27'
    )

    await votingEscrow.setArtProxy(taskArgs.address)
  })
