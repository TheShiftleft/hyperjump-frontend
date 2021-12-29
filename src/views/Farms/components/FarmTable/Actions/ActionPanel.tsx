import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Link, Text, useMatchBreakpoints, Flex } from 'uikit'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getScannerAddressUrl } from 'utils/bscscan'
import { BASE_ADD_LIQUIDITY_URL, BASE_INFO_PAIR_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
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
  width: 100%;
  flex-direction: column-reverse;
  padding: 0 0 20px 0;
  border-radius: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    padding: 0 0 20px 0;
  }
`

const StyledLinkExternal = styled(Link)`
  font-weight: 400;
`
const TimeContainer = styled.text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-family: 'Oswald';
`

const TimeTitle = styled.text`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 0.9rem;
`
const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(13, 29, 54, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.card};
  margin-top: 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 0;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-right: 16px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`

const InfoContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.6);
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  margin-right: 16px;
  margin-top: 12px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 0;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.6);
  padding: 8px;
  margin-top: 12px;
  border-radius: ${({ theme }) => theme.radii.card};
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
}) => {
  const farm = details

  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const { t } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token, startTime, endTime } = farm
  const lpAddress = getAddress(farm.lpAddresses)
  const bsc = getScannerAddressUrl(lpAddress)
  const info = `${BASE_INFO_PAIR_URL}/${lpAddress}`

  // startTime multiplied by 1000 to convert in to microseconds
  const startDate = new Date(startTime*1000).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  // endTime multiplied by 1000 to convert in to microseconds
  const endDate = new Date(endTime*1000).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  return (
    <Container expanded={expanded}>
      <DetailsContainer>
        <InfoContainer>
          <Flex flexDirection="row" width="100%">
            <Flex flexDirection="column" flex="1">
              {isActive && (
                <StakeContainer>
                  <StyledLinkExternal
                    href={`${BASE_ADD_LIQUIDITY_URL}/${getAddress(quoteToken.address)}/${
                      getAddress(token.address)
                    }`}
                  >
                    {t('Get %symbol%', { symbol: farm.lpSymbol.toUpperCase() })}
                  </StyledLinkExternal>
                </StakeContainer>
              )}
              <StyledLinkExternal href={bsc}>{t('View Contract')}</StyledLinkExternal>
              <StyledLinkExternal href={info}>{t('See Pair Info')}</StyledLinkExternal> 
            </Flex>
            <Flex flexDirection="column" flex="1" justifyContent="space-between">
              <Flex flexDirection="column">
                <TimeTitle >{t('Start time')}</TimeTitle>
                <TimeContainer >{startDate}</TimeContainer>
              </Flex>
              <Flex flexDirection="column">
                <TimeTitle >{t('End time')}</TimeTitle>
                <TimeContainer >{endDate}</TimeContainer>
              </Flex>
            </Flex>
          </Flex>
        </InfoContainer>
        {(isXs || isSm || isMd) && (
          <ValueContainer>
            <ValueWrapper>
              <Text>{t('APR')}</Text>
              <Apr {...apr} />
            </ValueWrapper>
            <ValueWrapper>
              <Text>{t('Multiplier')}</Text>
              <Multiplier {...multiplier} />
            </ValueWrapper>
            <ValueWrapper>
              <Text>{t('Liquidity')}</Text>
              <Liquidity {...liquidity} />
            </ValueWrapper>
          </ValueContainer>
        )}
      </DetailsContainer>
      <ActionContainer>
        <StakedAction {...farm} userDataReady={userDataReady} />
      </ActionContainer>
      <ActionContainer>
        <HarvestAction {...farm} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
