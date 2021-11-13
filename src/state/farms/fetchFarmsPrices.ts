import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { Farm } from 'state/types'
import getNetwork from 'utils/getNetwork'

const getFarmFromTokenSymbol = (farms: Farm[], tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  networkTokenUsdFarm: Farm,
  farmingTokenUsdFarm: Farm,
): BigNumber => {
  const networkTokenPriceUsd = networkTokenUsdFarm.tokenPriceVsQuote
    ? BIG_ONE.div(networkTokenUsdFarm.tokenPriceVsQuote)
    : BIG_ZERO
  const farmingTokenPriceUsd = farmingTokenUsdFarm.tokenPriceVsQuote
    ? BIG_ONE.div(farmingTokenUsdFarm.tokenPriceVsQuote)
    : BIG_ZERO
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === networkTokenUsdFarm.token.symbol) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === networkTokenUsdFarm.quoteToken.symbol) {
    return hasTokenPriceVsQuote ? networkTokenPriceUsd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === farmingTokenUsdFarm.quoteToken.symbol) {
    return hasTokenPriceVsQuote ? farmingTokenPriceUsd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === networkTokenUsdFarm.quoteToken.symbol) {
    const quoteTokenInUsd = networkTokenPriceUsd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInUsd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === networkTokenUsdFarm.token.symbol) {
    const quoteTokenInUsd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInUsd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === farmingTokenUsdFarm.quoteToken.symbol) {
    const quoteTokenInUsd = farmingTokenPriceUsd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInUsd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  networkTokenUsdFarm: Farm,
  farmingTokenUsdFarm: Farm,
): BigNumber => {
  const networkTokenPriceUsd = networkTokenUsdFarm.tokenPriceVsQuote
    ? BIG_ONE.div(networkTokenUsdFarm.tokenPriceVsQuote)
    : BIG_ZERO
  const farmingTokenPriceUsd = farmingTokenUsdFarm.tokenPriceVsQuote
    ? BIG_ONE.div(farmingTokenUsdFarm.tokenPriceVsQuote)
    : BIG_ZERO
  if (farm.quoteToken.symbol === networkTokenUsdFarm.token.symbol) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === networkTokenUsdFarm.quoteToken.symbol) {
    return networkTokenPriceUsd
  }

  if (farm.quoteToken.symbol === farmingTokenUsdFarm.quoteToken.symbol) {
    return farmingTokenPriceUsd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === networkTokenUsdFarm.quoteToken.symbol) {
    return quoteTokenFarm.tokenPriceVsQuote ? networkTokenPriceUsd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === farmingTokenUsdFarm.token.symbol) {
    return quoteTokenFarm.tokenPriceVsQuote ? farmingTokenPriceUsd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === networkTokenUsdFarm.quoteToken.symbol) {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchFarmsPrices = (farms) => {
  const { config } = getNetwork()
  const networkTokenUsdFarm = farms.find((farm: Farm) => farm.pid === config.networkTokenUsdFarmPid)
  const farmingTokenUsdFarm = farms.find((farm: Farm) => farm.pid === config.farmingTokenUsdFarmPid)

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, networkTokenUsdFarm, farmingTokenUsdFarm)
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, networkTokenUsdFarm, farmingTokenUsdFarm)
    const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() }
    return { ...farm, token, quoteToken }
  })
  return farmsWithPrices
}

export default fetchFarmsPrices
