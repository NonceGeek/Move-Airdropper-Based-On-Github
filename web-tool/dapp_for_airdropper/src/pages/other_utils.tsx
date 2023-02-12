import {
    DAPP_ADDRESS,
    MODULE_NAME,
    MODULE_URL,
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useState } from "react";
import React from "react";

export default function Home() {

    const { account, signAndSubmitTransaction } = useWallet();

    async function initialize_script() {
        await signAndSubmitTransaction(
            do_initialize_script(),
            { gas_unit_price: 100 }
        ); 
    }

    function do_initialize_script() {
        return {
            type: "entry_function_payload",
            function: DAPP_ADDRESS + "::airdropper::initialize_script",
            type_arguments: [],
            arguments: [],
        };
    }

    return (
        <div>
            <p>
                <b>Module Path:</b>
                <a target="_blank" href={MODULE_URL}>{DAPP_ADDRESS}::{MODULE_NAME}</a>
            </p>
            
            <div>
                {account?.address ? (
                    <div>
                    <p>
                        Wallet connected at account address: {account!.address!.toString()!}
                    </p>
                    <button
                        onClick={initialize_script}
                        className={
                            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
                    }>
                        Initialize Airdropper
                    </button>
                    </div>
                ) : (
                    <p>
                        You need to connect your wallet using the button at the top right to initialize an airdropper under your address.
                    </p>
                )}
            </div>
        </div >
    );
}