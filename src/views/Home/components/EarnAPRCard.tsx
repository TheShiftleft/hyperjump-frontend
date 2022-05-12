import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, Skeleton, Text } from 'uikit'
import max from 'lodash/max'
import { NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { useFarms, usePriceFarmingTokenUsd } from 'state/hooks'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import { State } from 'state/types'
import { useSelector } from 'react-redux'

const StyledFarmStakingCard = styled(Card)`
  flex: 1;
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  height: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }

  &::after {
    content: '';
    background-image: url('jump.png');
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right -120px bottom 50px;
    position: absolute;
    z-index: -1;
  }
`

const AssetCardBody = styled(CardBody)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 12px 0 24px;
`

const ArrowIcon = styled.img`
  width: 50px;
`

// TODO DJ TJ - this all seems to fetch much more than is needed
const EarnAPRCard = () => {
  const [isFetchingFarmData, setIsFetchingFarmData] = useState(true)
  const { data: farmsLP } = useFarms()
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const dispatch = useAppDispatch()
  const farmsConfig = useSelector((state: State) => state.farms[state.application.chainId].data)

  // Fetch farm data once to get the max APR
  useEffect(() => {
    let isMounted = true
    const fetchFarmData = async () => {
      try {
        const pids = farmsConfig.filter((farmConfig) => farmConfig.pid !== null).map((farmToFetch) => farmToFetch.pid)
        await dispatch(fetchFarmsPublicDataAsync(pids))
      } finally {
        if (isMounted) {
          setIsFetchingFarmData(false)
        }
      }
    }

    fetchFarmData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      isMounted = false
    }
  }, [dispatch, setIsFetchingFarmData, farmsConfig])

  const highestApr = useMemo(() => {
    if (farmingTokenPriceUsd.gt(0)) {
      const aprs = farmsLP.map((farm) => {
        // Filter inactive farms, because their theoretical APR is super high. In practice, it's 0.
        if (farm.pid !== 0 && farm.multiplier !== '0X' && farm.lpTotalInQuoteToken && farm.quoteToken.busdPrice) {
          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
          return getFarmApr(new BigNumber(farm.poolWeight), farmingTokenPriceUsd, totalLiquidity)
        }
        return null
      })

      const maxApr = max(aprs)
      return maxApr?.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }, [farmingTokenPriceUsd, farmsLP])

  const aprText = highestApr || '-'
  const earnAprText = `EARN ${aprText} In Asteroid Field Farms`
  const [earnUpTo, InFarms] = earnAprText.split(aprText)

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/farms" id="farm-apr-cta">
        <AssetCardBody>
          <Heading color="primary" scale="lg">
            {earnUpTo}
          </Heading>

          <Heading>
            {highestApr && !isFetchingFarmData ? (
              `UP TO ${highestApr}% APR`
            ) : (
              <Skeleton animation="pulse" variant="rect" height="44px" />
            )}
          </Heading>
          <Flex justifyContent="space-between" marginTop="auto">
            <Text color="primary">{InFarms}</Text>
          </Flex>
          <Flex mt="-15px" ml="auto" alignItems="center">
            <Text>EARN</Text>
            <ArrowIcon src="images/dashboard/arrow.png" />
          </Flex>
        </AssetCardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default EarnAPRCard
