import getNetwork from "utils/getNetwork"

const { config } = getNetwork()

export const DEFAULT_TOKEN_LIST_URL = config.swapTokenListUrl
export const DEFAULT_LIST_OF_LISTS: string[] = [DEFAULT_TOKEN_LIST_URL]
