import { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } from 'ethers/lib/utils.js'
import ethers from 'ethers'
import { ecsign } from 'ethereumjs-util'
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from 'web3'
const { BigNumberish } = ethers;
let provider = new HDWalletProvider(["e73de1205f0146c16f00c748709760a345f152660a2e7af5abf6a61048b9554b","e9c730cfba8b1d0cf7428cd2be8cb52e0e20df83d92db78201a4ee68122e1cec"],"https://polygon-mainnet.g.alchemy.com/v2/UxNKJculPwa1AqNx3omJhXDRVO9wWuMj"
  );  
const web3 = new Web3(provider);
export const sign = (digest, privateKey) => {
  return ecsign(Buffer.from(digest.slice(2), 'hex'), privateKey)
}

export const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
)

// Returns the EIP712 hash which should be signed by the user
// in order to make a call to `permit`
export function getPermitDigest(
  approve,
  nonce,
  deadline
) {
  const DOMAIN_SEPARATOR = '0x294369e003769a2d4d625e8a9ebebffa09ff70dd7c708497d8b56d2c2d199a19'
  // console.log('domain'+DOMAIN_SEPARATOR,address,chainId,PERMIT_TYPEHASH)
  return keccak256(
    solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
          )
        ),
      ]
    )
  )
}

// Gets the EIP712 domain separator
export function getDomainSeparator(name , contractAddress, chainId) {
  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes('2')),
        chainId,
        contractAddress,
      ]
    )
  )
}