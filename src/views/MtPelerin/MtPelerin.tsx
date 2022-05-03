import React from 'react'
import getNetwork from 'utils/getNetwork'
import Page from 'components/layout/Page'
import MtPelerinWidget from './MtPelerinWidget'

const MtPelerin: React.FC = () => {
  const { config } = getNetwork()
  const primarycolor = encodeURIComponent('#152b4e')
  const ssc = config.id === 56 ? 'BNB' : 'FTM'
  const bdc = config.id === 56 ? 'BNB' : 'FTM'
  const network = config.id === 56 ? 'bsc_mainnet' : 'fantom_mainnet'
  const defaultmoney = 'USD'

  return (
    <MtPelerinWidget
      language="en"
      success={primarycolor}
      primary={primarycolor}
      sellsourcecurrency={ssc}
      selldestinationcurrency={defaultmoney}
      buysourcecurrency={defaultmoney}
      buydestinationcurrency={bdc}
      defaulttab="buy"
      network={network}
      viewtype="web"
    />
  )
}

export default MtPelerin
