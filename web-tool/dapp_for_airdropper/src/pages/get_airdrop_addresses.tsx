import { DAPP_ADDRESS, MODULE_NAME, MODULE_URL } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useState, useEffect } from 'react';
import React from 'react';
import { get_aptos_acct_by_github_acct } from "../requests/indexer"
import { Uint32 } from '@martiandao/aptos-web3-bip44.js/dist/bcs';

interface funData {
    params: [];
}

export default function Home() {
    const { account, signAndSubmitTransaction } = useWallet();
    const [githubIds, setGithubIds] = useState<Array<string>>([""]);
    const [airdropAddresses, setAirdropAddresses] = useState<Array<string>>([""]);
  
    // input an array of github ids, return an array of aptos addresses
    const getAirdropAddresses = async () => {
        if(githubIds !== undefined) {
            let data:Array<string> = [];
            githubIds.map(async (githubId) => {
                try {
                    const out = await get_aptos_acct_by_github_acct(githubId);
                    data.push(out.data.result.payload);
                    setAirdropAddresses(data);
                } catch (error) {
                    console.log(error);
                } 
            });
        }
    }

    const parseGithubIds = (rawInput: string): Array<string> => {
        const splitInput = rawInput.split(",");
        const parsedInput = splitInput.map((id) => id.trim());
        return parsedInput;
    }

    const renderAirdropAddresses = () => {
        if(airdropAddresses !== undefined) {
            return airdropAddresses.map((address) => {
                return (
                    <div className="w-full flex justify-between">
                        <p>
                            {address}
                        </p>
                    </div>
                );
            });
        }
    }

    console.log(githubIds);
    console.log(typeof githubIds);

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
                placeholder="Airdrop Address"
                className="mt-8 p-4 input input-bordered input-primary w-full mr-1"
                onChange={(e: any) => setGithubIds(parseGithubIds(e.target.value))}
            />
            <button
                onClick={() => getAirdropAddresses()}
                className={'btn btn-primary font-bold mt-16  text-white rounded p-4 shadow-lg'}>
                Get Airdrop Addresses
            </button>
        </div>

        <div>
            {renderAirdropAddresses()}
        </div>
    </div>
  );
}
