import { toNumber } from 'lodash'
import React from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { Button } from 'uikit'
import useWeb3 from 'hooks/useWeb3'
import LimitOrdersApi, { Transaction } from '@unidexexchange/sdk'
import { Price } from '@hyperjump-defi/sdk'

import useToast from 'hooks/useToast'

interface PlaceOrderButtonProps {
  chainId: number
  account: string
  sellToken: string
  sellAmount: string
  buyToken: string
  buyAmount: string
  limitPrice: string
  price?: Price
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  chainId,
  account,
  sellToken,
  sellAmount,
  buyToken,
  buyAmount,
  limitPrice,
  price,
}: PlaceOrderButtonProps) => {
  const { toastSuccess, toastError } = useToast()
  const web3 = useWeb3()
  const sAmount = new BigNumber(sellAmount).multipliedBy(BIG_TEN.pow(price?.baseCurrency?.decimals)).toString()
  const bAmount = new BigNumber(buyAmount).multipliedBy(BIG_TEN.pow(price?.baseCurrency?.decimals)).toString()
  const handlePlaceOrder = async () => {
    try {
      const request = {
        chainId,
        account,
        sellToken,
        sellAmount: sAmount,
        buyToken,
        buyAmount: bAmount,
      }
      const order: Transaction = await LimitOrdersApi.placeOrder(request)
      web3.eth.sendTransaction(order, (error: Error, hash: string) => {
        if (!error) {
          const interval = setInterval(() => {
            web3.eth.getTransactionReceipt(hash, (err, rec) => {
              if (rec) {
                clearInterval(interval)
                toastSuccess('Limit Order!', 'Your Limit Order has been placed !')
              }
            })
          }, 2000)
        }
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error', e)
    }
  }

  return (
    <Button
      width="100%"
      disabled={toNumber(limitPrice) === 0}
      variant={!limitPrice ? 'danger' : 'primary'}
      onClick={() => handlePlaceOrder()}
    >
      Place Order
    </Button>
  )
}

export default PlaceOrderButton
