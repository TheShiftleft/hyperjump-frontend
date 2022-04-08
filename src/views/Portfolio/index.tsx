import { useWeb3React } from '@web3-react/core'
import React from 'react'
import WalletLogin from './WalletLogin'
import WalletTable from './WalletTable'

const Portfolio: React.FC = () => {
  const { account } = useWeb3React()

  return <>{account ? <WalletTable /> : <WalletLogin />}</>
}

export default Portfolio
