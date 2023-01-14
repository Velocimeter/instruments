"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const TOKEN_DECIMALS = ethers_1.ethers.BigNumber.from("10").pow(ethers_1.ethers.BigNumber.from("18"));
const MILLION = ethers_1.ethers.BigNumber.from("10").pow(ethers_1.ethers.BigNumber.from("6"));
const FOUR_MILLION = ethers_1.ethers.BigNumber.from("4")
    .mul(MILLION)
    .mul(TOKEN_DECIMALS);
const TEN_MILLION = ethers_1.ethers.BigNumber.from("10")
    .mul(MILLION)
    .mul(TOKEN_DECIMALS);
const TWENTY_MILLION = ethers_1.ethers.BigNumber.from("20")
    .mul(MILLION)
    .mul(TOKEN_DECIMALS);
const PARTNER_MAX = ethers_1.ethers.BigNumber.from("78")
    .mul(MILLION)
    .mul(TOKEN_DECIMALS);
const TEAM_MULTISIG = "0xb074ec6c37659525EEf2Fb44478077901F878012";
const TEAM_EOA = "0xe247340f06FCB7eb904F16a48C548221375b5b96";
const optimismConfig = {
    // Chain const
    lzChainId: 11,
    lzEndpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
    // Tokens
    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    // Addresses
    teamEOA: TEAM_EOA,
    teamMultisig: TEAM_MULTISIG,
    emergencyCouncil: "0xcC2D01030eC2cd187346F70bFc483F24488C32E8",
    merkleRoot: "0xbb99a09fb3b8499385659e82a8da93596dd07082fe86981ec06c83181dee489f",
    tokenWhitelist: [
        "0x4200000000000000000000000000000000000042",
        "0x4200000000000000000000000000000000000006",
        "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
        "0x217D47011b23BB961eB6D93cA9945B7501a5BB11",
        "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        "0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be",
        "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
        "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
        "0xCB8FA9a76b8e203D8C3797bF438d8FB81Ea3326A",
        "0x3E29D3A9316dAB217754d13b28646B76607c5f04",
        "0x8aE125E8653821E851F12A49F7765db9a9ce7384",
        "0x10010078a54396F62c96dF8532dc2B4847d47ED3",
        // "", // BTRFLY -- N/A
        // "", // pxVELO -- N/A
        "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819", // LUSD
        // "", // wstETH -- N/A
        // "", // HOP -- N/A
    ],
    partnerAddrs: [
        TEAM_EOA,
        "0x4a84675512949f81EBFEAAcC6C00D03eDd329de5",
        TEAM_EOA,
        "0xa283139017a2f5BAdE8d8e25412C600055D318F8",
        "0xDcf664d0f76E99eaA2DBD569474d0E75dC899FCD",
        "0x489863b61C625a15C74FB4C21486baCb4A3937AB",
        "0x641f26c67A5D0829Ae61019131093B6a7c7d18a3",
        "0xC224bf25Dcc99236F00843c7D8C4194abE8AA94a",
        "0xB6DACAE4eF97b4817d54df8e005269f509f803f9",
        TEAM_EOA,
        TEAM_EOA,
        "0x0dF840dCbf1229262A4125C1fc559bd338eC9491",
        "0x2E33A660742e813aD948fB9f7d682FE461E5fbf3",
        "0xd2D4e9024D8C90aB52032a9F1e0d92D4cE20191B", // LUSD
    ],
    partnerAmts: [
        TEN_MILLION,
        TWENTY_MILLION,
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
    ],
    partnerMax: PARTNER_MAX,
};
exports.default = optimismConfig;
