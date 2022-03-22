import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit'
import { BigNumber } from 'bignumber.js'
import getNetwork from 'utils/getNetwork'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useFarmingTokenContract } from 'hooks/useContract'
import { useSousUnstake20 } from 'hooks/useUnstake'
import { useSousApprove } from 'hooks/useApprove'
import { useSousStake } from 'hooks/useStake'

const FarmMigratorActionXjump = ({ pid, stakedBalance }) => {
  const [pendingTx, setPendingTx] = useState<boolean>(false)
  const [migrationStatusText, setMigrationStatusText] = useState<string>('Not Migrated')
  const [poolIsMigrated, setPoolIsMigrated] = useState<boolean>(false)
  const { config } = getNetwork()

  const farmingTokenContract = useFarmingTokenContract()
  const xJumpPool21 = config.wrappedFarmingTokenPid // current pids, both should be 0 in farm 2.1.... NOT

  const { onSousUnstake } = useSousUnstake20(pid, false)
  const { handleApprove: onApprove } = useSousApprove(farmingTokenContract, config.wrappedFarmingTokenPid, 'JUMP')
  const { onStake } = useSousStake(xJumpPool21, false)

  //  useUnstake is passed decimal numbers from the farm so we need to convert first
  const formattedAmount = new BigNumber(stakedBalance).dividedBy(DEFAULT_TOKEN_DECIMAL).toString()

  const handleUnstake = async (amount: string) => {
    try {
      await onSousUnstake(amount, 18)
      setMigrationStatusText('Unstaked.')
    } catch (e) {
      console.error(e)
    }
  }

  const handleApprove = async () => {
    try {
      await onApprove()
      setMigrationStatusText('Approved pool.')
    } catch (e) {
      console.error(e)
    }
  }

  const handleStake = async (amount: string) => {
    try {
      await onStake(amount, 18)
      setMigrationStatusText('Deposited.')
    } catch (e) {
      console.error(e)
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
