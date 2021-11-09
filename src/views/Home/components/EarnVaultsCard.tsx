import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Skeleton } from 'uikit'
import max from 'lodash/max'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { usePriceFarmingTokenUsd, useVaults } from 'state/hooks'

const StyledVaultsCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }

  transition: opacity 200ms;
  &:hover {
    opacity: 0.65;
  }
`
const CardMidContent = styled(Heading).attrs({ scale: 'xl' })`
  line-height: 44px;
`
const EarnVaultsCard = () => {
  const { t } = useTranslation()
  const { apys } = useVaults()
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()

  const highestApy = useMemo(() => {
    if (farmingTokenPriceUsd.gt(0)) {
        const maxApy = max(Object.values(apys))
        if (maxApy) {
            return (100 * maxApy).toLocaleString('en-US', { maximumFractionDigits: 2 })
        }
    }
    return null
  }, [farmingTokenPriceUsd, apys])

  const apyText = highestApy || '-'
  const earnAprText = t('Earn up to %highestApy% APY in Vaults', { highestApy: apyText })
  const [earnUpTo, InVaults] = earnAprText.split(apyText)

  return (
    <StyledVaultsCard>
      <NavLink exact activeClassName="active" to="/vaults" id="vault-apr-cta">
        <CardBody>
          <Heading color="contrast" scale="lg">
            {earnUpTo}
          </Heading>
          <CardMidContent color="#7645d9">
            {highestApy ? (
              `${highestApy}%`
            ) : (
              <Skeleton animation="pulse" variant="rect" height="44px" />
            )}
          </CardMidContent>
          <Flex justifyContent="space-between">
            <Heading color="contrast" scale="lg">
              {InVaults}
            </Heading>
            <ArrowForwardIcon mt={30} color="primary" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledVaultsCard>
  )
}

export default EarnVaultsCard
