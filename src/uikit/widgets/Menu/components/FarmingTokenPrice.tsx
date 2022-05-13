import React from 'react'
import styled from 'styled-components'
import Text from '../../../components/Text/Text'
import Skeleton from '../../../components/Skeleton/Skeleton'

interface Props {
  farmingTokenPriceUsd?: number
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`

const FarmingTokenPrice: React.FC<Props> = ({ farmingTokenPriceUsd = 2 }) => {
  return farmingTokenPriceUsd ? (
    <PriceLink>
      <img src="/jump.png" alt="Hyperjump Icon" width="24px" style={{ marginRight: '8px' }} />
      <Text color="textSubtle" bold>{`$${farmingTokenPriceUsd.toFixed(4)}`}</Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  )
}

export default React.memo(FarmingTokenPrice)
