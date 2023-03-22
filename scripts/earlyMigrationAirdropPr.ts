import { BigNumber, ethers } from "ethers";
import fs from "fs";
require("dotenv").config();

import bonuses from "./sumFlowNonFlow";

import type { ContractTransaction } from "ethers";

const FOUR_YEARS = 126_144_000;
const MAX_UINT256 = ethers.constants.MaxUint256;

const abi = [
  "function create_lock_for(uint _value, uint _lock_duration, address _to) external returns (uint)",
];

const erc20ABI = [
  "function approve(address _spender, uint _value) external returns (bool)",
];

const FLOW_ADDRESS = "0xB5b060055F0d1eF5174329913ef861bC3aDdF029";
const veFLOW_ADDRESS = "0x8E003242406FBa53619769F31606ef2Ed8A65C00";

const PK = process.env.PRIVATE_KEY;

async function airdrop() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://canto.dexvaults.com/"
    // "https://canto.evm.chandrastation.com"
    // "https://canto.gravitychain.io/",
    // "https://canto.slingshot.finance"
  );
  const wallet = new ethers.Wallet(PK!, provider);

  const flowContract = new ethers.Contract(FLOW_ADDRESS, erc20ABI, wallet);
  const veFlowContract = new ethers.Contract(veFLOW_ADDRESS, abi, wallet);

  const preparedBonuses = new Map<string, BigNumber>();

  bonuses.forEach((entry) => {
    if (entry[1] > 1) {
      preparedBonuses.set(
        entry[0],
        ethers.utils.parseEther(entry[1].toFixed(18))
      );
    }
  });

  await flowContract.approve(veFLOW_ADDRESS, MAX_UINT256);

  let done: [string, string][] = [];
  for (const [address, bonus] of preparedBonuses) {
    await sleep(5000);

    try {
      const nftid: ContractTransaction = await veFlowContract.create_lock_for(
        bonus,
        FOUR_YEARS,
        address
      );
      const receipt = await nftid.wait();
      done.push([address, receipt.transactionHash]);
      console.log({ address, tx: receipt.transactionHash });
    } catch (e) {
      console.log("error", e);
      fs.writeFileSync(
        `./scripts/error-${address}.json`,
        JSON.stringify({ address, bonus, e }, undefined, 2)
      );
      continue;
    }
  }
  fs.writeFileSync(`./scripts/done.json`, JSON.stringify(done, undefined, 2));
  console.log("done");
}

airdrop();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
