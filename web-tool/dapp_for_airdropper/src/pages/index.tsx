import {
  DAPP_ADDRESS,
  MODULE_NAME,
  MODULE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useState } from "react";
import React from "react";

export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();
  const [addresses, setAddresses] = useState<Array<string>>(['']);
  const [amounts, setAmounts] = useState<Array<string>>(['']);
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

  function apt_to_octos(num_apt: number) {
    return (num_apt * 100_000_000)
  }

  function str_to_int_batched(arr: Array<string>) {
    var i;
    var arr_int = [];
    for (i in arr) {
      arr_int.push(apt_to_octos(parseFloat(arr[i])));
    }
    return arr_int
  }

  function appendToAddresses(addr: string) {
    setAddresses([...addresses, addr])
  }

  function removeAddressesAtIndex(i: number) {
    if (addresses.length > 1) {
      let addrs = addresses.filter((_, i2) => i2 !== i)
      setAddresses(addrs)
      console.log(addrs)
      updateFormInput({ ...formInput, addresses: addrs.filter(item => item !== '') })
    }
  }

  function updateAddressesAtIndex(i: number, addr: string) {
    let addrs = addresses
    addrs[i] = addr
    setAddresses(addrs)
    updateFormInput({ ...formInput, addresses: addrs.filter(item => item !== '') })
    return addrs
  }

  function appendToAmounts(amount: string) {
    setAmounts([...amounts, amount])
  }

  function removeAmountsAtIndex(i: number) {
    if (amounts.length > 1) {
      let ams = amounts.filter((_, i2) => i2 !== i)
      setAmounts(ams)
      updateFormInput({ ...formInput, moneys: ams.filter(item => item !== '').map(item => apt_to_octos(parseFloat(item))) })
    }
  }

  function updateAmountsAtIndex(i: number, amount: string) {
    let ams = amounts
    ams[i] = amount
    setAmounts(ams)
    updateFormInput({ ...formInput, moneys: ams.filter(item => item !== '').map(item => apt_to_octos(parseFloat(item))) })
    return ams
  }

  function checkIfAverageAirdropValid() {
    const { money } = formInput;
    if (addresses.filter(item => item === '').length > 0) {
      return false
    }
    return (addresses.filter(onlyUnique).length === addresses.length
      && addresses.filter(item => item !== '').length > 0 && money > 0)
  }

  function checkIfNotAverageAirdropValid() {
    if (addresses.filter(item => item === '').length > 0 || amounts.filter(item => item === '').length > 0) {
      return false
    }
    return (
      addresses.length === amounts.length
      && addresses.filter(onlyUnique).length === addresses.length
      && addresses.filter(item => item !== '').length > 0
      && addresses.filter(item => item !== '').length === amounts.filter(item => item !== '').length
      && amounts.filter(item => isNaN(parseFloat(item)) || parseFloat(item) <= 0).length === 0
    )
  }

  function onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  return (
    <div>
      <p>
        <b>Module Path:</b>
        <a target="_blank" href={MODULE_URL}>{DAPP_ADDRESS}::{MODULE_NAME}</a>
      </p>

      <nav className="navbar py-4 px-4 bg-base-100">
        <div className="flex-1">
          <ul className="menu menu-horizontal p-0">
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

      {component === "airdrop_same_amount" &&
        <div>
          <input
            placeholder="Description for the airdrop"
            className="mt-8 p-4 input input-bordered input-primary w-full md:w-2/3"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <br></br>
          <div className="flex w-full md:w-2/3">
            <input
              placeholder="Amount per address"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) =>
                updateFormInput({ ...formInput, money: apt_to_octos(parseFloat(e.target.value)) })
              }
            />
            <span className="mt-8 p-4 pl-4">APT</span>
          </div>
          <br></br>
          <div>
            {addresses.map((item, i) => {
              return (
                <div className="flex w-full md:w-2/3" key={i}>
                  <input
                    placeholder={`Address ${i + 1} for the airdrop`}
                    className="mt-2 p-4 input input-bordered input-primary w-full"
                    value={item}
                    onChange={(e) =>
                      updateAddressesAtIndex(i, e.target.value)
                    }
                  />
                  <button onClick={() => { removeAddressesAtIndex(i) }} className={
                    "btn btn-primary font-bold mt-2 text-white rounded shadow-lg ml-4"
                  }>-</button>
                </div>)
            })
            }
            <button onClick={() => { appendToAddresses('') }} className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>+</button>
          </div>
          <button
            onClick={airdrop_coins_average_script}
            disabled={!checkIfAverageAirdropValid()}
            className={
              "btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
            }>
            Airdrop Same Amount to Each Address
          </button>
          <br></br>
        </div>
      }

      {component === "airdrop_different_amount" &&
        <div>
          <input
            placeholder="Description for the Airdrop"
            className="mt-8 p-4 input input-bordered input-primary w-full md:w-2/3"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <br></br>
          <div className="mt-6">
            {addresses.map((item, i) => {
              return (
                <div className="flex w-full md:w-2/3" key={i}>
                  <input
                    placeholder={`Address ${i + 1} for the airdrop`}
                    className="mt-2 p-4 input input-bordered input-primary w-2/3"
                    value={item}
                    onChange={(e) =>
                      updateAddressesAtIndex(i, e.target.value)
                    }
                  />
                  <input
                    placeholder={`Amount ${i} for the address`}
                    className="mt-2 ml-4 p-4 input input-bordered input-primary w-1/3"
                    value={amounts[i]}
                    onChange={(e) =>
                      updateAmountsAtIndex(i, e.target.value)
                    }
                  />
                  <span className="mt-2 p-4 pl-2">APT</span>
                  <button onClick={() => { removeAddressesAtIndex(i); removeAmountsAtIndex(i) }} className={
                    "btn btn-primary font-bold mt-2 text-white rounded shadow-lg ml-2"
                  }>-</button>
                </div>)
            })
            }
            <button onClick={() => { appendToAddresses(''); appendToAmounts('') }} className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>+</button>
          </div>
          <button
            onClick={airdrop_coins_not_average_script}
            disabled={!checkIfNotAverageAirdropValid()}
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
