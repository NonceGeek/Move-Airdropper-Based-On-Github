import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL } from '../config/constants'
import { useWallet } from '@manahippo/aptos-wallet-adapter'
import { useState, useEffect } from 'react'
import React from 'react'
import { Uint32 } from '@martiandao/aptos-web3-bip44.js/dist/bcs'
import { useSessionStorage } from 'react-use'
export default function Home() {
  const { account, signAndSubmitTransaction } = useWallet()
  const [component, setComponent] = useState<string>('airdrop_same_amount')
  const [addressSession, setAddressSession] = useSessionStorage('airdropAddresses')
  const [airdropAddresses, setAirdropAddresses] = useState<Array<string>>([''])
  // NOTE ：这样设计存在数据污染，建议后期迭代，将不同接口数据分离开
  /*
    @solution：切换tab时，进行一次初始化
    @defect：两边数据无法共享，切换tab后，数据清零无法保存
  */
  const [formInput, updateFormInput] = useState<{
    addresses: Array<string>
    description: string
    moneys: Array<Number | string>
    money: number
  }>({
    addresses: [''],
    description: 'a simple airdrop!',
    moneys: [''],
    money: 0,
  })

  const InitFormInput = () => {
    formInput.addresses = ['']
    formInput.description = 'a simple airdrop!'
    formInput.moneys = ['']
    formInput.money = 0
    updateFormInput({ ...formInput })
  }

  const updateAddressList = (address: string, index: Uint32) => {
    formInput.addresses[index] = address
    updateFormInput({ ...formInput, ...formInput.addresses })
  }

  const updateMoneys = (money: string, index: Uint32) => {
    formInput.moneys[index] = apt_to_octos(parseFloat(money))
    updateFormInput({ ...formInput, ...formInput.moneys })
  }

  const addInput = () => {
    if (component === 'airdrop_same_amount') {
      formInput.addresses.push('')
      updateFormInput({ ...formInput, ...formInput.addresses })
    }
    if (component === 'airdrop_different_amount') {
      formInput.addresses.push('')
      formInput.moneys.push('')
      updateFormInput({ ...formInput, ...formInput.addresses, ...formInput.moneys })
    }
  }
  const subInput = () => {
    if (component === 'airdrop_same_amount') {
      if (formInput.addresses.length > 1) {
        formInput.addresses.pop()
        updateFormInput({ ...formInput, ...formInput.addresses })
      } else {
        alert('addressList length is not equal zero')
      }
    }
    if (component === 'airdrop_different_amount') {
      if (formInput.addresses.length > 1) {
        formInput.addresses.pop()
        formInput.moneys.pop()
        updateFormInput({ ...formInput, ...formInput.addresses, ...formInput.moneys })
      } else {
        alert('addressList length is not equal zero')
      }
    }
  }
  const fillAllAddress = () => {
    if (component === 'airdrop_same_amount') {
      formInput.addresses = [...airdropAddresses]
      updateFormInput({ ...formInput, ...formInput.addresses })
    }
    if (component === 'airdrop_different_amount') {
      formInput.addresses = [...airdropAddresses]
      formInput.moneys = []
      airdropAddresses.map(() => {
        formInput.moneys.push('')
      })
      updateFormInput({ ...formInput, ...formInput.addresses, ...formInput.moneys })
    }
  }

  const resetAllAddresses = () => {
    if (component === 'airdrop_same_amount') {
      formInput.addresses = ['']
      updateFormInput({ ...formInput, ...formInput.addresses })
    }
    if (component === 'airdrop_different_amount') {
      formInput.addresses = ['']
      formInput.moneys = ['']
      updateFormInput({ ...formInput, ...formInput.addresses, ...formInput.moneys })
    }
  }
  async function airdrop_coins_average_script() {
    console.log(do_airdrop_coins_average_script())

    await signAndSubmitTransaction(do_airdrop_coins_average_script(), { gas_unit_price: 100 })
  }

  async function airdrop_coins_not_average_script() {
    console.log(do_airdrop_coins_not_average_script())

    await signAndSubmitTransaction(do_airdrop_coins_not_average_script(), { gas_unit_price: 100 })
  }

  // TODO [x] Generate Funcs by ABI
  function do_airdrop_coins_average_script() {
    const { addresses, description, moneys, money } = formInput
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::airdrop_coins_average_script',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [description, addresses, money],
    }
  }

  function do_airdrop_coins_not_average_script() {
    const { addresses, description, moneys, money } = formInput
    return {
      type: 'entry_function_payload',
      function: DAPP_ADDRESS + '::airdropper::airdrop_coins_not_average_script',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [description, addresses, moneys],
    }
  }

  function apt_to_octos(num_apt: number) {
    return num_apt * 100_000_000
  }
  useEffect(() => {
    if (addressSession) {
      const address = JSON.parse(addressSession as string)
      if (address.length > 0) {
        setAirdropAddresses([...address])
      }
    }
  }, [addressSession])

  useEffect(() => {
    fillAllAddress()
  }, [airdropAddresses, component])

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
                    InitFormInput()
                    setComponent('airdrop_same_amount')
                  }}
                  className={
                    component === 'airdrop_same_amount'
                      ? 'font-sans font-semibold text-lg bg-[#EDEDEF]'
                      : 'font-sans font-semibold text-lg '
                  }>
                  Airdrop Same Amount
                </button>
                <button
                  onClick={() => {
                    InitFormInput()
                    setComponent('airdrop_different_amount')
                  }}
                  className={
                    component === 'airdrop_different_amount'
                      ? 'font-sans font-semibold text-lg bg-[#EDEDEF]'
                      : 'font-sans font-semibold text-lg '
                  }>
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
                    placeholder="Airdrop Receiving Address"
                    className="mt-8 p-4 input input-bordered input-primary w-full mr-1"
                    onChange={(e) => updateAddressList(e.target.value, index)}
                    value={item}
                  />
                  {index != formInput.addresses.length - 1 && (
                    <div
                      className={
                        'mt-8  font-bold text-white  w-[50px] flex justify-center items-center text-[30px]'
                      }></div>
                  )}
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
              )
            })}
            <div className="mt-8  w-full flex justify-end">
              <button
                onClick={resetAllAddresses}
                className={'btn btn-primary font-bold  text-white rounded p-4 shadow-lg mr-5'}>
                Reset All Addresses
              </button>
              <button
                onClick={addInput}
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
                    placeholder="Airdrop Receiving Address"
                    className="mt-8 p-4 input input-bordered input-primary w-[68%]"
                    onChange={(e) => updateAddressList(e.target.value, index)}
                    value={item}
                  />
                  {/* TODO: [x] decimals translation */}
                  <input
                    placeholder="Airdrop Amount"
                    className="mt-8 p-4 input input-bordered input-primary"
                    onChange={(e) => updateMoneys(e.target.value, index)}
                  />
                  {index != formInput.addresses.length - 1 && (
                    <div
                      className={
                        'mt-8  font-bold text-white  w-[50px] flex justify-center items-center text-[30px]'
                      }></div>
                  )}
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
              )
            })}
            <div className="mt-8  w-full flex justify-end">
              {airdropAddresses.length > 0 && (
                <button
                  onClick={fillAllAddress}
                  className={'btn btn-primary font-bold  text-white rounded p-4 shadow-lg mr-5'}>
                  Fill All Addresses
                </button>
              )}
              <button
                onClick={resetAllAddresses}
                className={'btn btn-primary font-bold  text-white rounded p-4 shadow-lg mr-5'}>
                Reset All Addresses
              </button>
              <button
                onClick={addInput}
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
    </>
  )
}
