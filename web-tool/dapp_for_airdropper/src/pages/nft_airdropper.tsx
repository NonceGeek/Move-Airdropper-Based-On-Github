import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useState } from 'react';
import React from 'react';
import { Uint32 } from '@martiandao/aptos-web3-bip44.js/dist/bcs';

export default function Home() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [component, setComponent] = useState<string>('airdrop_nft');
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>;
    creator: string;
    collection_name: string;
    token_name: string;
    property_version: number;
    amount: number;
    airdrop_ids: Array<number | string>;
  }>({
    addresses: [''],
    creator: '',
    collection_name: '',
    token_name: '',
    property_version: 0,
    amount: 0,
    airdrop_ids: [''],
  });
  const InitFormInput = () => {
    formInput.addresses = [''];
    formInput.creator = '';
    formInput.collection_name = '';
    formInput.property_version = 0;
    formInput.amount = 0;
    formInput.airdrop_ids = [''];
    updateFormInput({ ...formInput });
  };
  const updateAddressList = (address: string, index: Uint32) => {
    formInput.addresses[index] = address;
    updateFormInput({ ...formInput, ...formInput.addresses });
  };
  const updateIds = (id: string, index: Uint32) => {
    formInput.airdrop_ids[index] = Number(id);
    updateFormInput({ ...formInput, ...formInput.airdrop_ids });
  };
  const addInput = () => {
    if (component === 'airdrop_nft') {
      formInput.addresses.push('');
      updateFormInput({ ...formInput, ...formInput.addresses });
    }
    if (component === 'claim_nft') {
      formInput.airdrop_ids.push('');
      updateFormInput({ ...formInput, ...formInput.airdrop_ids });
    }
  };
  const subInput = () => {
    if (formInput.addresses.length > 1) {
      formInput.addresses.pop();
      updateFormInput({ ...formInput, ...formInput.addresses });
    } else {
      alert('addressList length is not equal zero');
    }
  };

  async function airdrop_tokens_script() {
    await signAndSubmitTransaction(do_airdrop_tokens_script(), { gas_unit_price: 100 });
  }

  async function claim_tokens_script() {
    await signAndSubmitTransaction(do_claim_tokens_script(), { gas_unit_price: 100 });
  }

  function do_airdrop_tokens_script() {
    const { addresses, creator, collection_name, token_name, property_version, amount } = formInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::airdrop_tokens_script',
      type_arguments: [],
      arguments: [addresses, creator, collection_name, token_name, property_version, amount],
    };
  }

  function do_claim_tokens_script() {
    const { airdrop_ids } = formInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::claim_tokens_script',
      type_arguments: [],
      arguments: [airdrop_ids],
    };
  }

  return (
    <>
      <div className=" p-4 w-[60%] m-auto flex flex-wrap shadow-2xl opacity-80 mb-10 ">
        <p>
          <b>Module Path:</b>
          <a target="_blank" href={MODULE_URL}>
            {DAPP_ADDRESS}::{MODULE_NAME}
          </a>
        </p>
        {/* navbar */}
        <nav className="navbar py-4 px-4 bg-base-100">
          <div className="w-full">
            <ul className="w-full menu menu-horizontal p-0 ml-5 ">
              <li className="w-full  flex justify-between">
                <button
                  onClick={() => {
                    InitFormInput();
                    setComponent('airdrop_nft');
                  }}
                  className={
                    component === 'airdrop_nft'
                      ? 'font-sans font-semibold text-lg bg-[#EDEDEF]'
                      : 'font-sans font-semibold text-lg '
                  }>
                  Airdrop NFT
                </button>
                <button
                  onClick={() => {
                    InitFormInput();
                    setComponent('claim_nft');
                  }}
                  className={
                    component === 'claim_nft'
                      ? 'font-sans font-semibold text-lg bg-[#EDEDEF]'
                      : 'font-sans font-semibold text-lg '
                  }>
                  Claim NFT
                </button>
              </li>
            </ul>
          </div>
        </nav>
        {component === 'airdrop_nft' && (
          <div className="w-full flex flex-wrap justify-center">
            {formInput.addresses.map((item, index) => {
              return (
                <div className="w-full flex justify-between" key={index}>
                  <input
                    placeholder="Addresses for the Airdrop"
                    className="mt-8 p-4 input input-bordered input-primary w-full mr-1"
                    onChange={(e) => updateAddressList(e.target.value, index)}
                  />
                  {index === formInput.addresses.length - 1 && (
                    <button
                      onClick={subInput}
                      className={
                        'mt-8 btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                      }>
                      -
                    </button>
                  )}
                </div>
              );
            })}
            <div className="mt-8  w-full flex justify-end">
              <button
                onClick={addInput}
                className={
                  'btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                }>
                +
              </button>
            </div>

            <br></br>
            <input
              placeholder="NFT Creator"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, creator: e.target.value })}
            />
            <br></br>
            <input
              placeholder="NFT Collection Name"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, collection_name: e.target.value })}
            />
            <br></br>
            <input
              placeholder="NFT Token Name"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, token_name: e.target.value })}
            />
            <br></br>
            <input
              placeholder="NFT Property Version"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, property_version: parseInt(e.target.value) })}
            />
            <br></br>
            <input
              placeholder="Airdrop Amount to Each Address"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, amount: parseInt(e.target.value) })}
            />
            <br></br>
            <button
              onClick={airdrop_tokens_script}
              className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Submit to Airdrop NFT
            </button>
            <br></br>
            <br></br>
          </div>
        )}
        {component === 'claim_nft' && (
          <div className="w-full flex flex-wrap justify-center">
            {formInput.airdrop_ids.map((item, index) => {
              return (
                <div className="w-full flex justify-between" key={index}>
                  <input
                    placeholder="NFT Airdrop ID"
                    className="mt-8 p-4 input input-bordered input-primary w-full mr-1"
                    onChange={(e) => updateIds(e.target.value, index)}
                  />
                  {index === formInput.airdrop_ids.length - 1 && (
                    <button
                      onClick={subInput}
                      className={
                        'mt-8 btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                      }>
                      -
                    </button>
                  )}
                </div>
              );
            })}
            <div className="mt-8  w-full flex justify-end">
              <button
                onClick={addInput}
                className={
                  'btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                }>
                +
              </button>
            </div>
            <br></br>
            <button
              onClick={claim_tokens_script}
              className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Submit to Claim NFT
            </button>
            <br></br>
            <br></br>
          </div>
        )}
      </div>
    </>
  );
}
