import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, IconButton, MinusIcon, useModal } from 'uikit'
import { BigNumber } from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useStarVaultApprove } from 'hooks/useApprove'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useVaultWithdraw from 'hooks/useVaultWithdraw'
import { useAppDispatch } from 'state'
import { fetchVaultAllowances, fetchVaultBalances } from 'state/vaults'
import { Vault } from 'state/types'
import { ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'
import WithdrawModal from '../WithdrawModal'

const IconButtonWrapper = styled.div`
  margin-left: 16px;
  display: flex;
`
const ActionContainer = styled.div`
  background-color: rgba(13, 29, 54, 0.6);
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 8px;
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  margin: 20px 0;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 270px;
  }
`

interface WithdrawActionProps {
  vault: Vault
  price: BigNumber
  amountDeposited: BigNumber
  walletBalance: BigNumber
  allowance?: BigNumber
}

const WithdrawAction: React.FunctionComponent<WithdrawActionProps> = (props) => {
  const { vault, price: priceNum, amountDeposited, walletBalance, allowance } = props
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onVaultWithdraw } = useVaultWithdraw(vault.earnContractAddress)

  const price = new BigNumber(priceNum)
  const stakedBalance = new BigNumber(walletBalance)
  const isApproved = account && allowance?.isGreaterThan(0)

  const dispatch = useAppDispatch()

  const handleWithdraw = async (amount: BigNumber, isMax: boolean) => {
    await onVaultWithdraw(amount.dividedBy(vault.pricePerFullShare), isMax)
    dispatch(fetchVaultBalances(account))
  }

  const displayDepositedAmount = () => {
    const depositedBalanceBigNumber = getBalanceAmount(amountDeposited)
    if (depositedBalanceBigNumber.gt(0) && depositedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return depositedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={amountDeposited} onConfirm={handleWithdraw} tokenName={vault.token} />,
  )
  const onApprove = useStarVaultApprove(vault.tokenAddress, vault.earnedTokenAddress)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchVaultAllowances(account))

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [account, dispatch, onApprove])

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Connect wallet').toUpperCase()}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isApproved) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{t('Withdraw').toUpperCase()}</Subtle>
          <Title>{vault.name} </Title>
        </ActionTitles>
        <ActionContent>
          <div>
            <Earned>{displayDepositedAmount()}</Earned>
            {amountDeposited.isGreaterThan(0) && price.isGreaterThan(0) && (
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={getBalanceNumber(price.times(amountDeposited))}
                unit=" USD"
                prefix="~"
              />
            )}
          </div>
          <IconButtonWrapper>
            <IconButton disabled={amountDeposited.eq(0)} variant="secondary" onClick={onPresentWithdraw}>
              <MinusIcon color="primary" width="14px" />
            </IconButton>
          </IconButtonWrapper>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{t('Enable Vault To Withdraw').toUpperCase()}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default WithdrawAction
