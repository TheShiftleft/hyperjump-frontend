import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const StyledButton = styled(Button)`
  width: 90px;
  height: 50px;
  border-radius: 20px;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StyledButton
        disabled={rawEarningsBalance.eq(0) || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))

          setPendingTx(false)
        }}
      >
        {t('Collect')}
      </StyledButton>
    </Flex>
  )
}

export default HarvestAction
