import {
  DAPP_ADDRESS,
  MODULE_NAME,
  MODULE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useState } from "react";
import React from "react";

// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>;
    description: string,
    moneys: Array<number>;
    money: number
  }>({
    addresses: [],
    description: "a simple airdrop!",
    moneys: [],
    money: 0
  });

  async function airdrop_coins_average_script() {
    await signAndSubmitTransaction(
      do_airdrop_coins_average_script(),
      { gas_unit_price: 100 }
    );
  }

  async function airdrop_coins_not_average_script() {
    await signAndSubmitTransaction(
      do_airdrop_coins_not_average_script(),
      { gas_unit_price: 100 }
    );
  }

  // TODO [x] Generate Funcs by ABI
  function do_airdrop_coins_average_script() {
    const { addresses, description, moneys, money } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::airdropper::airdrop_coins_average_script",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        description,
        addresses,
        money,
      ],
    };
  }

  function do_airdrop_coins_not_average_script() {
    const { addresses, description, moneys, money } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::airdropper::airdrop_coins_not_average_script",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        description,
        addresses,
        moneys
      ],
    };
  }

  function apt_to_octos(num_apt: number){
    return (num_apt * 100_000_000)
  }
  function str_to_int_batched(arr: Array<string>){
    var i;
    var arr_int = [];
    for(i in arr){
      arr_int.push(apt_to_octos(parseFloat(arr[i])));
    }
    return arr_int
  }

  return (
    <div>
      <p>
        <b>Module Path:</b>
        <a target="_blank" href={MODULE_URL}>{DAPP_ADDRESS}::{MODULE_NAME}</a>
        </p>
      <input
        placeholder="Description for the Airdrop"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, description: e.target.value })
        }
      />
      <br></br>
      <input
        placeholder="Addresses for the Airdrop"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, addresses: JSON.parse(e.target.value) })
        }
      />
      <br></br>
      {/* TODO: [x] decimals translation */}
      <input
        placeholder="Moneys for the Airdrop(not average)"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, moneys: str_to_int_batched(JSON.parse(e.target.value)) })
        }
      />
      <br></br>
      {/* TODO: [x] decimals translation */}
      <input
        placeholder="Moneys for the Airdrop(not average)"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
          updateFormInput({ ...formInput, money: apt_to_octos(parseFloat(e.target.value))})
        }
      />
      <button
        onClick={airdrop_coins_average_script}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Airdrop Coin Average
      </button>
      <br></br>
      <br></br>
      <button
        onClick={airdrop_coins_not_average_script}
        className={
          "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Airdrop Coin Not Average
      </button>
      <br></br>
    </div >
  );
}
