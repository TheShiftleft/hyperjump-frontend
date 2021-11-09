import BigNumber from "bignumber.js"

const calcDaily = (apy: BigNumber): BigNumber => {
  const g = (10 ** (Math.log10(apy.toNumber() + 1) / 365)) - 1
  return new BigNumber(g)
}

export default calcDaily