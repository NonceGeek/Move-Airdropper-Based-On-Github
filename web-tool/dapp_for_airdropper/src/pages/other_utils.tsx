import {
    DAPP_ADDRESS,
    MODULE_NAME,
    MODULE_URL,
    APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";
import React from "react";
import { AptosAccount, AptosClient, BCS, HexString } from "aptos";

export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();

  const [airdropCoinEvents, setAirdropCoinEvents] = useState<Array<{
    coin_amount: number,
    description: string,
    receiver_address: string,
    sender_address: string,
    timestamp: number
  }>>([{
    coin_amount: 0,
    description: "",
    receiver_address: "",
    sender_address: "",
    timestamp: 0
  }]);
  const [airdropTokenEvents, setAirdropTokenEvents] = useState<Array<{
    airdrop_id: number,
    sender_address: string,
    token_id: {
      token_data_id: {
        creator: string, 
        collection: string,
        name: string
      }, 
      property_version: number
    }, 
    amount: number,
    timestamp: number, 
    receiver_address: string
  }>>([{
    airdrop_id: 0,
    sender_address: "",
    token_id: {
      token_data_id: {
        creator: "", 
        collection: "",
        name: ""
      }, 
      property_version: 0
    }, 
    amount: 0,
    timestamp: 0, 
    receiver_address: ""
  }]);
  const [claimTokenEvents, setClaimTokenEvents] = useState([]);

  const [fetchedAirdropCoinEvents, setFetchedAirdropCoinEvents] = useState<boolean>(false);
  const [fetchedAirdropTokenEvents, setFetchedAirdropTokenEvents] = useState<boolean>(false);
  const [fetchedClaimTokenEvents, setFetchedClaimTokenEvents] = useState<boolean>(false);

  const resourceAccountAddr = AptosAccount.getResourceAccountAddress(
    DAPP_ADDRESS, 
    new HexString("01").toUint8Array()
  );
  const client = new AptosClient(APTOS_NODE_URL);

  const get_airdrop_coin_events = async () => {
    try {
      const events = await client.getEventsByEventHandle(
        resourceAccountAddr, 
        DAPP_ADDRESS + "::airdropper::AirdropItemsData", 
        "airdrop_coin_events"
      );
      const data = events.map((event) => {return event.data});
      setAirdropCoinEvents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchedAirdropCoinEvents(true);
    }
  };
  const get_airdrop_token_events = async () => {
    try {
      const events = await client.getEventsByEventHandle(
        resourceAccountAddr, 
        DAPP_ADDRESS + "::airdropper::AirdropItemsData", 
        "airdrop_token_events"
      );
      const data = events.map((event) => {return event.data});
      setAirdropTokenEvents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchedAirdropTokenEvents(true);
    }
  };

  const render_airdrop_coin_events = () => {
    return airdropCoinEvents.map((data, index) => (
      <tr>
        <td>{data.sender_address.substring(0, 10) + "..."}</td>
        <td>{data.description.substring(0, 20)}</td>
        <td>{(data.coin_amount/100_000_000).toFixed(4)}</td>
        <td>{new Date(data.timestamp * 1000).toLocaleString()}</td>
        <td>{data.receiver_address.substring(0, 10) + "..."}</td>
      </tr>
    ));
  };
  const render_airdrop_token_events = () => {
    let out_array = [];
    for(let i=0; i<airdropTokenEvents.length; i++) {
      const {
        airdrop_id,
        sender_address,
        token_id: {
          token_data_id: {
            creator, 
            collection,
            name
          }, 
          property_version
        }, 
        amount,
        timestamp, 
        receiver_address
      } = airdropTokenEvents[i];
      out_array.push((
        <tr>
          <td>{airdrop_id}</td>
          <td>{sender_address.substring(0, 10) + "..."}</td>
          <td>{creator.substring(0, 10) + "..."}</td>
          <td>{collection}</td>
          <td>{name}</td>
          <td>{property_version}</td>
          <td>{amount}</td>
          <td>{new Date(timestamp * 1000).toLocaleString()}</td>
          <td>{receiver_address.substring(0, 10) + "..."}</td>
        </tr>
      ));
    }
    return out_array;
  }

  useEffect(
    () => {get_airdrop_coin_events()}, 
    []
  );
  useEffect(
    () => {get_airdrop_token_events()},
  );

  async function get_claim_token_events() {
    const out = await client.getEventsByEventHandle(
      resourceAccountAddr, 
      DAPP_ADDRESS + "::airdropper::AirdropItemsData", 
      "claim_token_events"
    ).then(events => events.map(event => event.data)).
    catch(err => console.log(err));
    return out;
  }

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
          
          {fetchedAirdropCoinEvents && 
            <div>
              <br/>
              <p><b>Airdrop Coin Events</b></p>
              <table className="table-auto">
                <tr>
                  <th>Sender Address</th>
                  <th>Description</th>
                  <th>Coin Amount</th>
                  <th>Timestamp</th>
                  <th>Receiver Address</th>
                </tr>
                {render_airdrop_coin_events()}
              </table>
              <br/>
            </div>
          }

          {fetchedAirdropTokenEvents && 
            <div>
              <p><b>Airdrop Token Events</b></p>
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Airdrop ID</th>
                    <th>Sender Address</th>
                    <th>Creator</th>
                    <th>Collection</th>
                    <th>Name</th>
                    <th>Property Version</th>
                    <th>Amount</th>
                    <th>Timestamp</th>
                    <th>Receiver Address</th>
                  </tr>
                </thead>
                <tbody>
                  {render_airdrop_token_events()}
                </tbody>
              </table>
            </div>
          }
      </div>
  );
}