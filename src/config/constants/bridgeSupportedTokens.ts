import ChainId from 'utils/getChain';

const bridgeSupportedTokens = [
  {
    name: 'JUMP',
    symbol: 'JUMP',
    addresses: {
      [ChainId.BSC_MAINNET]: '0x130025ee738a66e691e6a7a62381cb33c6d9ae83',
      [ChainId.FTM_MAINNET]: '0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73'
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.FTM_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x78DE9326792ce1d6eCA0c978753c6953Cdeedd73.png"
  },
  {
    name: 'USD Circle',
    symbol: 'USDC',
    addresses: {
      [ChainId.ETH]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainId.BSC_MAINNET]: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      [ChainId.POLYGON]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [ChainId.FTM_MAINNET]: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      [ChainId.BOBA]: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
      [ChainId.ARBITRUM]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      [ChainId.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      [ChainId.HARMONY]: '0x985458e523db3d53125813ed68c274899e9dfab4'
    },
    decimals: {
      [ChainId.ETH]: 6,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 6,
      [ChainId.FTM_MAINNET]: 6,
      [ChainId.BOBA]: 6,
      [ChainId.AVALANCHE]: 6,
      [ChainId.ARBITRUM]: 6,
      [ChainId.HARMONY]: 6,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x04068da6c83afcfa0e13ba15a6696662335d5b75.png"
  },
  {
    name: 'MIM',
    symbol: 'MIM',
    addresses: {
      [ChainId.FTM_MAINNET]: '0x82f0b8b456c1a451378467398982d4834b6829c1'
    },
    decimals: {
      [ChainId.FTM_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x82f0b8b456c1a451378467398982d4834b6829c1.png"
  },
  {
    name: 'USD Tether',
    symbol: 'USDT',
    addresses: {
      [ChainId.ETH]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainId.BSC_MAINNET]: '0x55d398326f99059ff775485246999027b3197955',
      [ChainId.POLYGON]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      [ChainId.FTM_MAINNET]: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      [ChainId.BOBA]: '0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d',
      [ChainId.ARBITRUM]: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      [ChainId.AVALANCHE]: '0xc7198437980c041c805a1edcba50c1ce5db95118',
      [ChainId.HARMONY]: '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f'
    },
    decimals: {
      [ChainId.ETH]: 6,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 6,
      [ChainId.FTM_MAINNET]: 6,
      [ChainId.BOBA]: 6,
      [ChainId.ARBITRUM]: 6,
      [ChainId.AVALANCHE]: 6,
      [ChainId.HARMONY]: 6,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x049d68029688eabf473097a2fc38ef61633a3c7a.png"
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    addresses: {
      [ChainId.ETH]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [ChainId.BSC_MAINNET]: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      [ChainId.POLYGON]: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      [ChainId.BOBA]: '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35',
      [ChainId.ARBITRUM]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      [ChainId.AVALANCHE]: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      [ChainId.HARMONY]: '0xef977d2f931c1978db5f6747666fa1eacb0d0339'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18,
      [ChainId.AVALANCHE]: 18,
      [ChainId.HARMONY]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x6b175474e89094c44da98b954eedeac495271d0f.png"
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    addresses: {
      [ChainId.BSC_MAINNET]: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xe9e7cea3dedca5984780bafc599bd69add087d56.png"
  },
  {
    name: 'TerraUSD',
    symbol: 'UST',
    addresses: {
      [ChainId.BSC_MAINNET]: '0x23396cf899ca06c4472205fc903bdb4de249d6fc'
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x23396cf899ca06c4472205fc903bdb4de249d6fc.png"
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    addresses: {
      [ChainId.ETH]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      [ChainId.BOBA]: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      [ChainId.ARBITRUM]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
  },
  {
    name: 'Synapse',
    symbol: 'SYN',
    addresses: {
      [ChainId.ETH]: '0x0f2d719407fdbeff09d87557abb7232601fd9f29',
      [ChainId.BSC_MAINNET]: '0xa4080f1778e69467e905b8d6f72f6e441f9e9484',
      [ChainId.POLYGON]: '0xf8f9efc0db77d8881500bb06ff5d6abc3070e695',
      [ChainId.FTM_MAINNET]: '0xE55e19Fb4F2D85af758950957714292DAC1e25B2',
      [ChainId.BOBA]: '0xb554A55358fF0382Fb21F0a478C3546d1106Be8c',
      [ChainId.MOONRIVER]: '0xd80d8688b02B3FD3afb81cDb124F188BB5aD0445',
      [ChainId.ARBITRUM]: '0x080f6aed32fc474dd5717105dba5ea57268f46eb',
      [ChainId.AVALANCHE]: '0x1f1E7c893855525b303f99bDF5c3c05Be09ca251',
      [ChainId.HARMONY]: '0xE55e19Fb4F2D85af758950957714292DAC1e25B2'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 18,
      [ChainId.FTM_MAINNET]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.MOONRIVER]: 18,
      [ChainId.ARBITRUM]: 18,
      [ChainId.AVALANCHE]: 18,
      [ChainId.HARMONY]: 18,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xE55e19Fb4F2D85af758950957714292DAC1e25B2.png"
  },
  {
    name: 'Synapse nUSD',
    symbol: 'nUSD',
    addresses: {
      [ChainId.ETH]: '0x1B84765dE8B7566e4cEAF4D0fD3c5aF52D3DdE4F',
      [ChainId.BSC_MAINNET]: '0x23b891e5c62e0955ae2bd185990103928ab817b3',
      [ChainId.POLYGON]: '0xb6c473756050de474286bed418b77aeac39b02af',
      [ChainId.FTM_MAINNET]: '0xED2a7edd7413021d440b09D654f3b87712abAB66',
      [ChainId.BOBA]: '0x6B4712AE9797C199edd44F897cA09BC57628a1CF',
      [ChainId.ARBITRUM]: '0x2913E812Cf0dcCA30FB28E6Cac3d2DCFF4497688',
      [ChainId.AVALANCHE]: '0xCFc37A6AB183dd4aED08C204D1c2773c0b1BDf46',
      [ChainId.HARMONY]: '0xED2a7edd7413021d440b09D654f3b87712abAB66'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 18,
      [ChainId.FTM_MAINNET]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18,
      [ChainId.AVALANCHE]: 18,
      [ChainId.HARMONY]: 18,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xED2a7edd7413021d440b09D654f3b87712abAB66.png"
  },
  {
    name: 'Synapse nETH',
    symbol: 'nETH',
    addresses: {
      [ChainId.ETH]: '0x1B84765dE8B7566e4cEAF4D0fD3c5aF52D3DdE4F',
      [ChainId.BSC_MAINNET]: '0x23b891e5c62e0955ae2bd185990103928ab817b3',
      [ChainId.POLYGON]: '0xb6c473756050de474286bed418b77aeac39b02af',
      [ChainId.FTM_MAINNET]: '0xED2a7edd7413021d440b09D654f3b87712abAB66',
      [ChainId.BOBA]: '0x6B4712AE9797C199edd44F897cA09BC57628a1CF',
      [ChainId.ARBITRUM]: '0x2913E812Cf0dcCA30FB28E6Cac3d2DCFF4497688',
      [ChainId.AVALANCHE]: '0xCFc37A6AB183dd4aED08C204D1c2773c0b1BDf46',
      [ChainId.HARMONY]: '0xED2a7edd7413021d440b09D654f3b87712abAB66'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.POLYGON]: 18,
      [ChainId.FTM_MAINNET]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18,
      [ChainId.AVALANCHE]: 18,
      [ChainId.HARMONY]: 18,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xED2a7edd7413021d440b09D654f3b87712abAB66.png"
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    addresses: {
      [ChainId.ETH]: '',
      [ChainId.BOBA]: '',
      [ChainId.ARBITRUM]: ''
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/ETH.png"
  },
  {
    name: 'Frax',
    symbol: 'FRAX',
    addresses: {
      [ChainId.ETH]: '0x853d955acef822db058eb8505911ed77f175b99e',
      [ChainId.MOONRIVER]: '0x1a93b23281cc1cde4c4741353f3064709a16197d'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.MOONRIVER]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x853d955acef822db058eb8505911ed77f175b99e.png"
  },
  {
    name: 'Synapse Frax',
    symbol: 'synFRAX',
    addresses: {
      [ChainId.MOONRIVER]: '0x1a93b23281cc1cde4c4741353f3064709a16197d'
    },
    decimals: {
      [ChainId.MOONRIVER]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x853d955acef822db058eb8505911ed77f175b99e.png"
  },
  {
    name: 'Highstreet',
    symbol: 'HIGH',
    addresses: {
      [ChainId.BSC_MAINNET]: "0x5f4bde007dc06b867f86ebfe4802e34a1ffeed63",
      [ChainId.ETH]: "0x71Ab77b7dbB4fa7e017BC15090b2163221420282"
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.ETH]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x71Ab77b7dbB4fa7e017BC15090b2163221420282.png"
  },
  {
    name: 'The Doge NFT',
    symbol: 'DOG',
    addresses: {
      [ChainId.ETH]: "0xBAac2B4491727D78D2b78815144570b9f2Fe8899",
      [ChainId.BSC_MAINNET]: "0xaa88c603d142c371ea0eac8756123c5805edee03"
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0xaa88c603d142c371ea0eac8756123c5805edee03.png"
  }
  
]

const getChainSupportedTokens = (_chainId: number) => {
  const supportedTokens = []
  bridgeSupportedTokens.map(t => (t.addresses[_chainId] ? supportedTokens.push(t) : null))

  return supportedTokens.map((token) => {
    return {
      name: token.name, 
      symbol: token.symbol,
      chainId: _chainId,
      address: token.addresses[_chainId],
      decimals: token.decimals[_chainId],
      logoURI: token.logoURI,
    }
  })
}

export default getChainSupportedTokens
