import Web3 from 'web3'
import {ABI} from '../eip-2612/ABI.js'
import HDWalletProvider from "@truffle/hdwallet-provider";
const defaultSpender = "0x207ca4370639120f9A049aF9CAB4fCaa608F2445";
const nonce = 1;
const defaultSender = "0xFd71Dc9721d9ddCF0480A582927c3dCd42f3064C";
const chainId = 137;
const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
import {  getPermitDigest, PERMIT_TYPEHASH } from "../eip-2612/signatures.js"

let provider = new HDWalletProvider(["e73de1205f0146c16f00c748709760a345f152660a2e7af5abf6a61048b9554b","e9c730cfba8b1d0cf7428cd2be8cb52e0e20df83d92db78201a4ee68122e1cec"],"https://polygon-mainnet.g.alchemy.com/v2/UxNKJculPwa1AqNx3omJhXDRVO9wWuMj"
  );  
console.log('permit '+PERMIT_TYPEHASH)
const web3 = new Web3(provider);

const usdcContract = new web3.eth.Contract(ABI, usdcAddress);

async function signAndPermit() {
    const approve = {
      owner: defaultSpender,
      spender: defaultSender,
      value: 10,
    }
    const deadline = 9647073091
    const digest = getPermitDigest(approve,0,deadline)
    console.log(digest)
    console.log('digest'+digest)
    const res = await web3.eth.sign(digest,approve.owner)
    const r = res.slice(0, 66)
    const s = '0x'+res.slice(66, 130)
    const v = parseInt(res.slice(130, 132), 16)
    console.log(v.toString(),r.toString(),s.toString())
    const receipt = await usdcContract.methods.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s).send({from: approve.spender})
    
}

(async() => {
    console.log('1')
    await signAndPermit()  
    console.log('2')
  })()