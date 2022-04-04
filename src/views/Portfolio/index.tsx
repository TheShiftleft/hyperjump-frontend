import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import getNetwork from 'utils/getNetwork'
import { useTokenPrice } from 'hooks/api'
import WalletLogin from './WalletLogin'
import WalletTable from './WalletTable'

const Portfolio: React.FC = () => {
  const { account } = useWeb3React()
  const tokenPrice = useTokenPrice()
  console.log('token price', tokenPrice)

  return <>{account ? <WalletTable /> : <WalletLogin />}</>
}

export default Portfolio
