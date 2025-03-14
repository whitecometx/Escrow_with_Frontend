'use client'

import { getEscrow2Program, getEscrow2ProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import BN from 'bn.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function useEscrow2Program() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEscrow2ProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getEscrow2Program(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['Escrow2', 'all', { cluster }],
    queryFn: () => program.account.escrow.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

    //BabyAstro : 21SsSN352gTwT8eKqtYha3DZYqMT3tfCGVZX2T13NxCH
    //RedRug : Ac8u3Uk7FrRTtWsVbmWpYQp2iwd2tdc3qWJneABvGGtK
  const initialize = useMutation({
    mutationKey: ['Escrow2', 'initialize', { cluster }],
    mutationFn: async(keypair: Keypair) =>
      { const seed = new BN(1);
        const depositAmount = new BN(50);
        const recieve = new BN(50);
        const mintA = new PublicKey("21SsSN352gTwT8eKqtYha3DZYqMT3tfCGVZX2T13NxCH");
        const mintB = new PublicKey("Ac8u3Uk7FrRTtWsVbmWpYQp2iwd2tdc3qWJneABvGGtK")
        const mintAtaA = await getAssociatedTokenAddress(
          mintA, 
          provider.publicKey,);
        
        const [escrow] = PublicKey.findProgramAddressSync(
              [Buffer.from("escrow"), provider.publicKey.toBuffer(), seed.toBuffer('le', 8)],
              program.programId
            );
        const vault = getAssociatedTokenAddressSync(
              mintA, 
              escrow,
              true
            );
      return await program.methods
              .make(seed, depositAmount, recieve)
              .accountsStrict({
                maker: provider.publicKey,
                mintA,
                mintB,
                vault,
                escrow,
                mintAtaA,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
              })
              .rpc()

            },
      onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })
  const takemutation = useMutation({
    mutationKey: ['Escrow2', 'take', { cluster }],
    mutationFn: async(keypair: Keypair) =>
      { const seed = new BN(1);
        const maker = accountQuery.data?.maker;
        const depositAmount = new BN(50);
        const recieve = new BN(50);
        const mintA = new PublicKey("21SsSN352gTwT8eKqtYha3DZYqMT3tfCGVZX2T13NxCH");
        const mintB = new PublicKey("Ac8u3Uk7FrRTtWsVbmWpYQp2iwd2tdc3qWJneABvGGtK")
        const mintAtaA = await getAssociatedTokenAddress(
          mintA, 
          provider.publicKey,);
        
        const [escrow] = PublicKey.findProgramAddressSync(
              [Buffer.from("escrow"), provider.publicKey.toBuffer(), Buffer.from(seed.toString())],
              program.programId
            );
        const vault = getAssociatedTokenAddressSync(
              mintA, 
              escrow,
              true
            );
      return await program.methods
              .take()
              .accountsStrict({
                taker: provider.publicKey,
                maker,
                mintA,
                mintB,
                vault,
                escrow,
                mintAtaA,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
              })
              .rpc()
  
            },
      onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  }) 
  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}
  export function useEscrow2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useEscrow2Program()
  const provider = useAnchorProvider()
  const accountQuery = useQuery({
    queryKey: ['Escrow2', 'fetch', { cluster, account }],
    queryFn: () => program.account.escrow.fetch(account),
  })

  const vaultQuery = useQuery({
    queryKey: ['escrow2', 'vault', { cluster, account }],
    queryFn: async() => {
      console.log("hey");
      const mintA = new PublicKey("21SsSN352gTwT8eKqtYha3DZYqMT3tfCGVZX2T13NxCH");

      const vault = getAssociatedTokenAddressSync(
        mintA, 
        account,
        true
      );

      console.log(vault.toBase58());

      const vaultAccount = await getAccount(provider.connection, vault)
      return vaultAccount
    },
})


return {
  accountQuery,
  vaultQuery
}
}

