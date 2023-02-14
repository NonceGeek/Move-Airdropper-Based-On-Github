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
  const [component, setComponent] = useState<string>("airdrop_nft");
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>;
    creator: string, 
    collection_name: string,
    token_name: string, 
    property_version: number,
    amount: number, 
    airdrop_ids: Array<number>,
  }>({
    addresses: [],
    creator: "", 
    collection_name: "", 
    token_name: "", 
    property_version: 0, 
    amount: 0, 
    airdrop_ids: [],
  });

  async function airdrop_tokens_script() {
    await signAndSubmitTransaction(
      do_airdrop_tokens_script(),
      { gas_unit_price: 100 }
    );
  }

  async function claim_tokens_script() {
      await signAndSubmitTransaction(
        do_claim_tokens_script(),
        { gas_unit_price: 100 }
      );
  }

  function do_airdrop_tokens_script() {
    const { addresses, creator, collection_name, token_name, property_version, amount } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::airdropper::airdrop_tokens_script",
      type_arguments: [],
      arguments: [
          addresses, 
          creator, 
          collection_name,
          token_name,
          property_version,
          amount
      ],
    };
  }

  function do_claim_tokens_script() {
      const {airdrop_ids} = formInput;
      return {
          type: "entry_function_payload",
          function: DAPP_ADDRESS + "::airdropper::claim_tokens_script",
          type_arguments: [],
          arguments: [
              airdrop_ids
          ],
      }
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
            {/* <NavItem href="/" title="CoinAirdropper" />
            <NavItem href="/nft_airdropper" title="NFTAirdropper" />
            <NavItem href="/did_querier" title="DIDQuerier" /> */}
            <li>
              <button
                onClick={() => setComponent("airdrop_nft")}
                className={
                  "font-sans font-semibold text-lg"
                }>Airdrop NFT</button>
              <button
                onClick={() => setComponent("claim_nft")}
                className={
                  "font-sans font-semibold text-lg"
                }>Claim NFT</button>
            </li>
            {/* <li className="font-sans font-semibold text-lg">
              <a href="https://github.com/NonceGeek/Airdropper-Based-On-Github" target="_blank">Source Code</a>
              <a href={MODULE_URL} target="_blank">Contract on Explorer</a>
            </li> */}
          </ul>
        </div>
      </nav>

      {component==="airdrop_nft" && 
        <div>
        <input
        placeholder="Addresses for the Airdrop"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, addresses: JSON.parse(e.target.value) })
        }
        />
        <br></br>
        <input
        placeholder="NFT Creator"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, creator: e.target.value })
        }
        />
        <br></br>
        <input
        placeholder="NFT Collection Name"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, collection_name: e.target.value})
        }
        />
        <br></br>
        <input
        placeholder="NFT Token Name"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, token_name: e.target.value})
        }
        />
        <br></br>
        <input
        placeholder="NFT Property Version"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, property_version: parseInt(e.target.value)})
        }
        />
        <br></br>
        <input
        placeholder="Airdrop Amount to Each Address"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, amount: parseInt(e.target.value)})
        }
        />
        <br></br>
        <button
        onClick={airdrop_tokens_script}
        className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Submit to Airdrop NFT
        </button>
        <br></br>
        <br></br>
        </div>
      }

      {component==="claim_nft" && 
        <div>
        <input
        placeholder="NFT Airdrop IDs"
        className="mt-8 p-4 input input-bordered input-primary w-full"
        onChange={(e) =>
            updateFormInput({ ...formInput, airdrop_ids: JSON.parse(e.target.value) })
        }
        />
        <br></br>
        <button
        onClick={claim_tokens_script}
        className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
        }>
        Submit to Claim NFT
        </button>
        <br></br>
        <br></br>
        </div>
      }

    </div>
  );
}
