import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Button, Text, Flex, Skeleton, useMatchBreakpoints } from 'uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'

import useToast from 'hooks/useToast'
import { useSousStake } from 'hooks/useStake'
import { useSousHarvest } from 'hooks/useHarvest'
import { ActionContainer, ActionTitles, ActionContent, ActionButton } from './styles'

interface HarvestActionProps extends Pool {
  userDataLoaded: boolean
}

const HarvestContainer = styled(ActionContainer)<{ column: boolean }>`
  flex-direction: row;
  ${(props) =>
    props.column &&
    css`
      flex-direction: column;
    `}
`

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  earningToken,
  userData,
  userDataLoaded,
  earningTokenPrice,
}) => {
  const { account } = useWeb3React()
  const { onStake } = useSousStake(sousId, false)
  const { onReward } = useSousHarvest(sousId, false)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { isXs, isSm, isMd } = useMatchBreakpoints()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = earnings.gt(0)
  const isCompoundPool = sousId === 0
  const displayBalance = hasEarnings ? earningTokenBalance : 0
  const isMobile = isXs || isSm || isMd

  const handleCompound = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess(`${'Collected'}!`, `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setPendingTx(false)
    }
    try {
      await onStake(fullBalance, earningToken.decimals)
      toastSuccess('Compounded!', `Your ${earningToken.symbol} earnings have been assembled into !`)
      setPendingTx(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setPendingTx(false)
    }
  }

  const handleCollect = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess('Collected!', `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      console.error(e)
      let msg = 'Failed to collect earnings!'
      let title = 'Error'
      if(e.code === 4001){
        msg = 'Please try again and confirm the transaction.'
        title = 'Canceled'
      }
      toastError(title, msg)
      setPendingTx(false)
    }
  }
  const actionTitle = (
    <Flex>
      <Text fontSize="24px" mr="8px" bold color="primary" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="24px" bold color="textSubtle" as="span" textTransform="uppercase">
        Earned
      </Text>
    </Flex>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Balance pt="8px" lineHeight="1" bold fontSize="20px" decimals={5} value={0} />
          <Button disabled>{isCompoundPool ? 'Collect' : 'Collect'}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  const direction = isCompoundPool ? 'row' : isMobile ? 'column' : 'row'
  return (
    <HarvestContainer column={isMobile}>
      <Flex flexDirection="column" flexGrow={4}>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignSelf="flex-start">
            <Balance lineHeight="1" bold fontSize="32px" decimals={3} value={displayBalance} />
            {hasEarnings ? (
              <Balance
                display="inline"
                fontSize="12px"
                color={hasEarnings ? 'textSubtle' : 'textDisabled'}
                decimals={2}
                value={earningTokenDollarBalance}
                unit=" USD"
                prefix="~"
              />
            ) : (
              <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                0 USD
              </Text>
            )}
          </Flex>
        </ActionContent>
      </Flex>
      {/* <Flex flexGrow={1} justifyContent="center" alignItems="center" flexDirection={direction}> */}
      <Flex flexGrow={1} justifyContent="center" alignItems="center" flexDirection="column">
        <ActionButton
          className="staked-btn"
          disabled={!hasEarnings}
          isLoading={pendingTx}
          onClick={handleCollect}
          mb={direction === 'column' ? '5px' : ''}
        >
          Collect
        </ActionButton>
        <ActionButton
          className="staked-btn"
          ml={direction === 'column' ? '' : '8px'}
          disabled={!hasEarnings}
          isLoading={pendingTx}
          onClick={handleCompound}
        >
          Compound
        </ActionButton>
      </Flex>
    </HarvestContainer>
  )
}

export default HarvestAction
