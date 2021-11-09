import { SCANNER_URL } from 'config'

export const getScannerAddressUrl = (address: string) => {
  return `${SCANNER_URL}/address/${address}`
}

export const getScannerTransactionUrl = (transactionHash: string) => {
  return `${SCANNER_URL}/tx/${transactionHash}`
}

export const getScannerBlockNumberUrl = (block: string | number) => {
  return `${SCANNER_URL}/block/${block}`
}

export const getScannerBlockCountdownUrl = (block: string | number) => {
  return `${SCANNER_URL}/block/countdown/${block}`
}
