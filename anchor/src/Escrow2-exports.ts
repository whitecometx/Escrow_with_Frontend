// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Escrow2IDL from '../target/idl/Escrow2.json'
import type { Escrow2 } from '../target/types/Escrow2'

// Re-export the generated IDL and type
export { Escrow2, Escrow2IDL }

// The programId is imported from the program IDL.
export const ESCROW2_PROGRAM_ID = new PublicKey(Escrow2IDL.address)

// This is a helper function to get the Escrow2 Anchor program.
export function getEscrow2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Escrow2IDL, address: address ? address.toBase58() : Escrow2IDL.address } as Escrow2, provider)
}

// This is a helper function to get the program ID for the Escrow2 program depending on the cluster.
export function getEscrow2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Escrow2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ESCROW2_PROGRAM_ID
  }
}
