import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit'
import { getMasterChefAddress, getMasterChef20Address } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { BigNumber } from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import getNetwork from 'utils/getNetwork'
import useGeneralMigratorAllowance from 'hooks/useGeneralMigratorAllowance'
import useToast from 'hooks/useToast'
import { useUnstake20 } from 'hooks/useUnstake'
import { useApprove, useApprove20 } from 'hooks/useApprove'
import useStake from 'hooks/useStake'
import farms from 'config/constants/farms'
import useWeb3 from 'hooks/useWeb3'

const FarmMigratorPool = ({ pid, name, stakedBalance, lpToken }) => {
  const [pendingTx, setPendingTx] = useState<boolean>(false)
  const [migrationStatusText, setMigrationStatusText] = useState<string>('Not Migrated')
  const [poolIsMigrated, setPoolIsMigrated] = useState<boolean>(false)
  const [depositPid, setDepositPid] = useState<number>()

  const { toastSuccess, toastError } = useToast()
  const web3 = useWeb3()
  const lpContract = getBep20Contract(lpToken, web3)
  const { config, chainId } = getNetwork()

  // useUnstake is passed decimal numbers from the farm so we need to convert first
  const formattedAmount = new BigNumber(stakedBalance).dividedBy(DEFAULT_TOKEN_DECIMAL).toString()

  // allowance farm 2.0
  const farm20Address = getMasterChef20Address()
  const allowance20 = useGeneralMigratorAllowance(lpContract, farm20Address)
  const needsApproval20 = !allowance20?.gt(stakedBalance)

  // allowance farm 2.1
  const farmAddress = getMasterChefAddress()
  const allowance = useGeneralMigratorAllowance(lpContract, farmAddress)
  const needsApproval = !allowance?.gt(stakedBalance)

  const { onUnstake20 } = useUnstake20(pid)
  const { onStake } = useStake(depositPid)
  const { onApprove } = useApprove(lpContract)
  const { onApprove20 } = useApprove20(lpContract)

  useEffect(() => {
    let isMounted = true
    if (!depositPid) {
      const findDepositPid = async () => {
        const despositPidFound = await farms[config.network].filter((pool) => {
          if (pool.lpAddresses[chainId] === lpToken) {
            return pool
          }
          return false
        })[0]?.pid
        if (isMounted) {
          setDepositPid(despositPidFound)
        }
      }
      findDepositPid()
    }
    return () => {
      isMounted = false
    }
  }, [chainId, lpToken, config.network, depositPid])

  // use hooks to migrate
  const handleApprove20 = async () => {
    try {
      if (needsApproval20) {
        await onApprove20()
      }
      setMigrationStatusText('Origin farm is  approved, waiting for withdraw action...')
      toastSuccess(`Approve`, 'Origin farm pool is approved!')
    } catch (e) {
      toastError(`Approve`, 'ERROR!')
      console.error(e)
    }
  }

  const handleUnstake = async (amount: string) => {
    try {
      await onUnstake20(amount)
      setMigrationStatusText('Withdrew from pool, waiting for destination farm approve...')
      toastSuccess(`Unstake`, 'Withdrew from origin farm.')
    } catch (e) {
      toastError(`Approve`, 'ERROR!')
      console.error(e)
    }
  }

  const handleApprove = async () => {
    try {
      if (needsApproval) {
        await onApprove()
      }
      setMigrationStatusText('Destination farm approved, waiting for deposit action...')
      toastSuccess(`Approve`, 'Destination farm pool approved!')
    } catch (e) {
      toastError(`Approve`, 'ERROR!')
      console.error(e)
    }
  }

  const handleStake = async (amount: string) => {
    try {
      await onStake(amount)
      setMigrationStatusText('Deposited in pool.')
      toastSuccess(`Deposit`, 'Deposited in destination farm!')
    } catch (e) {
      toastError(`Approve`, 'ERROR!')
      console.error(e)
    }
  }

  const handleMigratePool = async (amount: string) => {
    await handleApprove20()
    await handleUnstake(amount)
    await handleApprove()
    await handleStake(amount)

    setPoolIsMigrated(true)
  }

  return (
    <Container>
      <Heading>
        <HeadingColor>{name}</HeadingColor>
      </Heading>
      <Text>Amount: {stakedBalance / 10 ** 18}</Text>
      <Text>Status: {migrationStatusText}</Text>
      <MigrateButton
        disabled={pendingTx || poolIsMigrated}
        onClick={async () => {
          setPendingTx(true)
          await handleMigratePool(formattedAmount)
          setPendingTx(false)
        }}
      >
        {!poolIsMigrated ? `Migrate ${name}` : 'Pool is Migrated'}
      </MigrateButton>
    </Container>
  )
}

export default FarmMigratorPool

// Styling
const MigrateButton = styled(Button)`
  max-height: 30px;
  padding: 5px !important;
  border-radius: 5px;
  color: black;
`
const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`
const Container = styled.div`
  margin: 32px 0px;
`
