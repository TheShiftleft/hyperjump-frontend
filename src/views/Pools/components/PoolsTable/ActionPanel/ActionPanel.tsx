import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Box, Button, Flex, Link, LinkExternal, MetamaskIcon, Skeleton, Text, TimerIcon } from 'uikit'
import { BASE_INFO_URL, NETWORK_URL } from 'config'
import { getScannerBlockCountdownUrl } from 'utils/bscscan'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import { getAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBalanceNumber } from 'utils/formatBalance'
import { Network } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import usePoolTimingInfo from 'hooks/usePoolTimingInfo'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../Apr'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 100ms linear forwards
        `
      : css`
          ${collapseAnimation} 100ms linear forwards
        `};
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div`
  background-color: rgba(13, 29, 54, 0.6);

  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
}

interface ActionPanelProps {
  account: string
  pool: Pool
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  background-color: rgba(13, 29, 54, 0.6);
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 16px;
  margin-top: 10px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 0;
    margin-right: 12px;
    padding: 16px;
    flex-basis: 230px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, userDataLoaded, expanded, breakpoints }) => {
  const { sousId, stakingToken, earningToken, totalStaked, endBlock } = pool

  const { config } = getNetwork()
  const { isXs, isSm, isMd } = breakpoints
  const isMechPool = sousId === 0

  const { shouldShowCountdown, untilStart, remaining, hasPoolStarted, toDisplay } = usePoolTimingInfo(pool)

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask
  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const imageSrc = `${NETWORK_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`

  const getTotalStakedBalance = () => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const blocksRow =
    remaining || untilStart ? (
      <Flex mb="8px" justifyContent="space-between">
        <Text color="primary">{hasPoolStarted ? 'Ends in' : 'Starts in'}:</Text>
        <Flex>
          <Balance fontSize="16px" value={toDisplay / 60} decimals={0} color="white" />
          <Text ml="4px" color="primary" textTransform="lowercase">
            Minutes
          </Text>
          {config.network === Network.BSC && (
            <Link external href={getScannerBlockCountdownUrl(endBlock)}>
              <TimerIcon ml="4px" color="primary" />
            </Link>
          )}
        </Flex>
      </Flex>
    ) : (
      <Skeleton width="56px" height="16px" />
    )

  const aprRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text>APR</Text>
      <Apr pool={pool} showIcon performanceFee={0} />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text maxWidth={['50px', '100%']}>Total staked</Text>
      <Flex alignItems="center">
        {totalStaked ? (
          <Balance fontSize="16px" value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
      </Flex>
    </Flex>
  )

  return (
    <StyledActionPanel expanded={expanded}>
      {!isMechPool && (
        <InfoSection>
          {(isXs || isSm) && aprRow}
          {(isXs || isSm || isMd) && totalStakedRow}
          {shouldShowCountdown && blocksRow}
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal href={`${BASE_INFO_URL}/token/${getAddress(earningToken.address)}`} bold={false}>
              Info site
            </LinkExternal>
          </Flex>
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal href={earningToken.projectLink} bold={false}>
              Project site
            </LinkExternal>
          </Flex>
          {account && isMetaMaskInScope && tokenAddress && (
            <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
              <Button
                variant="text"
                p="0"
                height="auto"
                onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)}
              >
                <Text color="primary">Add to Metamask</Text>
                <MetamaskIcon ml="4px" />
              </Button>
            </Flex>
          )}
        </InfoSection>
      )}
      <ActionContainer>
        {!isMechPool && <Stake pool={pool} userDataLoaded={userDataLoaded} />}
        <Harvest {...pool} userDataLoaded={userDataLoaded} />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
