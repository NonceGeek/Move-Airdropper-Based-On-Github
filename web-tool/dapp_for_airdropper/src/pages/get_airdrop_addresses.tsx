import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL } from '../config/constants'
import { useWallet } from '@manahippo/aptos-wallet-adapter'
import { useState } from 'react'
import React from 'react'
import { get_aptos_acct_by_github_acct } from '../requests/indexer'

import { useSessionStorage } from 'react-use'
export default function Home() {
  const { account, signAndSubmitTransaction } = useWallet()
  const [githubIds, setGithubIds] = useState<Array<string>>([''])
  const [showTable, setShowTable] = useState<{ github: string; address: string }[]>([])
  const [addressSession, setAddressSession] = useSessionStorage('airdropAddresses')
  // input an array of github ids, return an array of aptos addresses
  const getAirdropAddresses = async () => {
    if (githubIds !== undefined) {
      const out = await get_aptos_acct_by_github_acct(githubIds)
      const table = []
      const session = []
      if (out.data.result.length !== 0) {
        for (let i = 0; i < out.data.result.length; i++) {
          if (out.data.result[i] !== null) {
            table.push({
              github: githubIds[i],
              address: out.data.result[i],
            })
            session.push(out.data.result[i])
          }
        }
      }
      setShowTable([...table])
      setAddressSession(JSON.stringify(session))
    }
  }

  const parseGithubIds = (rawInput: string): Array<string> => {
    const splitInput = rawInput.split(',')
    const parsedInput = splitInput.map((id) => id.trim())
    return parsedInput
  }

  return (
    <div className=" p-4 w-[60%] m-auto flex flex-wrap shadow-2xl opacity-80 mb-10 justify-center ">
      <p>
        <b>Module Path:</b>
        <a target="_blank" href={MODULE_URL}>
          {DAPP_ADDRESS}::{MODULE_NAME}
        </a>
      </p>

      <div className="w-full flex justify-between">
        <input
          placeholder="Github IDs delimited by comma"
          className="mt-8 p-4 input input-bordered input-primary w-4/5 mr-1"
          onChange={(e: any) => setGithubIds(parseGithubIds(e.target.value))}
        />
        <button
          onClick={() => getAirdropAddresses()}
          className={'btn btn-primary font-bold mt-8  text-white rounded p-4 shadow-lg'}>
          Get Airdrop Addresses
        </button>
      </div>
      {showTable.length !== 0 && (
        <div className="overflow-x-auto w-full">
          <h3 className="text-center font-bold my-5">Address By Github ID</h3>
          <table className="table table-compact w-full my-2">
            <thead>
              <tr>
                <th></th>
                <th>Github ID</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {showTable.map((table, index) => {
                // TODO: click btn to make result fill to the Addresses@Coin airdropper
                // both average and unaverage.
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{table.github}</td>
                    <td>{table.address}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
