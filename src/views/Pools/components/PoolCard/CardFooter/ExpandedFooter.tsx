import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  LinkExternal,
  TimerIcon,
  Skeleton,
  Button,
} from 'uikit'
import { SCANNER_URL, NETWORK_URL } from 'config'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'
import usePoolTimingInfo from 'hooks/usePoolTimingInfo'

interface ExpandedFooterProps {
  pool: Pool
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()

  const { stakingToken, earningToken, totalStaked, contractAddress } = pool

  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const poolContractAddress = getAddress(contractAddress)
  const imageSrc = `${NETWORK_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const { shouldShowCountdown, untilStart, remaining, hasPoolStarted, toDisplay } =
    usePoolTimingInfo(pool)

  const getTotalStakedBalance = () => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance fontSize="14px" value={getTotalStakedBalance()} />
              <Text ml="4px" fontSize="14px">
                {stakingToken.symbol}
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {shouldShowCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('End') : t('Start')}:</Text>
          <Flex alignItems="center">
            {remaining || untilStart ? (
              <Balance color="primary" fontSize="14px" value={toDisplay} decimals={0} />
            ) : (
              <Skeleton width="54px" height="21px" />
            )}
            <Text ml="4px" color="primary" small textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} small href={earningToken.projectLink}>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            small
            href={`${SCANNER_URL}/address/${poolContractAddress}`}
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)}
          >
            <Text color="primary" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
