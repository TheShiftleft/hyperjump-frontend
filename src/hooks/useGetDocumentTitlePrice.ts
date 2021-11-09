import { useEffect } from 'react'
import { usePriceFarmingTokenUsd } from 'state/hooks'

const useGetDocumentTitlePrice = () => {
  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const priceNum = farmingTokenPriceUsd.toNumber()
  const farmingTokenPriceUsdString =
    Number.isNaN(priceNum) || priceNum === 0
      ? ''
      : ` - $${priceNum.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`

  useEffect(() => {
    document.title = `HyperJump${farmingTokenPriceUsdString}`
  }, [farmingTokenPriceUsdString])
}
export default useGetDocumentTitlePrice
