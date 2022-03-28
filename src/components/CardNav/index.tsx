import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import ChainId from 'utils/getChain'
import bridgeNetworks from 'config/constants/bridgeNetworks'

import useI18n from 'hooks/useI18n'
import getNetwork from 'utils/getNetwork'
import { getAddress } from 'utils/addressHelpers'

const StyledNav = styled.div`
  margin-bottom: 40px;
`

function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  const { config } = getNetwork()

  const [outputChainId, outputCurrency, inputCurrency] = useMemo(() => {
    let _outputChainId
    let _inputCurrency
    let _outputCurrency
    Object.keys(bridgeNetworks).forEach(function eachKey(key) {
      if (bridgeNetworks[key].chainId !== config.id) {
        if (ChainId.BSC_MAINNET === config.id && bridgeNetworks[key].chainId === ChainId.FTM_MAINNET) {
          _outputChainId = bridgeNetworks[key].chainId
          _outputCurrency = bridgeNetworks[key].tokens[0].address
        } else if (ChainId.FTM_MAINNET === config.id && bridgeNetworks[key].chainId === ChainId.BSC_MAINNET) {
          _outputChainId = bridgeNetworks[key].chainId
          _outputCurrency = bridgeNetworks[key].tokens[0].address
        }
      } else {
        _inputCurrency = bridgeNetworks[key].tokens[0].address
      }
    })
    return [_outputChainId, _outputCurrency, _inputCurrency]
  }, [config])

  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem
          id="swap-nav-link"
          to={`/swap?inputCurrency=${config.baseCurrency.symbol}&outputCurrency=${getAddress(
            config.farmingToken.address,
          )}`}
          as={Link}
        >
          {TranslateString(1142, 'Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
          {TranslateString(262, 'Liquidity')}
        </ButtonMenuItem>
        <ButtonMenuItem
          id="bridge-nav-link"
          to={`/bridge?outputChainId=${outputChainId}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`}
          as={Link}
        >
          {TranslateString(262, 'Bridge')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
