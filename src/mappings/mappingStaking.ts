import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Balance, BlockNumber } from "@polkadot/types/interfaces";
import { Compact } from "@polkadot/types";
import {
  ParaAccountInfo,
  StakingBonded,
  StakingErapaid,
  StakingInfo,
  StakingPayoutstarte,
  StakingUnbonded,
  StakingWithdrawn,
} from "../types";

export async function staking(block: SubstrateBlock): Promise<void> {
  const blockNumber = (
    block.block.header.number as Compact<BlockNumber>
  ).toBigInt();
  const stakingEvents = block.events.filter(
    (e) => e.event.section === "staking"
  ) as unknown as SubstrateEvent[];

  for (let stakingEvent of stakingEvents) {
    const {
      event: { data, method },
    } = stakingEvent;
    const record = new StakingInfo(blockNumber.toString() + "-" + stakingEvent.idx.toString(), blockNumber, block.timestamp, method.toString(), data.toString());

    await record.save();
  }
  const result = await api.query.system.account(
    "F7fq1jMmNj5j2jAHcBxgM26JzUn2N4duXu1U4UZNdkfZEPV"
  );
  const balanceRecord = new ParaAccountInfo(blockNumber.toString(), blockNumber, block.timestamp);

  balanceRecord.free = (result.data.free as Balance)?.toBigInt();
  balanceRecord.reserved = (result.data.reserved as Balance)?.toBigInt();
  balanceRecord.feeFrozen = (result.data.frozen as Balance)?.toBigInt();

  const delegators = await Promise.all(
    [
      "EckcmXbCj4huvNLP5btMFmJz8SzEt5s8hgKcL6LM8BtZeAf",
      "J3Kp9LPQpRvVmJmmEuYJjW2UFnSQptZ3pbpSZbFLLgWF7WR",
      "DFw6MtEaT5PSZHzd43UW2YnEx4GNzAfCzejruhBt1tnBJaF",
      "DNaN64ohZRko1c7PbrgK1LJC96yQdZ23241H2erKUz7XQwy",
      "DgB3P2Rwvbb2ZsUgWKRMJwuDUq92HqiM295ezLsJT5GSeKd",
    ].map(async (account) => (await api.query.system.account(account)).data.free)
  ) as unknown as number[];

  // save delegators amount in miscFrozen
  balanceRecord.miscFrozen = delegators.reduce((a, c) => BigInt(a) + BigInt(c), BigInt(0)) as unknown as bigint;

  await balanceRecord.save();
  return;
}

export async function handleStakingErapaid(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const {
    event: {
      data: [index, validator_payout, remainder],
    },
  } = event;
  const erasTotalStake = await api.query.staking.erasTotalStake(
    Number(index.toString()) - 1
  );
  const record = new StakingErapaid(`${blockNumber}-${event.idx.toString()}`, event.idx, blockNumber, event.block.timestamp);

  record.era_index = index.toString();
  record.validator_payout = (validator_payout as Balance)?.toBigInt();
  record.remainder = (remainder as Balance)?.toBigInt();
  record.total_staked = (erasTotalStake as Balance)?.toBigInt();

  await record.save();
}

export async function handleStakingBonded(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const {
    event: {
      data: [account, balance],
    },
  } = event;
  const record = new StakingBonded(`${blockNumber}-${event.idx.toString()}`, event.idx, blockNumber, event.block.timestamp);

  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakinUnbonded(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const {
    event: {
      data: [account, balance],
    },
  } = event;
  const record = new StakingUnbonded(`${blockNumber}-${event.idx.toString()}`, event.idx, blockNumber, event.block.timestamp);

  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakingWithdrawn(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  const {
    event: {
      data: [account, balance],
    },
  } = event;
  const record = new StakingWithdrawn(`${blockNumber}-${event.idx.toString()}`, event.idx, blockNumber, event.block.timestamp);

  record.balance = (balance as Balance)?.toBigInt();
  record.account = account.toString();

  await record.save();
}

export async function handleStakingPayoutstarte(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();

  const {
    event: {
      data: [era_index, account],
    },
  } = event;

  const record = new StakingPayoutstarte(
    `${blockNumber}-${event.idx.toString()}`,
    event.idx,
    blockNumber,
    event.block.timestamp,
  );
  record.era_index = era_index.toString();
  record.account = account.toString();
  await record.save();
}
