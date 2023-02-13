import {
  DAPP_ADDRESS,
  MODULE_NAME,
  MODULE_URL, 
  APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useState } from "react";
import React from "react";

export default function Home() {
  
  const { account, signAndSubmitTransaction } = useWallet();
  const [component, setComponent] = useState<string>("airdrop_same_amount");
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

      <nav className="navbar py-4 px-4 bg-base-100">
        <div className="flex-1">
          <ul className="menu menu-horizontal p-0 ml-5">
            <li className="flex-1">
              <button
                onClick={() => setComponent("airdrop_same_amount")}
                className={
                  "font-sans font-semibold text-lg"
                }>Airdrop Same Amount</button>
              <button
                onClick={() => setComponent("airdrop_different_amount")}
                className={
                  "font-sans font-semibold text-lg"
                }>Airdrop Different Amount</button>
            </li>
          </ul>
        </div>
      </nav>

      {component==="airdrop_same_amount" && 
        <div>
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
          <input
            placeholder="Airdrop Amount to Each Address"
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
            Airdrop Same Amount to Each Address
          </button>
          <br></br>
        </div>
      }

      {component==="airdrop_different_amount" && 
        <div>
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
            placeholder="A Vector of Different Airdrop Amounts Corresponding to Each Address"
            className="mt-8 p-4 input input-bordered input-primary w-full"
            onChange={(e) =>
              updateFormInput({ ...formInput, moneys: str_to_int_batched(JSON.parse(e.target.value)) })
            }
          />
          <br></br>
          <button
            onClick={airdrop_coins_not_average_script}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Airdrop Different Amount to Each Address
          </button>
          <br></br>
        </div>
      }

    </div>
  );
}
