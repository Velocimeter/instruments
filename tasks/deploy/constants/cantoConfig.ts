import { ethers } from 'ethers'

// this is the actual config that we are using for arbOne

const TOKEN_DECIMALS = ethers.BigNumber.from('10').pow(
  ethers.BigNumber.from('18')
)

const MILLION = ethers.BigNumber.from('10').pow(ethers.BigNumber.from('6'))
console.log('million', MILLION)

// const HALF_MILLION = ethers.BigNumber.from('.5')
//   .mul(MILLION)
//   .mul(TOKEN_DECIMALS)
const ONE_MILLION = ethers.BigNumber.from('1').mul(MILLION).mul(TOKEN_DECIMALS)
const TWO_MILLION = ethers.BigNumber.from('2').mul(MILLION).mul(TOKEN_DECIMALS)
const FOUR_MILLION = ethers.BigNumber.from('4').mul(MILLION).mul(TOKEN_DECIMALS)
const TEN_MILLION = ethers.BigNumber.from('10').mul(MILLION).mul(TOKEN_DECIMALS)
const TWELEVE_MILLION = ethers.BigNumber.from('12')
  .mul(MILLION)
  .mul(TOKEN_DECIMALS)
const TWENTY_MILLION = ethers.BigNumber.from('20')
  .mul(MILLION)
  .mul(TOKEN_DECIMALS)
const SIXTY_MILLION = ethers.BigNumber.from('60')
  .mul(MILLION)
  .mul(TOKEN_DECIMALS)
const PARTNER_MAX = ethers.BigNumber.from('400') // It will literally mint this many  tokens so be careful with it..
  .mul(MILLION)
  .mul(TOKEN_DECIMALS)

const TEAM_MULTISIG = '0x0a178469E3d08BEAA0a289E416Ab924F10807989'
const TEAM_EOA = '0x069e85D4F1010DD961897dC8C095FBB5FF297434'
const arbitrumTeam = TEAM_MULTISIG
const velodromeMultisig = TEAM_MULTISIG
const anton = TEAM_MULTISIG
const andre = TEAM_MULTISIG
const coolie = '0x03B88DacB7c21B54cEfEcC297D981E5b721A9dF1'
const ceazor = '0x06b16991B53632C2362267579AE7C4863c72fDb8'
const wtck = '0x78e801136F77805239A7F533521A7a5570F572C8'
const t0rb1k = '0x0b776552c1Aef1Dc33005DD25AcDA22493b6615d'
const dunks = '0x069e85D4F1010DD961897dC8C095FBB5FF297434'
const faeflo = '0x397A7EC90bb4f0e89Ffd2Fb3269a3ef295d4f84A'
const nardie = '0x069e85D4F1010DD961897dC8C095FBB5FF297434'
//edit this one or the other one??

const cantoConfig = {
  // Chain const
  lzChainId: 110,
  lzEndpoint: '0x3c2269811836af69497E5F486A85D7316753cf62',

  // Tokens
  WETH: '0x826551890Dc65655a0Aceca109aB11AbDbD7a07B', //WCANTO
  USDC: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',

  partnerAddrs: [
    TEAM_MULTISIG,
    dunks,
    dunks,
    dunks,
    t0rb1k,
    t0rb1k,
    t0rb1k,
    ceazor,
    ceazor,
    ceazor,
    wtck,
    wtck,
    wtck,
    coolie,
    coolie,
    coolie,
    faeflo,
    faeflo,
    faeflo,
    nardie
  ],
  partnerAmts: [
    SIXTY_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION,
    FOUR_MILLION
  ], // MILLION Mint 0.001 WTF pls halp
  partnerMax: PARTNER_MAX,

  // Addresses
  teamEOA: TEAM_EOA,
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: TEAM_MULTISIG,

  merkleRoot:
    '0xbb99a09fb3b8499385659e82a8da93596dd07082fe86981ec06c83181dee489f',
  tokenWhitelist: [
    '0x826551890Dc65655a0Aceca109aB11AbDbD7a07B', //WCANTO
    '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd' //usdc
  ]
  // partnerAddrs: [
  //   TEAM_MULTISIG, // 1 Protocol owned NFT 64m
  //   '0x069e85D4F1010DD961897dC8C095FBB5FF297434', // 2  dunks
  //   '0x3c5Aac016EF2F178e8699D6208796A2D67557fe2', // 3 ceazor
  //   '0x03B88DacB7c21B54cEfEcC297D981E5b721A9dF1', // 4coolie

  //   '0xf78da0B8Ae888C318e1A19415d593729A61Ac0c3', // 5  faeflow,
  //   '0x78e801136F77805239A7F533521A7a5570F572C8', // 6 wtck,
  //   '0x0b776552c1Aef1Dc33005DD25AcDA22493b6615d', // 7 torbik,
  //   velodromeMultisig, // 8 should we split this up?
  //   anton, // 9 half %
  //   andre, // 10 half %
  //   arbitrumTeam, // 11 minimum 1% could be more if they help us
  //   TEAM_MULTISIG, // 12
  //   TEAM_MULTISIG, // 13
  //   TEAM_MULTISIG, // 14
  //   TEAM_MULTISIG, // 15
  //   TEAM_MULTISIG, // 16
  //   TEAM_MULTISIG, // 17
  //   TEAM_MULTISIG, // 18
  //   TEAM_MULTISIG, // 19
  //   TEAM_MULTISIG, // 20
  //   TEAM_MULTISIG, // 21
  //   TEAM_MULTISIG, // 22
  //   TEAM_MULTISIG, // 23
  //   TEAM_MULTISIG, // 24
  //   TEAM_MULTISIG, // 25
  //   TEAM_MULTISIG, // 26
  //   TEAM_MULTISIG, // 27
  //   TEAM_MULTISIG, // 28
  //   TEAM_MULTISIG, // 29
  //   TEAM_MULTISIG, // 30
  //   TEAM_MULTISIG, // 31
  //   TEAM_MULTISIG, // 32
  //   TEAM_MULTISIG, // 33
  //   TEAM_MULTISIG, // 34
  //   TEAM_MULTISIG, // 35
  //   TEAM_MULTISIG, // 36
  //   TEAM_MULTISIG, // 37
  //   TEAM_MULTISIG, // 38
  //   TEAM_MULTISIG, // 39
  //   TEAM_MULTISIG, // 40
  //   TEAM_MULTISIG, // 41
  //   TEAM_MULTISIG, // 42
  //   TEAM_MULTISIG, // 43
  //   TEAM_MULTISIG, // 44
  //   TEAM_MULTISIG, // 45
  //   TEAM_MULTISIG, // 46
  //   TEAM_MULTISIG, // 47
  //   TEAM_MULTISIG, // 48
  //   TEAM_MULTISIG // 38 x protcol / partner NFTs # 49
  // ],
  // partnerAmts: [
  //   SIXTY_MILLION, // 60 million for protcol owned NFT 15%  #1
  //   TWO_MILLION, // dunks presale 2
  //   TWO_MILLION, // ceazor presale 3
  //   FOUR_MILLION, // team veNFT 1% 4
  //   FOUR_MILLION, // team veNFT 1% 5
  //   FOUR_MILLION, // team veNFT 1% 6
  //   FOUR_MILLION, // team veNFT 1% 7
  //   FOUR_MILLION, // team veNFT 1% 8
  //   FOUR_MILLION, // team veNFT 1% 9
  //   FOUR_MILLION, // 10 tribute to velodrome (need to get their arb address DO NOT USE MULTISIG FROM OP)
  //   FOUR_MILLION, //11
  //   FOUR_MILLION, // 12
  //   FOUR_MILLION, // 13
  //   FOUR_MILLION, // 14
  //   FOUR_MILLION, // 15
  //   FOUR_MILLION, // 16
  //   FOUR_MILLION, // 17
  //   FOUR_MILLION, // 18
  //   FOUR_MILLION, // 19
  //   FOUR_MILLION, // 20
  //   FOUR_MILLION, // 21
  //   FOUR_MILLION, // 22
  //   FOUR_MILLION, // 23
  //   FOUR_MILLION, // 24
  //   FOUR_MILLION, // 25
  //   FOUR_MILLION, // 26
  //   FOUR_MILLION, // 27
  //   FOUR_MILLION, // 28
  //   FOUR_MILLION, // 29
  //   FOUR_MILLION, // 30
  //   FOUR_MILLION, // 31
  //   FOUR_MILLION, // 32
  //   FOUR_MILLION, // 33
  //   FOUR_MILLION, // 34
  //   FOUR_MILLION, // 35
  //   FOUR_MILLION, // 36
  //   FOUR_MILLION, // 37
  //   FOUR_MILLION, // 38
  //   FOUR_MILLION, // 39
  //   FOUR_MILLION, // 40
  //   FOUR_MILLION, // 41
  //   FOUR_MILLION, // 42
  //   FOUR_MILLION, // 43
  //   FOUR_MILLION, // 44
  //   FOUR_MILLION, // 45
  //   FOUR_MILLION, // 46
  //   FOUR_MILLION, // 47
  //   FOUR_MILLION, // 48
  //   FOUR_MILLION // 1% to each partner x 38 partners # 49
  // ],
}

export default cantoConfig
