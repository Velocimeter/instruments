import { ethers } from "ethers";
import fs from "fs";
import path from "path";
require("dotenv").config();

const NUMBER_OF_BLOCKS_PER_BATCH = 10000;
const START_BLOCK = 3301085; // first pair created
const BLOCK_OF_SNAPSHOT = 3369049; // voter distribute function called
const REWARD_FUND_FLOW = 3_500_000;
const REWARD_FUND_OTHER = 1_500_000;

const abi = [
  "event Deposit(address indexed from, uint tokenId, uint amount)",
  "event Withdraw(address indexed from, uint tokenId, uint amount)",
];
const abi1 = ["function name() view returns (string)"];

const pairFactoryABI = [
  "function allPairsLength() view returns (uint)",
  "function allPairs(uint) view returns (address)",
];

const voterABI = ["function gauges(address) view returns (address)"];

const FACTORY_ADDRESS = "0xF80909DF0A01ff18e4D37BF682E40519B21Def46";
const VOTER_ADDRESS = "0x8e3525Dbc8356c08d2d55F3ACb6416b5979D3389";

// team member addresses
const DUNKS = "0x069e85D4F1010DD961897dC8C095FBB5FF297434";
const T0RB1K = "0x0b776552c1Aef1Dc33005DD25AcDA22493b6615d";
const CEAZOR = "0x06b16991B53632C2362267579AE7C4863c72fDb8";

const TEAM_ADDRESSES = [DUNKS, T0RB1K, CEAZOR];

async function getGaugeEvents() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://canto.dexvaults.com/"
    // "https://canto.evm.chandrastation.com"
    // "https://canto.gravitychain.io/",
    // "https://canto.slingshot.finance"
  );
  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    pairFactoryABI,
    provider
  );
  const voterContract = new ethers.Contract(VOTER_ADDRESS, voterABI, provider);
  const pairs_count = await factory.allPairsLength();
  let totalWeightsF = 0;
  let totalWeightsO = 0;

  for (let i = 0; i < pairs_count; i++) {
    await sleep(2000);
    const map = new Map<
      string,
      {
        type: "withdrawal" | "deposit";
        from: string;
        amount: string;
        block: number;
      }[]
    >();

    const pair = await factory.allPairs(i);
    const pairContract = new ethers.Contract(pair, abi1, provider);
    const gauge = await voterContract.gauges(pair);

    const contract = new ethers.Contract(gauge, abi, provider);
    const pairName = await pairContract.name();

    const depositFilter = contract.filters.Deposit(null, null, null);
    const withdrawalFilter = contract.filters.Withdraw(null, null, null);

    let currentBlock = START_BLOCK;
    let depositQueryFilters: any = [];
    let withdrawalQueryFilters: any = [];

    while (currentBlock < BLOCK_OF_SNAPSHOT) {
      const endBlock =
        currentBlock + NUMBER_OF_BLOCKS_PER_BATCH >= BLOCK_OF_SNAPSHOT
          ? BLOCK_OF_SNAPSHOT
          : currentBlock + NUMBER_OF_BLOCKS_PER_BATCH - 1;
      depositQueryFilters.push(
        contract.queryFilter(depositFilter, currentBlock, endBlock)
      );
      withdrawalQueryFilters.push(
        contract.queryFilter(withdrawalFilter, currentBlock, endBlock)
      );

      currentBlock += NUMBER_OF_BLOCKS_PER_BATCH;
    }

    const depositevents = (await Promise.all(depositQueryFilters))
      .flat()
      .map((event) => {
        return {
          type: "deposit" as const,
          from: event.args[0],
          amount: ethers.utils.formatEther(event.args[2]),
          block: event.blockNumber,
        };
      });
    const withdrawalEvents = (await Promise.all(withdrawalQueryFilters))
      .flat()
      .map((event) => {
        return {
          type: "withdrawal" as const,
          from: event.args[0],
          amount: ethers.utils.formatEther(event.args[2]),
          block: event.blockNumber,
        };
      });

    depositevents.forEach((event) => {
      if (map.has(event.from)) {
        map.get(event.from)?.push(event);
      } else {
        map.set(event.from, [event]);
      }
    });

    withdrawalEvents.forEach((event) => {
      if (map.has(event.from)) {
        map.get(event.from)?.push(event);
      } else {
        map.set(event.from, [event]);
      }
    });

    const sortedMap = new Map(
      [...map.entries()].map(([address, eventsOfAddress]) => {
        return [
          address,
          eventsOfAddress
            .filter((e) => {
              return parseFloat(e.amount) !== 0;
            })
            .sort((a, b) => {
              return a.block - b.block;
            }),
        ];
      })
    );

    TEAM_ADDRESSES.forEach((teamMemberAddress) => {
      if (sortedMap.has(teamMemberAddress)) {
        sortedMap.delete(teamMemberAddress);
      }
    });

    const aggregated = new Map(
      [...sortedMap.entries()].map(([address, events]) => {
        return [address, getWeight(events)];
      })
    );

    fs.writeFileSync(
      `./scripts/early/${pairName.replace("/", "-")}.json`,
      JSON.stringify([...aggregated.entries()], undefined, 2)
    );

    [...aggregated.values()].forEach((weight) => {
      if (pairName.includes("FLOW")) {
        totalWeightsF += weight;
      } else {
        totalWeightsO += weight;
      }
    });
  }
  console.log("totalWeightsF: ", totalWeightsF);
  console.log("totalWeightsO: ", totalWeightsO);
  const veFlowPerWeightFLOW = REWARD_FUND_FLOW / totalWeightsF;
  const veFlowPerWeightOTHER = REWARD_FUND_OTHER / totalWeightsO;
  console.log("veFlowPerWeight flow: ", veFlowPerWeightFLOW);
  console.log("veFlowPerWeight other: ", veFlowPerWeightOTHER);

  const filesPaths = fs
    .readdirSync("./scripts/early")
    .map((fileName) => {
      return path.join("./scripts/early", fileName);
    })
    .filter(isFile);

  const flowFiles = filesPaths.filter((filePath) => {
    return filePath.includes("FLOW");
  });
  const otherFiles = filesPaths.filter((filePath) => {
    return !filePath.includes("FLOW");
  });

  const addressesFlow = new Set();
  const addressesOther = new Set();
  const addressWeightsF = new Map();
  const addressWeightsO = new Map();

  for (const filePath of flowFiles) {
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(fileData);
    parsedData.forEach((entry: [string, string]) => {
      const [address, reward] = entry;
      if (addressesFlow.has(address)) {
        addressWeightsF.set(
          address,
          addressWeightsF.get(address) + parseFloat(reward)
        );
      } else {
        addressWeightsF.set(address, parseFloat(reward));
        addressesFlow.add(address);
      }
    });
  }

  for (const filePath of otherFiles) {
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(fileData);
    parsedData.forEach((entry: [string, string]) => {
      const [address, reward] = entry;
      if (addressesOther.has(address)) {
        addressWeightsO.set(
          address,
          addressWeightsO.get(address) + parseFloat(reward)
        );
      } else {
        addressWeightsO.set(address, parseFloat(reward));
        addressesOther.add(address);
      }
    });
  }

  const veFlowRewardsF = [...addressWeightsF.entries()].map(
    ([address, weight]) => {
      return [address, weight * veFlowPerWeightFLOW];
    }
  );
  const veFlowRewardsO = [...addressWeightsO.entries()].map(
    ([address, weight]) => {
      return [address, weight * veFlowPerWeightOTHER];
    }
  );

  fs.writeFileSync(
    "./scripts/early/veFlowRewardsF.json",
    JSON.stringify(veFlowRewardsF, undefined, 2)
  );
  fs.writeFileSync(
    "./scripts/early/veFlowRewardsO.json",
    JSON.stringify(veFlowRewardsO, undefined, 2)
  );
}

getGaugeEvents();

function getWeight(
  events: {
    type: "withdrawal" | "deposit";
    from: string;
    amount: string;
    block: number;
  }[]
) {
  // CASE 1. Person deposited once and never withdrawn
  if (!events.some((e) => e.type === "withdrawal") && events.length === 1) {
    console.log("case 1", events);
    return _getWeight(
      events[0].block,
      BLOCK_OF_SNAPSHOT,
      parseFloat(events[0].amount)
    );
  }

  // CASE 2. Person deposited once and withdrew once
  if (
    events.some((e) => e.type === "withdrawal") &&
    events.some((e) => e.type === "deposit") &&
    events.length === 2
  ) {
    console.log("case 2", events);
    const depositEvent = events.find((e) => e.type === "deposit");
    const withdrawalEvent = events.find((e) => e.type === "withdrawal");

    if (!depositEvent || !withdrawalEvent)
      throw new Error("just to make ts happy");

    // person deposited and got their weight
    const weight1 = _getWeight(
      depositEvent.block,
      withdrawalEvent.block,
      parseFloat(depositEvent.amount)
    );
    // person withdrew
    const amountAfterWithdrawal =
      parseFloat(depositEvent.amount) - parseFloat(withdrawalEvent.amount);
    // if they withdrew everything they deposited, then weight2 is 0
    const weight2 =
      amountAfterWithdrawal > 0
        ? _getWeight(
            withdrawalEvent.block,
            BLOCK_OF_SNAPSHOT,
            amountAfterWithdrawal
          )
        : 0;
    return weight1 + weight2;
  }

  // CASE *. await no events
  if (!events.some((e) => e.type === "deposit")) {
    console.log("await no events:", events);
    return 0;
  }

  // CASE 3. Person deposited multiple times and/or withdrew multiple times
  const weights: number[] = [];
  let acc: number = 0;
  console.log("case 3", events);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const nextEvent = events[i + 1];
    if (i === 0 && event.type === "deposit") {
      const weight = _getWeight(
        event.block,
        nextEvent.block,
        parseFloat(event.amount)
      );
      weights.push(weight);
      acc += parseFloat(event.amount);
      continue;
    }
    if (event.type === "deposit") {
      const weight = _getWeight(
        event.block,
        nextEvent?.block ?? BLOCK_OF_SNAPSHOT,
        acc + parseFloat(event.amount)
      );
      weights.push(weight);
      acc += parseFloat(event.amount);
    } else if (
      event.type === "withdrawal" &&
      parseFloat(event.amount) !== acc &&
      nextEvent
    ) {
      const weight = _getWeight(
        event.block,
        nextEvent.block,
        acc - parseFloat(event.amount)
      );
      weights.push(weight);
      acc -= parseFloat(event.amount);
    } else if (
      event.type === "withdrawal" &&
      parseFloat(event.amount) !== acc &&
      !nextEvent
    ) {
      const weight = _getWeight(
        event.block,
        BLOCK_OF_SNAPSHOT,
        acc - parseFloat(event.amount)
      );
      weights.push(weight);
    } else if (
      event.type === "withdrawal" &&
      parseFloat(event.amount) === acc &&
      nextEvent
    ) {
      weights.push(0);
    } else if (
      event.type === "withdrawal" &&
      parseFloat(event.amount) === acc &&
      !nextEvent
    ) {
      weights.push(0);
    }
  }
  return weights.reduce((acc, curr) => {
    return (acc += curr);
  }, 0);
}

function _getWeight(time1: number, time2: number, amount: number) {
  return amount * getDefinedIntegral(time1, time2);
}

function getDefinedIntegral(time1: number, time2: number) {
  return ln(time2) - ln(time1);
}

function ln(x: number) {
  return Math.log(x);
}

function isFile(fileName: string) {
  return fs.lstatSync(fileName).isFile();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
