import { toNumber } from "lodash"
import React from "react"
import { Button } from 'uikit'
import useWeb3 from "hooks/useWeb3"
import LimitOrdersApi from '@unidexexchange/sdk'
import { Price } from '@hyperjump-defi/sdk'

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

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({chainId, account, sellToken, sellAmount, buyToken, buyAmount, limitPrice, price}: PlaceOrderButtonProps) => {
    const web3 = useWeb3()
    const sAmount = toNumber(sellAmount) * 10 ** price?.baseCurrency?.decimals
    const bAmount = toNumber(buyAmount) * 10 ** price?.quoteCurrency?.decimals
    const handlePlaceOrder = async () => {
        try{
            const request = {
                chainId,
                account,
                sellToken,
                sellAmount: sAmount,
                buyToken,
                buyAmount: bAmount
            }
            const order = await LimitOrdersApi.placeOrder(request)
            console.log('order',order)
            web3.eth.sendTransaction(order).then(function(receipt){
                console.log('receipt',receipt)
            });
        }catch(e){
            console.log('error', e)
        }
    }

    return(
        <Button
            width="100%"
            disabled={(toNumber(limitPrice) === 0)} 
            variant={!limitPrice ? 'danger' : 'primary'}
            onClick={() => handlePlaceOrder()}
        >
            Place Order
        </Button>
    )
}

export default PlaceOrderButton