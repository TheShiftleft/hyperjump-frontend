import warpLps from 'config/constants/warpLps'
import getNetwork from 'utils/getNetwork'

const useOtherSwapList = () => {
    const { config } = getNetwork()
    return warpLps[config.network]
}

export default useOtherSwapList