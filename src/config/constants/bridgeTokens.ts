import ChainId from 'utils/getChain';

const bridgeTokens = [
  {
    name: 'JUMP',
    symbol: 'JUMP',
    addresses: {
      [ChainId.BSC_MAINNET]: '0x130025eE738A66E691E6A7a62381CB33c6d9Ae83',
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
      [ChainId.BSC_MAINNET]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      [ChainId.POLYGON]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [ChainId.FTM_MAINNET]: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      [ChainId.BOBA]: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
      [ChainId.ARBITRUM]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      [ChainId.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      [ChainId.HARMONY]: '0x985458E523dB3d53125813eD68c274899e9DfAb4'
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
    logoURI: "https://tokens.hyperswap.fi/images/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png"
  },
  {
    name: 'USD Tether',
    symbol: 'USDT',
    addresses: {
      [ChainId.ETH]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainId.BSC_MAINNET]: '0x55d398326f99059fF775485246999027B3197955',
      [ChainId.POLYGON]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      [ChainId.FTM_MAINNET]: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      [ChainId.BOBA]: '0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d',
      [ChainId.ARBITRUM]: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      [ChainId.AVALANCHE]: '0xc7198437980c041c805a1edcba50c1ce5db95118',
      [ChainId.HARMONY]: '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f'
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
    logoURI: "https://tokens.hyperswap.fi/images/0x55d398326f99059fF775485246999027B3197955.png"
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    addresses: {
      [ChainId.ETH]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [ChainId.POLYGON]: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      [ChainId.BOBA]: '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35',
      [ChainId.ARBITRUM]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      [ChainId.AVALANCHE]: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      [ChainId.HARMONY]: '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339'
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.POLYGON]: 18,
      [ChainId.BOBA]: 18,
      [ChainId.ARBITRUM]: 18,
      [ChainId.AVALANCHE]: 18,
      [ChainId.HARMONY]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png"
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    addresses: {
      [ChainId.BSC_MAINNET]: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
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
      [ChainId.BSC_MAINNET]: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC'
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x23396cF899Ca06c4472205fC903bDB4de249D6fC.png"
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    addresses: {
      [ChainId.FTM_MAINNET]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    },
    decimals: {
      [ChainId.FTM_MAINNET]: 18,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x74b23882a30290451A17c44f4F05243b6b58C76d.png"
  },
  {
    name: 'Synapse',
    symbol: 'SYN',
    addresses: {
      [ChainId.ETH]: '0x0f2d719407fdbeff09d87557abb7232601fd9f29',
      [ChainId.BSC_MAINNET]: '0xa4080f1778e69467E905B8d6F72f6e441f9e9484',
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
    logoURI: "https://synapseprotocol.com/static/media/synapse.2ad11ea43218bdada85bff8f054dd4be.svg"
  },
  {
    name: 'Synapse nUSD',
    symbol: 'nUSD',
    addresses: {
      [ChainId.ETH]: '0x1B84765dE8B7566e4cEAF4D0fD3c5aF52D3DdE4F',
      [ChainId.BSC_MAINNET]: '0x23b891e5C62E0955ae2bD185990103928Ab817b3',
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
    logoURI: "https://synapseprotocol.com/static/media/nusd.c53623fc82a6883515f6cffe1d6cc925.svg"
  },
  {
    name: 'Synapse nETH',
    symbol: 'nETH',
    addresses: {
      [ChainId.FTM_MAINNET]: '0x67C10C397dD0Ba417329543c1a40eb48AAa7cd00',
    },
    decimals: {
      [ChainId.FTM_MAINNET]: 18,
    },
    logoURI: "https://synapseprotocol.com/static/media/neth.832ca487dfcd9a1be8f9f9f0242e0171.svg"
  },
  {
    name: 'Ethereum',
    symbol: 'WETH',
    addresses: {
      [ChainId.ETH]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
    decimals: {
      [ChainId.ETH]: 18,
    },
    logoURI: "https://tokens.hyperswap.fi/images/0x74b23882a30290451A17c44f4F05243b6b58C76d.png"
  },
  {
    name: 'Highstreet',
    symbol: 'HIGH',
    addresses: {
      [ChainId.BSC_MAINNET]: "0x5f4Bde007Dc06b867f86EBFE4802e34A1fFEEd63",
      [ChainId.ETH]: "0x71Ab77b7dbB4fa7e017BC15090b2163221420282"
    },
    decimals: {
      [ChainId.BSC_MAINNET]: 18,
      [ChainId.ETH]: 18
    },
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11232.png"
  },
  {
    name: 'The Doge NFT',
    symbol: 'DOG',
    addresses: {
      [ChainId.ETH]: "0xBAac2B4491727D78D2b78815144570b9f2Fe8899",
      [ChainId.BSC_MAINNET]: "0xaA88C603d142C371eA0eAC8756123c5805EdeE03"
    },
    decimals: {
      [ChainId.ETH]: 18,
      [ChainId.BSC_MAINNET]: 18
    },
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/11557.png"
  }
  
]



const getChainSupportedTokens = (_chainId: number) => {
  const supportedTokens = []
  bridgeTokens.map(t => (t.addresses[_chainId] ? supportedTokens.push(t) : null))

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
