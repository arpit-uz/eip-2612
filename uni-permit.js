import { signERC2612Permit } from "eth-permit"; 
import { ethers } from 'ethers';
import Web3 from 'web3'
import HDWalletProvider from "@truffle/hdwallet-provider";
import {ABI} from '../eip-2612/ABI.js'


let hdWallet = new HDWalletProvider(["e73de1205f0146c16f00c748709760a345f152660a2e7af5abf6a61048b9554b","e9c730cfba8b1d0cf7428cd2be8cb52e0e20df83d92db78201a4ee68122e1cec"],"https://polygon-rpc.com/"
  );
const web3 = new Web3(hdWallet);
const polyUsdcProxy = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const polyUsdcImpl = '0xDD9185DB084f5C4fFf3b4f70E7bA62123b812226'
const provider =  new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/")
const ownerWallet = new ethers.Wallet('e73de1205f0146c16f00c748709760a345f152660a2e7af5abf6a61048b9554b', provider);
const wallet2 = '0xFd71Dc9721d9ddCF0480A582927c3dCd42f3064C'
const usdcContract = new web3.eth.Contract(ABI, polyUsdcProxy);


async function lets() {
    const senderAddress = await ownerWallet.getAddress();
    console.log(senderAddress)
    const result = await signERC2612Permit(ownerWallet, polyUsdcProxy, senderAddress, wallet2, 10, 9647277491);
    console.log(result)
    const receipt = await usdcContract.methods.permit(senderAddress, wallet2, '10', 9647277491, result.v, result.r, result.s).send({from: '0x207ca4370639120f9A049aF9CAB4fCaa608F2445'})
    console.log(receipt)    
}

(async() => {
    console.log('1')
    await lets()  
    console.log('2')
  })()

