# Airdropper-Based-On-Github

Coin / Token Airdropper based on Github that impl by Aptos, is an dApp of [MoveDID](https://github.com/NonceGeek/MoveDID).
![Airdropper based on Github (2)](https://p.ipic.vip/24v8gs.png)

Important Links: 

> dApp: https://airdropper.movedid.build
>
> Demo Video: https://youtu.be/Uk-FaoZ59BQ
>
> Contract on Mainnet:
>
> https://explorer.aptoslabs.com/account/500977ea8d9cc8dfac2a1d46530acdd0d35879eea150783d644e27372e0fb846/modules?network=mainnet
>
> Contract on Testnet: 
>
> https://explorer.aptoslabs.com/account/0xdd3adff476fef28e9a3811c62e09b194e4aa8bf06ec8e8a3f16a600e937e6b0f/transactions

## 0x01 Introduction

Airdropper is both a Aptos-based airdrop tool and an extension of MoveDID. On the one hand, it can be used to airdrop directly to a list of Aptos addresses, on the other hand, after binding Aptos addresses with GitHub accounts through MoveDID, it can be used to bulk airdrop to contributors of designated Repo or Organization.

## 0x02 Background

There are many projects that try to Buidl a DAO system that includes airdrops, polls, etc., but probably it will be a standalone system.
However, with the development of the open source culture, Git + Github already has the capability for large-scale multi-party asynchronous collaboration. 
Therefore, designing a DAO plugin system based on Github and Move chains like Aptos is a **lighter, more sensible, and less mentally taxing solution** for developers.

![](https://p.ipic.vip/01ih7b.png)

![DAO System based on Github Layers](https://p.ipic.vip/s01ak9.png)

## 0x03 Installation Guide

The installation guide is for users who want to deploy their own contract on chain and hold airdropped NFTs in their own resource accounts before the NFTs are claimed by their recipients. To install:
- Make sure you have Aptos CLI and its dependencies installed.
- Clone this repo.
- Navigate your current directory to `smart-contract/airdropper` folder.
- Change `my_addr` field in `Move.toml` to your deployer address.
- In Aptos CLI, run `aptos move compile` and then run `aptos move publish --private-key <private key of deployer address> --url <node url of aptos client>` and wait for the deployment success transaction message.
- Navigate your current directory to `web-tool/dapp_for_airdropper` folder.
- Customize environment variables including faucet URL, node URL, and DAPP address in `.env` file and `config/constants.ts` file. Note that faucet and node URL need to match network (e.g. mainnet, testnet) and that DAPP address is the same as deployer address. 
- Install all web client dependencies using `yarn` or `npm install`.
- Deploy the website locally or on a remote host using command for example `yarn dev`.


## 0x04 Use Guide

### Project Introduction

https://www.youtube.com/watch?v=Uk-FaoZ59BQ

#### Get airdrop Addresses
![demo](https://user-images.githubusercontent.com/57781136/219634371-1405d545-54f6-4528-90e5-f4bc213c30ec.gif)

#### Coin Airdropper
![demo1](https://user-images.githubusercontent.com/57781136/219634585-de1dc431-d1ef-492f-9939-e81bb1598596.gif)

#### NFT Airdropper
![demo2](https://user-images.githubusercontent.com/57781136/219636705-087c21c4-6dee-4ae9-88e5-46d0220222bd.gif)

