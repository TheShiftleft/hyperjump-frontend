import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { provider as ProviderType } from 'web3-core'
import BigNumber from 'bignumber.js'
import { Button, Text } from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { Farm } from 'state/types'
import useWeb3 from 'hooks/useWeb3'
import { useApprove } from 'hooks/useApprove'
import UnlockButton from 'components/UnlockButton'
import StakeAction from './StakeAction'

const Action = styled.div``
const StyledButton = styled(Button)`
  border-radius: 20px;
`
const StyledUnlockButton = styled(UnlockButton)`
  border-radius: 20px;
`

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  provider?: ProviderType
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const web3 = useWeb3()
  const dispatch = useAppDispatch()

  const lpContract = getBep20Contract(lpAddress, web3)

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Action className="stake-widget">
        <StyledButton fullWidth disabled={requestedApproval} onClick={handleApprove}>
          Approve Contract
        </StyledButton>
      </Action>
    )
  }

  return (
    <>
      {!account ? (
        <Action className="stake-widget">
          <StyledUnlockButton fullWidth />
        </Action>
      ) : (
        renderApprovalOrStakeButton()
      )}
    </>
  )
}

export default CardActions
