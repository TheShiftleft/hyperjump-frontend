import React from 'react'
import { Flex, Skeleton, FlexProps, useMatchBreakpoints } from 'uikit'
import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'

interface ApyProps extends FlexProps {
  apy: BigNumber
}

const Apy: React.FC<ApyProps> = ({ apy }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const fontSize = isXs || isSm ? '12px' : '16px'
  return (
    <Flex alignItems="center" justifyContent="space-between">
      {apy ? (
        <>
          <Flex>
            <Balance fontSize={fontSize} value={apy.multipliedBy(100).toNumber()} decimals={2} bold unit="%" />
          </Flex>
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apy
