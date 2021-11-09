// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { getAddress, getWrappedNetworkTokenAddress } from './addressHelpers'
import getNetwork from './getNetwork'

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const { config } = getNetwork()
  const wrappedNetworkTokenAddr = getWrappedNetworkTokenAddress()
  const quoteTokenAddressString: string = getAddress(quoteTokenAddress)
  const tokenAddressString: string = getAddress(tokenAddress)
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wrappedNetworkTokenAddr ? config.networkToken.symbol : quoteTokenAddressString
  const secondPart = !tokenAddressString || tokenAddressString === wrappedNetworkTokenAddr ? config.networkToken.symbol : tokenAddressString
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
