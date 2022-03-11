import React from 'react'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Button, Flex, Box, useWalletModal, Input, Heading, Link } from 'uikit'
import { HelpIcon } from 'uikit/components/Svg'

const WalletPageBox = styled(Flex)`
  padding-left: 48px;
  padding-right: 48px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 40px;
  padding-bottom: 40px;
  max-width: 486px;
  margin-top: auto;
  margin-bottom: auto;
  align-items: center;
  flex-direction: column;
  display: flex;
`
const LoginHeading = styled(Heading)`
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  text-align: center;
  justify-content: center;
  margin-bottom: 40px;
`
const MainHeading = styled(Heading)`
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 900;
`
const ConnectButton = styled(Button)`
  width: 100%;
  text-align: center;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  border-radius: 10px;
  padding: 30px;
`

const StyledInput = styled(Input)`
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 30px;
  padding-bottom: 25px;
  border-style: none;
`
const WalletPasteBox = styled(Box)`
  width: 100%;
  overflow: hidden;
  margin-bottom: 12px;
  align-items: stretch;
  display: flex;
  border-radius: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.primary};
`
const GoPasteButton = styled(Button)`
  padding: 30px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  border-sytle: none;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 0px;
`
const Separator = styled.div`
  width: 100%;
  margin-top: 24px;
  margin-bottom: 24px;
  align-items: center;
  display: flex;
`
const MainLogo = styled.img`
  width: 200px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 400px;
  }
  margin-bottom: 10px;
`
const HelpLink = styled(Link)`
  display: flex;
  align-self: center;
  align-items: center;
  margin-top: 24px;
`

const WalletLogin = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <WalletPageBox>
      <MainLogo src="/images/hyperjump-full-logo.png" />
      <MainHeading>Welcome to Hyper Jump</MainHeading>
      <LoginHeading>Multichain portfolio manager, automated yield farming & dex aggregator</LoginHeading>
      <ConnectButton onClick={onPresentConnectModal} {...props}>
        {t('Connect Your Wallet')}
      </ConnectButton>
      <Separator />
      <WalletPasteBox>
        <StyledInput placeholder={t('Paste your wallet a ddress')} />

        <GoPasteButton>GO</GoPasteButton>
      </WalletPasteBox>
      <HelpLink href="https://docs.hyperjump.app/get-started/connection-guide" external>
        <HelpIcon color="primary" mr="6px" />
        Learn how to connect
      </HelpLink>
    </WalletPageBox>
  )
}

export default WalletLogin
