'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const arbTestnetConfig_1 = __importDefault(
  require('../tasks/deploy/constants/arbTestnetConfig')
)
const ARB_TEST_CONFIG = arbTestnetConfig_1.default
const func = async function (hre) {
  const { ethers } = hre
  const minter = await ethers.getContract('Minter')
  // Initial veFLOW distro
  await minter.initialize(
    ARB_TEST_CONFIG.partnerAddrs,
    ARB_TEST_CONFIG.partnerAmts,
    ARB_TEST_CONFIG.partnerMax
  )
  console.log('veFLOW distributed')
  console.log('Arbitrum Goerli Velocimeter Instruments deployed')
  return true
}
exports.default = func
func.tags = ['initial_dist']
func.id = 'initial_dist'
