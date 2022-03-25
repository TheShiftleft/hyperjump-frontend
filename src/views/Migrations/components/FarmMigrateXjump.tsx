import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit'
import { BigNumber } from 'bignumber.js'
import getNetwork from 'utils/getNetwork'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useGeneralMigratorAllowance from 'hooks/useGeneralMigratorAllowance'
import { useFarmingTokenContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useSousUnstake20 } from 'hooks/useUnstake'
import { useSousApprove } from 'hooks/useApprove'
import { useSousStake } from 'hooks/useStake'

const FarmMigratorActionXjump = ({ pid, stakedBalance }) => {
  const [pendingTx, setPendingTx] = useState<boolean>(false)
  const [migrationStatusText, setMigrationStatusText] = useState<string>('Not Migrated')
  const [poolIsMigrated, setPoolIsMigrated] = useState<boolean>(false)
  const { config, chainId } = getNetwork()

  const farmingTokenContract = useFarmingTokenContract()
  const xJumpPool21 = config.wrappedFarmingTokenPid // current pids
  const xJumpAddress = config.wrappedFarmingToken.address[chainId]

  const allowance = useGeneralMigratorAllowance(farmingTokenContract, xJumpAddress)
  const needsApproval = !allowance?.gt(stakedBalance)

  const { onSousUnstake } = useSousUnstake20(pid, false)
  const { handleApprove: onApprove } = useSousApprove(farmingTokenContract, config.wrappedFarmingTokenPid, 'JUMP')
  const { onStake } = useSousStake(xJumpPool21, false)
  const { toastSuccess, toastError } = useToast()

  //  useUnstake is passed decimal numbers from the farm so we need to convert first
  const formattedAmount = new BigNumber(stakedBalance).dividedBy(DEFAULT_TOKEN_DECIMAL).toString()

  const handleUnstake = async (amount: string) => {
    try {
      await onSousUnstake(amount, 18) // 18 is decimals
      setMigrationStatusText('Unstaked from origin pool.')
      toastSuccess(`Unstake`, 'Withdrew from origin farm.')
    } catch (e) {
      console.error(e)
      toastError(`Unstake`, 'ERROR!')
    }
  }

  const handleApprove = async () => {
    if (needsApproval) {
      try {
        await onApprove()
        setMigrationStatusText('Approved destination pool.')
        toastSuccess(`Approve`, 'Destination pool is approved!')
      } catch (e) {
        console.error(e)
        toastError(`Approve`, 'ERROR!')
      }
    }
  }

  const handleStake = async (amount: string) => {
    try {
      await onStake(amount, 18) // 18 decimals
      setMigrationStatusText('Deposited in destination pool.')
      toastSuccess(`Deposit`, 'Deposited in destination farm!')
    } catch (e) {
      console.error(e)
      toastError(`Stake`, 'ERROR!')
    }
  }

  const handleMigratePool = async (amount: string) => {
    await handleUnstake(amount)
    await handleApprove()
    await handleStake(amount)

    setPoolIsMigrated(true)
  }

  return (
    <Container>
      <Heading>
        <HeadingColor>JUMP STAKING POOL</HeadingColor>
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
        {!poolIsMigrated ? 'Migrate JUMP' : 'JUMP is Migrated'}
      </MigrateButton>
    </Container>
  )
}

export default FarmMigratorActionXjump

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
