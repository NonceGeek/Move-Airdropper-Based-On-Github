# Frontend Interaction Guide for Airdropper

The Airdropper dApp allows the user to airdrop fungible tokens (Coins) and NFTs (Tokens) based on the Aptos blockchain. All airdrop history data are stored on a resource account on Aptos. The frontend has four tabs: **CoinAirdropper**, **NFTAirdropper**, **Source Code**, and **Contract on Explorer**, each described in details below.

## CoinAirdropper

The CoinAirdropper tab facilitates airdrops of fungible tokens (Coins) on Aptos. The user inputs the description, recipient address(es) and amount(s) of an airdrop and 
submits the transaction on chain by clicking one of the two buttons corresponding to two different airdrop modes, i.e. **average** and **non-average**.
<br/>
<br/>

In the **average** mode, the user sends the same amount to all airdrop recipients. Three fields are required: `Description for the airdrop`, `Addresses for the airdrop` (a vector of addresses), and `Money for the airdrop (average)` (the amount sent to **each** recipient).
<br/>
<br/>

In the **non-average** mode, the user sends a customized amount to each recipient, defined by a vector of amounts to send. Three fields are required: `Description for the airdrop`, `Addresses for the airdrop` (a vector of addresses), and `Moneys for the airdrop (not average)` (a vector of amounts sent to each recipient address). Note that the recipient address(es) vector needs to have the same length as the amount(s) vector.
<br/>
<br/>

All airdrop data are logged on chain via events to the resource address displayed at the top of the tab after **Module Path:**. As of now, the default coin to airdrop is `0x1::aptos_coin::AptosCoin`, though a configurable coin type will be supported in the future.

## NFTAirdropper

Coming soon.

## Source Code
Links to the [github repo](https://github.com/qwang98/Airdropper-Based-On-Github) of this project.

## Contract on Explorer
Links to the Aptos Explorer page for the Mainnet resource account contract that logs all airdrop events.
