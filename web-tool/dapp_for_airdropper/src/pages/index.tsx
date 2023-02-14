import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useState } from 'react';
import React from 'react';
import { Uint32 } from '@martiandao/aptos-web3-bip44.js/dist/bcs';

export default function Home() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [component, setComponent] = useState<string>('airdrop_same_amount');
  // NOTE ：这样设计存在数据污染，建议后期迭代，将不同接口数据分离开
  /*
    @solution：切换tab时，进行一次初始化
    @defect：两边数据无法共享，切换tab后，数据清零无法保存
  */
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>;
    description: string;
    moneys: Array<Number | string>;
    money: number;
  }>({
    addresses: [''],
    description: 'a simple airdrop!',
    moneys: [''],
    money: 0,
  });

  const InitFormInput = () => {
    formInput.addresses = [''];
    formInput.description = 'a simple airdrop!';
    formInput.moneys = [''];
    formInput.money = 0;
    updateFormInput({ ...formInput });
  };

  const updateAddressList = (address: string, index: Uint32) => {
    formInput.addresses[index] = address;
    updateFormInput({ ...formInput, ...formInput.addresses });
  };

  const updateAccountList = (account: string, index: Uint32) => {
    formInput.moneys[index] = apt_to_octos(parseFloat(account));
    updateFormInput({ ...formInput, ...formInput.moneys });
  };

  const addAddress = () => {
    if (component === 'airdrop_same_amount') {
      formInput.addresses.push('');
      updateFormInput({ ...formInput, ...formInput.addresses });
    }
    if (component === 'airdrop_different_amount') {
      formInput.addresses.push('');
      formInput.moneys.push('');
      updateFormInput({ ...formInput, ...formInput.addresses, ...formInput.moneys });
    }
  };
  const subAddress = () => {
    if (formInput.addresses.length > 1) {
      formInput.addresses.pop();
      updateFormInput({ ...formInput, ...formInput.addresses });
    } else {
      alert('addressList length is not equal zero');
    }
  };
  async function airdrop_coins_average_script() {
    await signAndSubmitTransaction(do_airdrop_coins_average_script(), { gas_unit_price: 100 });
  }

  async function airdrop_coins_not_average_script() {
    await signAndSubmitTransaction(do_airdrop_coins_not_average_script(), { gas_unit_price: 100 });
  }

  // TODO [x] Generate Funcs by ABI
  function do_airdrop_coins_average_script() {
    const { addresses, description, moneys, money } = formInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::airdrop_coins_average_script',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [description, addresses, money],
    };
  }

  function do_airdrop_coins_not_average_script() {
    const { addresses, description, moneys, money } = formInput;
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::airdrop_coins_not_average_script',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [description, addresses, moneys],
    };
  }

  function apt_to_octos(num_apt: number) {
    return num_apt * 100_000_000;
  }

  function str_to_int_batched(arr: Array<Number | string>) {
    var i;
    var arr_int = [];
    for (i in arr) {
      arr_int.push(apt_to_octos(parseFloat(arr[i] as string)));
    }
    return arr_int;
  }

  return (
    <>
      <div className=" p-4 w-[60%] m-auto flex flex-wrap shadow-2xl opacity-80   ">
        <p>
          <b>Module Path:</b>
          <a target="_blank" href={MODULE_URL}>
            {DAPP_ADDRESS}::{MODULE_NAME}
          </a>
        </p>
        <nav className="navbar py-4 px-4 bg-base-100 ">
          <div className="w-full">
            <ul className="w-full menu menu-horizontal p-0 ml-5 ">
              <li className="w-full  flex justify-between">
                <button
                  onClick={() => {
                    InitFormInput();
                    setComponent('airdrop_same_amount');
                  }}
                  className={'font-sans font-semibold text-lg '}>
                  Airdrop Same Amount
                </button>
                <button
                  onClick={() => {
                    InitFormInput();
                    setComponent('airdrop_different_amount');
                  }}
                  className={'font-sans font-semibold text-lg '}>
                  Airdrop Different Amount
                </button>
              </li>
            </ul>
          </div>
        </nav>
        {component === 'airdrop_same_amount' && (
          <div className=" w-full flex flex-wrap justify-center">
            <input
              placeholder="Airdrop Description"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <input
              placeholder="Airdrop Amount to Each Address"
              className="mt-8 p-4 input input-bordered input-primary  w-full"
              onChange={(e) => updateFormInput({ ...formInput, money: apt_to_octos(parseFloat(e.target.value)) })}
            />
            {formInput.addresses.map((item, index) => {
              return (
                <div className="w-full flex justify-between" key={index}>
                  <input
                    placeholder="Airdrop Address"
                    className="mt-8 p-4 input input-bordered input-primary w-full mr-1"
                    onChange={(e) => updateAddressList(e.target.value, index)}
                  />
                  {index === formInput.addresses.length - 1 && (
                    <button
                      onClick={() => subAddress()}
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
                onClick={addAddress}
                className={
                  'btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                }>
                +
              </button>
            </div>
            <button
              onClick={airdrop_coins_average_script}
              className={'btn btn-primary font-bold mt-16  text-white rounded p-4 shadow-lg'}>
              Airdrop Same Amount to Each Address
            </button>
            <br></br>
          </div>
        )}

        {component === 'airdrop_different_amount' && (
          <div className=" w-full flex flex-wrap justify-center">
            <input
              placeholder="Airdrop Description"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            />
            {formInput.addresses.map((item, index) => {
              return (
                <div className="w-full flex justify-between" key={index}>
                  <input
                    placeholder="Airdrop Address"
                    className="mt-8 p-4 input input-bordered input-primary w-[45%]"
                    onChange={(e) => updateAddressList(e.target.value, index)}
                  />
                  {/* TODO: [x] decimals translation */}
                  <input
                    placeholder="Airdrop Amount"
                    className="mt-8 p-4 input input-bordered input-primary w-[45%]"
                    onChange={
                      (e) => updateAccountList(e.target.value, index)
                      // updateFormInput({ ...formInput, moneys: str_to_int_batched(JSON.parse(e.target.value)) })
                    }
                  />
                  <button
                    onClick={() => subAddress()}
                    className={
                      'mt-8 btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                    }>
                    -
                  </button>
                </div>
              );
            })}
            <div className="mt-8  w-full flex justify-end">
              <button
                onClick={addAddress}
                className={
                  'btn btn-primary font-bold text-white  w-[50px] rounded-[50%] shadow-lg flex justify-center items-center text-[30px]'
                }>
                +
              </button>
            </div>
            <button
              onClick={airdrop_coins_not_average_script}
              className={'btn btn-primary font-bold mt-16  text-white rounded p-4 shadow-lg'}>
              Airdrop Different Amount to Each Address
            </button>
            <br></br>
          </div>
        )}
      </div>

      {/* <div className=" mt-96">
        <p>
          <b>Module Path:</b>
          <a target="_blank" href={MODULE_URL}>
            {DAPP_ADDRESS}::{MODULE_NAME}
          </a>
        </p>
        <nav className="navbar py-4 px-4 bg-base-100">
          <div className="flex-1">
            <ul className="menu menu-horizontal p-0 ml-5">
              <li className="flex-1">
                <button
                  onClick={() => setComponent('airdrop_same_amount')}
                  className={'font-sans font-semibold text-lg'}>
                  Airdrop Same Amount
                </button>
                <button
                  onClick={() => setComponent('airdrop_different_amount')}
                  className={'font-sans font-semibold text-lg'}>
                  Airdrop Different Amount
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {component === 'airdrop_same_amount' && (
          <div>
            <input
              placeholder="Description for the Airdrop"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <br></br>
            <input
              placeholder="Addresses for the Airdrop"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, addresses: JSON.parse(e.target.value) })}
            />
            <br></br>
            <input
              placeholder="Airdrop Amount to Each Address"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, money: apt_to_octos(parseFloat(e.target.value)) })}
            />
            <button
              onClick={airdrop_coins_average_script}
              className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Airdrop Same Amount to Each Address
            </button>
            <br></br>
          </div>
        )}

        {component === 'airdrop_different_amount' && (
          <div>
            <input
              placeholder="Description for the Airdrop"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <br></br>
            <input
              placeholder="Addresses for the Airdrop"
              className="mt-8 p-4 input input-bordered input-primary w-full"
              onChange={(e) => updateFormInput({ ...formInput, addresses: JSON.parse(e.target.value) })}
            />
            <br></br>
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
              className={'btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg'}>
              Airdrop Different Amount to Each Address
            </button>
            <br></br>
          </div>
        )}
      </div> */}
    </>
  );
}
