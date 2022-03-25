import { Button, Flex, Box, Text, useModal } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { useGetTokensList } from 'hooks/moralis'
import React from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import Container from 'components/layout/Container'
import TokenRow from './TokenRow'
import BroomModal from './BroomModal'
import WalletLogin from './WalletLogin'
import WalletTable from './WalletTable'

const ButtonBox = styled(Box)`
  text-align: center;
  margin: 50px 0;
`

const Portfolio: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { config } = getNetwork()

  return <>{account ? <WalletTable /> : <WalletLogin />}</>
}

export default Portfolio
