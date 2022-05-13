import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Network } from '@hyperjump-defi/sdk'
import { CSSTransition } from 'react-transition-group'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import getNetwork from 'utils/getNetwork'
import { useWalletModal } from '../WalletModal'
import { Login } from '../WalletModal/types'
import CardValue from './components/CardValue'
import AlloyIcon from './assets/AlloyIcon.png'
import JumpIcon from './assets/JumpIcon.png'
import OriIcon from './assets/OrilliumIcon.png'
import dropdownArrow from './assets/DropdownArrow.png'

const farmingTokenIcon: Record<Network, any> = {
  [Network.BSC]: JumpIcon,
  [Network.BSC_TESTNET]: JumpIcon,
  [Network.FANTOM]: JumpIcon,
  [Network.METIS]: JumpIcon,
}

interface Props {
  account?: string
  login: Login
  logout: () => void
  farmingTokenBalance: string
  farmingTokenPriceUsd: string
  farmingTokenBalanceUsd: string
  pendingHarvest: string
  farmingTokenSupply: number
  farmingTokenBurned: number
  govTokenPrice: string
  govTokenBurnRate: number
}

const TopBarOptions: React.FC<Props> = ({
  account,
  login,
  logout,
  farmingTokenBalance,
  farmingTokenPriceUsd,
  farmingTokenBalanceUsd,
  pendingHarvest,
  farmingTokenSupply,
  farmingTokenBurned,
  govTokenPrice,
  govTokenBurnRate,
}) => {
  const dropdownRef = useRef(null)
  const dropdownButtonRef = useRef(null)
  const [dropdownOpened, setDropdownOpened] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const { config } = getNetwork()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownButtonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setDropdownOpened(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef, dropdownButtonRef])
  const { onPresentConnectModal } = useWalletModal(login, logout, account)

  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))
  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledAccountButtonWrapper>
      <StyledLogo src={farmingTokenIcon[config.network]} />
      <StyledPriceContainer>
        <StyledText>{account ? farmingTokenBalance : '🔒️ Locked'}</StyledText>
        <StyledFarmingTokenBalanceText>{`($ ${farmingTokenBalanceUsd})`}</StyledFarmingTokenBalanceText>
      </StyledPriceContainer>
      <StyledOptions>
        <StyledTextContainer>
          <StyledText>{`Price: $${farmingTokenPriceUsd}`}</StyledText>
        </StyledTextContainer>
        <StyledOpenDropdownButton ref={dropdownButtonRef} onClick={() => setDropdownOpened(!dropdownOpened)}>
          <StyledDropdownArrow src={dropdownArrow} active={dropdownOpened} />
        </StyledOpenDropdownButton>
        <CSSTransition in={dropdownOpened} timeout={200} classNames="top-bar-dropdown">
          <StyledDropdown ref={dropdownRef}>
            <StyledDropdownText>Pending Collect</StyledDropdownText>
            <StyledDropdownText2>
              {account ? `${pendingHarvest} ${config.farmingToken.symbol}` : '🔒️ Locked'}
            </StyledDropdownText2>
            <StyledDropdownText>{`Total ${config.farmingToken.symbol} Supply`}</StyledDropdownText>
            <CardValue value={farmingTokenSupply} />
            <StyledDropdownText>{`${config.farmingToken.symbol} Burned`}</StyledDropdownText>
            <CardValue value={farmingTokenBurned} />
            <StyledDropdownText>{`${config.govToken.symbol} Price`}</StyledDropdownText>
            <StyledDropdownText2>{`$ ${govTokenPrice}`}</StyledDropdownText2>
            <StyledDropdownText>{`${config.govToken.symbol} Burn Rate`}</StyledDropdownText>
            <CardValue value={govTokenBurnRate} decimals={2} addOn="%" />
            {!account && (
              <StyledAccountButton onClick={() => onPresentConnectModal()}>
                <StyledAccountText>🔓 Unlock Wallet</StyledAccountText>
              </StyledAccountButton>
            )}
            <StyledAccountButton disabled={balancesWithValue.length <= 0 || pendingTx} onClick={harvestAllFarms}>
              <StyledAccountText>
                {pendingTx ? `Collecting ${config.farmingToken.symbol}` : `Collect all (${balancesWithValue.length})`}
              </StyledAccountText>
            </StyledAccountButton>
          </StyledDropdown>
        </CSSTransition>
      </StyledOptions>
    </StyledAccountButtonWrapper>
  )
}

const StyledLogo = styled.img`
  height: 24px;
  width: 24px;
  margin-right: 4px;
`

const StyledPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 545px) {
    max-width: 50px;
  }
`

const StyledFarmingTokenBalanceText = styled.p`
  font-family: Roboto;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  margin: 0;

  @media (max-width: 545px) {
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const StyledDropdownArrow = styled.img`
  transform: ${(props: { active: boolean }) => (props.active ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.5s ease;
`

const StyledText = styled.p`
  font-family: Roboto;
  margin: 0;
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 545px) {
    font-size: 10px;
  }
`

const StyledAccountButton = styled.button`
  border-radius: 15px;
  cursor: pointer;
  border: none;
  padding: 6px 12px;
  width: 118px;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  &:first-child {
    margin-bottom: 26px;
  }
  &:disabled,
  &.button--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const StyledAccountText = styled.p`
  font-family: Roboto;
  font-size: 12px;
  margin: 0;
  color: #fff;
`

const StyledTextContainer = styled.div`
  margin: auto;

  @media (max-width: 545px) {
    margin-left: 10px;
  }
`

const StyledOptions = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 150px;
  height: 33px;
  border-radius: 64px;
  border: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  margin-left: 6px;
  margin-right: 10px;
  padding: 2px;

  @media (max-width: 545px) {
    width: 80px;
    margin-left: 6px;
    margin-right: 5px;
  }
`

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: 148px;
  top: 48px;
  right: 20px;
  padding-top: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  transition: opacity 0.3s;
  visibility: hidden;
  opacity: 0;
  z-index: 999;
  &.top-bar-dropdown-enter {
    opacity: 0;
    visibility: visible;
  }
  &.top-bar-dropdown-enter-active {
    opacity: 1;
    visibility: visible;
  }
  &.top-bar-dropdown-enter-done {
    opacity: 1;
    visibility: visible;
  }
  &.top-bar-dropdown-exit {
    opacity: 1;
    visibility: hidden;
  }
  &.top-bar-dropdown-exit-active {
    opacity: 0;
    visibility: hidden;
  }
  &.top-bar-dropdown-exit-done {
    opacity: 0;
    visibility: hidden;
  }
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 20px 0;

  @media (max-width: 545px) {
    right: -30px;
  }
`

const StyledDropdownText = styled.p`
  font-family: Roboto;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  margin: 0;
`

const StyledDropdownText2 = styled.p`
  font-family: Roboto;
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  margin: 0 0 20px;
`

const StyledOpenDropdownButton = styled.button`
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 545px) {
    width: 31px;
  }
`

const StyledAccountButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 400px) {
    justify-content: center;
    width: auto;
    flex-wrap: wrap-reverse;
  }
`

export default TopBarOptions
