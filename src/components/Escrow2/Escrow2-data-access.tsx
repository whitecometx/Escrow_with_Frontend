'use client'

import { getEscrow2Program, getEscrow2ProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useEscrow2Program() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEscrow2ProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getEscrow2Program(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['Escrow2', 'all', { cluster }],
    queryFn: () => program.account.Escrow2.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['Escrow2', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ Escrow2: keypair.publicKey }).signers([keypair]).rpc(),
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

  const accountQuery = useQuery({
    queryKey: ['Escrow2', 'fetch', { cluster, account }],
    queryFn: () => program.account.Escrow2.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['Escrow2', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ Escrow2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['Escrow2', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ Escrow2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['Escrow2', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ Escrow2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['Escrow2', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ Escrow2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
