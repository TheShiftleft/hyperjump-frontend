import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text, Skeleton } from 'uikit'
import { Farm } from 'state/types'
import { provider as ProviderType } from 'web3-core'
import { BASE_ADD_LIQUIDITY_URL, BASE_INFO_PAIR_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import getNetwork from 'utils/getNetwork'
import { StyledInternalLink } from 'components/Shared'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import EarningSection from './EarningSection'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  liquidity?: BigNumber
}

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  farmingTokenPriceUsd?: BigNumber
  provider?: ProviderType
  account?: string
}

const FCard = styled.div`
  border: 2px solid ${(props) => props.theme.colors.primary};
  align-self: baseline;
  background-size: cover;
  border-radius: 40px;
  background-color: rgba(13, 29, 54, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 32px;
  position: relative;
  text-align: center;
  backdrop-filter: blur(2px);
`

const StyledInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(13, 29, 54, 0.8);
  border-radius: 20px;
  padding: 12px;
  align-items: center;
  min-width: 162px;
  border: 1px solid ${(props) => props.theme.colors.primary};
`

const Container = styled.div`
  width: 100%;
`

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, farmingTokenPriceUsd, account }) => {
  const { config } = getNetwork()

  // We assume the token name is coin pair + lp e.g. ALLOY-BNB LP, LINK-BNB LP,
  // NAR-ALLOY LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const earnLabel = farm.dual ? farm.dual.earnLabel : config.farmingToken.symbol

  const farmAPR = farm.apr && farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]

  return (
    <FCard>
      <CardHeading
        lpLabel={farm.lpSymbol.toUpperCase()}
        multiplier={farm.multiplier}
        isCommunityFarm={false}
        farmImage={farmImage}
        tokenSymbol={farm.token.symbol}
        addLiquidityUrl={addLiquidityUrl}
        pairExchangeInfo={`${BASE_INFO_PAIR_URL}/${lpAddress}`}
        earnLabel={earnLabel}
      />
      <StyledInfoCard>
        <Container>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" color="primary" bold>
              Deposit:
            </Text>
            <Text fontSize="12px" bold>
              {farm.lpSymbol.toUpperCase()}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" color="primary" bold>
              Earns:
            </Text>
            <Text fontSize="12px" bold>
              {earnLabel}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" color="primary" bold>
              Multiplier:
            </Text>
            <Text fontSize="12px" bold>
              {farm.multiplier}
            </Text>
          </Flex>
          {!removed && (
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="12px" color="primary" bold>
                APR:
              </Text>
              <Text fontSize="12px" style={{ display: 'flex', alignItems: 'center' }} bold>
                {farm.apr ? (
                  <>
                    <ApyButton
                      lpLabel={farm.lpSymbol.toUpperCase()}
                      addLiquidityUrl={addLiquidityUrl}
                      farmingTokenPriceUsd={farmingTokenPriceUsd}
                      apr={farm.apr}
                    />
                    {farmAPR}%
                  </>
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </Flex>
          )}
          <CardActionsContainer farm={farm} account={account} addLiquidityUrl={addLiquidityUrl} />
        </Container>
      </StyledInfoCard>
      <EarningSection farm={farm} viewMode="card" />
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center" mt="12px">
          <Text color="primary" fontSize="12px" bold>
            Total Value Locked:
          </Text>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text fontSize="12px" bold>
              {`${totalValueFormatted} USD`}
            </Text>
          </Flex>
        </Flex>
        <Container style={{ marginTop: '8px' }}>
          <StyledInternalLink to={addLiquidityUrl}>{`Get ${farm.lpSymbol.toUpperCase()}`}</StyledInternalLink>
        </Container>
      </Flex>
    </FCard>
  )
}

export default FarmCard
