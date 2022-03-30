import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetBscStats, useGetFtmStats } from 'hooks/api'

const StyledTotalValueLockedCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  align-items: center;
  display: flex;

  &::after {
    content: '';
    background-image: url('/images/dashboard/treasure.png');
    background-repeat: no-repeat;
    background-size: 120px 120px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right 20px bottom 15px;
    position: absolute;
    z-index: -1;
  }
`

const CrossChainTVLCard = () => {
  const { t } = useTranslation()
  const bscTvlData = useGetBscStats()
  const crossTvl = bscTvlData ? bscTvlData.tvl : 'Available soon!'
  const crossTvlString = crossTvl ? crossTvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'Loading...'
  return (
    <StyledTotalValueLockedCard>
      <CardBody style={{ width: '100%' }}>
        <Text color="primary">{t('Cross Chain TVL')}</Text>
        <Heading scale="xl">$ {crossTvlString}</Heading>
        <Text color="primary">Across all Farms, Pools, and Vaults</Text>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default CrossChainTVLCard
