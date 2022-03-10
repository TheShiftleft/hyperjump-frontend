import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import throttle from 'lodash/throttle'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import Overlay from 'uikit/components/Overlay/Overlay'
import Flex from 'uikit/components/Box/Flex'
import { useMatchBreakpoints } from 'uikit/hooks'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import Logo from 'uikit/widgets/Menu/components/Logo'
import FarmingTokenPrice from 'uikit/widgets/Menu/components/FarmingTokenPrice'
import HorizontalPanel from 'uikit/widgets/Menu/components/HorizontalPanel'
import UserBlock from 'uikit/widgets/Menu/components/UserBlock'
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from 'uikit/widgets/Menu/config'
import NetworkBlock from 'uikit/widgets/Menu/NetworkBlock'
import config from './config'

interface MenuProps {
  children: any
}

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

  const [showMenu, setShowMenu] = useState(true)
  const refPrevOffset = useRef(window.pageYOffset)
  const [opacity, setOpacity] = useState(true)

  const [hideMenuButton] = useState(true)

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
      const isTopOfPage = currentOffset === 0
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true)
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current) {
          // Has scroll up
          // setShowMenu(true);
          setOpacity(true)
        } else {
          // Has scroll down
          // setShowMenu(false);
          setOpacity(false)
        }
      }
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu} className={opacity ? 'show s-nav' : 'faded s-nav'}>
        <NavWrapper>
          <Logo
            isPushed={isPushed}
            togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
            isDark={isDark}
            href={homeLink?.href ?? '/'}
            hideMenuButton={hideMenuButton} // enable when using horizontal menu
          />
          {!isMobile && (
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
          )}
        </NavWrapper>
        <Flex flexWrap="wrap">
          <PriceWrapper>
            <FarmingTokenPrice farmingTokenPriceUsd={farmingTokenPriceUsd.toNumber()} />
          </PriceWrapper>
          <NetworkBlock />
          <UserBlock account={account} login={login} logout={logout} />
        </Flex>
      </StyledNav>

      <BodyWrapper>
        {isMobile && (
          <HorizontalPanel // Duplicate of line #153 to cater mobile navigation menu in the footer
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
        )}
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
    </Wrapper>
  )
}

export default HorizontalMenu

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
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
  height: 56px;
  background-color: transparent;
  border: none;
  transform: translate3d(0, 0, 0);

  @media (max-width: 545px) {
    padding: 0 4px;
  }
`

const BodyWrapper = styled.div`
  top: ${MENU_HEIGHT}px;
  position: relative;
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

const NavWrapper = styled.div`
  display: flex;
`

const PriceWrapper = styled.div`
  align-self: center;
  margin-right: 10px;
`
