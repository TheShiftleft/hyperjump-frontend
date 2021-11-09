import networks from 'config/constants/networks'

const getNetwork = () => {
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  const config = networks.find((n) => n.id === chainId)
  return { chainId, config }
}

export default getNetwork
