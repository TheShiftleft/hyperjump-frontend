import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { AddIcon, Button, IconButton, useModal } from 'uikit'
import { useLocation } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useStarVaultApprove } from 'hooks/useApprove'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useVaultDeposit from 'hooks/useVaultDeposit'
import { useAppDispatch } from 'state'
import { fetchVaultAllowances, fetchVaultBalances } from 'state/vaults'
import { Vault } from 'state/types'
import { ActionTitles, ActionContent, Earned, Title, Subtle } from './styles'
import DepositModal from '../DepositModal'

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
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 270px;
  }
`

interface DepositActionProps {
  vault: Vault
  price: BigNumber
  amountDeposited: BigNumber
  walletBalance: BigNumber
  allowance?: BigNumber
}

const DepositAction: React.FunctionComponent<DepositActionProps> = (props) => {
  const { vault, price: priceNum, walletBalance, allowance } = props
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onVaultDeposit } = useVaultDeposit(vault.earnContractAddress)
  const location = useLocation()

  const price = new BigNumber(priceNum)
  const stakedBalance = new BigNumber(walletBalance)
  const isApproved = account && allowance?.isGreaterThan(0)

  const dispatch = useAppDispatch()

  const handleDeposit = async (amount: string, isMax: boolean) => {
    await onVaultDeposit(amount, isMax)
    dispatch(fetchVaultBalances(account))
  }

  const displayWalletBalanceAmount = () => {
    const walletBalanceBigNumber = getBalanceAmount(walletBalance)
    if (walletBalanceBigNumber.gt(0) && walletBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return walletBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakedBalance}
      onConfirm={handleDeposit}
      tokenName={vault.token}
      addLiquidityUrl={vault.addLiquidityUrl}
    />,
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
          <Subtle>{t('Deposit').toUpperCase()}</Subtle>
          <Title>{vault.name} </Title>
        </ActionTitles>
        <ActionContent>
          <div>
            <Earned>{displayWalletBalanceAmount()}</Earned>
            {walletBalance.isGreaterThan(0) && price.isGreaterThan(0) && (
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                value={getBalanceNumber(price.times(walletBalance))}
                unit=" USD"
                prefix="~"
              />
            )}
          </div>
          <IconButtonWrapper>
            <IconButton
              variant="secondary"
              onClick={onPresentDeposit}
              disabled={walletBalance.eq(0) || ['history', 'archived'].some((item) => location.pathname.includes(item))}
            >
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </IconButtonWrapper>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{t('Enable Vault To Deposit').toUpperCase()}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default DepositAction
