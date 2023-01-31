import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL,
  MODULE_NAME,
  MODULE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { useState } from "react";
import React from "react";
import {
  AptosAccount,
  WalletClient,
  HexString,
  AptosClient,
} from "@martiandao/aptos-web3-bip44.js";

import { CodeBlock } from "../components/CodeBlock";

import newAxios from "../utils/axios_utils";

import Select from 'react-select';
import { sign } from "crypto";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {
  const options = [
    { value: 'ethereum', label: 'ethereum' },
    { value: 'polygon', label: 'polygon' },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const { account, signAndSubmitTransaction } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
  const [resource_v2, setResourceV2] = React.useState();
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>;
    moneys: Array<number>;
    money: number
  }>({
    addresses: [],
    moneys: [],
    money: 0
  });

  async function airdrop_coins_average_script() {
    await signAndSubmitTransaction(
      do_airdrop_coins_average_script(),
      { gas_unit_price: 100 }
    );
  }

  function do_airdrop_coins_average_script() {
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::airdropper::airdrop_coins_average_script",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        ["0x2df41622c0c1baabaa73b2c24360d205e23e803959ebbcb0e5b80462165893ed"],
        100_000_000
      ],
    };
  }

  return (
    <div>
      <p>
        <b>Module Path:</b>
        <a target="_blank" href={MODULE_URL}>{DAPP_ADDRESS}::{MODULE_NAME}</a>
        </p>
      {/* <input
        placeholder="Description for your DID"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, description: e.target.value })
        }
      />
      <br></br>
      <br></br>
      The type of DID Owner: &nbsp; &nbsp; &nbsp; &nbsp;
      <select
        value={formInput.did_type}
        onChange={(e) => {
          updateFormInput({ ...formInput, did_type: parseInt(e.target.value) })
        }}
      >
        <option value="0">Individual</option>
        <option value="1">DAO</option>
      </select>
      <br></br> */}
      <button
        onClick={airdrop_coins_average_script}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Airdrop Coin
      </button>
      <br></br>
      <br></br>
      <br></br>
    </div >
  );
}
