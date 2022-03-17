import { useMemo, useState } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import web3NoAccount, { getWeb3NoAccount } from 'utils/web3'

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const { library } = useWeb3React()
  const proxy = library ? library.provider : undefined
  const [web3, setweb3] = useState(web3NoAccount)

  useMemo(() => {
      setweb3(proxy ? new Web3(proxy) : web3NoAccount)
  }, [proxy])
  return web3
}

export default useWeb3
