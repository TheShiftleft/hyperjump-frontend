import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import Overlay from 'uikit/components/Overlay/Overlay'
import Flex from 'uikit/components/Box/Flex'
import { useMatchBreakpoints } from 'uikit/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFarmingTokenUsd, usePriceGovTokenUsd } from 'state/hooks'
import useTokenBalance, { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import useAllEarnings from 'hooks/useAllEarnings'
import BigNumber from 'bignumber.js'
import Logo from 'uikit/widgets/Menu/components/Logo'
import HorizontalPanel from 'uikit/widgets/Menu/components/HorizontalPanel'
import UserBlock from 'uikit/widgets/Menu/components/UserBlock'
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from 'uikit/widgets/Menu/config'
import TopBarOptions from 'uikit/widgets/Menu/TopBarOptions'
import NetworkBlock from 'uikit/widgets/Menu/NetworkBlock'
import useGovTokenBurnRate from 'hooks/useGovTokenBurnRate'
import config from './config'

interface MenuProps {
  children: any
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  height: 10%;
  z-index: 20;

  top: ${({ showMenu }) => (showMenu ? 0 : `-${MENU_HEIGHT}px`)};
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  padding-right: 16px;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  flex-wrap: wrap;
  background-color: transparent;
  border: none;
  transform: translate3d(0, 0, 0);

  @media (max-width: 545px) {
    padding: 0 4px;
  }
`

const BodyWrapper = styled.div`
  top: ${MENU_HEIGHT}px;
  position: fixed;
  height: calc(100% - ${MENU_HEIGHT}px);
  width: 100%;
  display: flex;
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  padding-bottom: 0;
  overflow-y: scroll;

  ${({ theme }) => theme.mediaQueries.sm} {
    ::-webkit-scrollbar {
      width: 9px;
      background: !transparent;
    }
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    //margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    //max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
  }
`

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const HorizontalMenu: React.FC<MenuProps> = ({ children }) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const links = config(t)

  const { isXl } = useMatchBreakpoints()
  const isMobile = isXl === false
  const [isPushed, setIsPushed] = useState(!isMobile)
  const [showMenu] = useState(true)
  const [hideMenuButton] = useState(true)

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')
  const farmingTokenBalance = useTokenBalance(getFarmingTokenAddress())
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getFarmingTokenAddress())
  const farmingTokenSupply = totalSupply ? getBalanceNumber(totalSupply.minus(burnedBalance)) : 0

  const govTokenPriceUsd = usePriceGovTokenUsd()
  const govTokenBurnRate = useGovTokenBurnRate()

  const govTokenPriceString =
    govTokenPriceUsd.isNaN() || govTokenPriceUsd.isZero()
      ? 'Loading'
      : govTokenPriceUsd.toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 })
  const farmingTokenPriceUsdString =
    farmingTokenPriceUsd.isNaN() || farmingTokenPriceUsd.isZero()
      ? 'Loading...'
      : farmingTokenPriceUsd.toNumber().toLocaleString(undefined, { maximumFractionDigits: 4 })
  const farmingTokenBalanceString = farmingTokenBalance.balance.isNaN()
    ? 'Loading...'
    : getBalanceNumber(farmingTokenBalance.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })
  const farmingTokenBalanceUsdString =
    farmingTokenPriceUsd.isNaN() || farmingTokenPriceUsd.isZero()
      ? 'Loading...'
      : (getBalanceNumber(farmingTokenBalance.balance) * farmingTokenPriceUsd.toNumber()).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })
  return (
    <Wrapper>
      <StyledNav showMenu={showMenu}>
        <Logo
          isPushed={isPushed}
          togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
          isDark={isDark}
          href={homeLink?.href ?? '/'}
          hideMenuButton={hideMenuButton} // enable when using horizontal menu
        />
        <HorizontalPanel
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={languageList}
          setLang={setLanguage}
          currentLang={currentLanguage.code}
          farmingTokenPriceUsd={farmingTokenPriceUsd.toNumber()}
          pushNav={setIsPushed}
          links={links}
        />
        <Flex flexWrap="wrap">
          {/*  <TopBarOptions
            account={account}
            login={login}
            logout={logout}
            farmingTokenBalance={farmingTokenBalanceString}
            farmingTokenPriceUsd={farmingTokenPriceUsdString}
            farmingTokenBalanceUsd={farmingTokenBalanceUsdString}
            pendingHarvest={earningsSum.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            farmingTokenSupply={farmingTokenSupply}
            farmingTokenBurned={getBalanceNumber(burnedBalance)}
            govTokenPrice={govTokenPriceString}
            govTokenBurnRate={getBalanceNumber(govTokenBurnRate, 18)}
          /> */}
          <NetworkBlock />
          <UserBlock account={account} login={login} logout={logout} />
        </Flex>
      </StyledNav>
      <BodyWrapper>
        
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
    </Wrapper>
  )
}

export default HorizontalMenu
