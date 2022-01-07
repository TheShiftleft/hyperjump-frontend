import { toNumber } from "lodash"
import React, { useState, useEffect, useRef } from "react"
import { Button } from 'uikit'
import { usePlaceOrder} from 'hooks/useLimitOrder'
import useWeb3 from "hooks/useWeb3"
import { getLimitOrderContract } from 'utils/contractHelpers'
import LimitOrdersApi from '@unidexexchange/sdk'

interface PlaceOrderButtonProps {
    chainId: number
    account: string
    sellToken: string
    sellAmount: string
    buyToken: string
    buyAmount: string
    limitPrice: string
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({chainId, account, sellToken, sellAmount, buyToken, buyAmount, limitPrice}: PlaceOrderButtonProps) => {
    const web3 = useWeb3()
    const limitOrdersContract = getLimitOrderContract(web3)
    const handlePlaceOrder = async () => {
        try{
            const request = {
                chainId,
                account,
                sellToken,
                sellAmount,
                buyToken,
                buyAmount
            }
            const order = await LimitOrdersApi.placeOrder(request)
            const placedOrder = await limitOrdersContract.methods.depositEth(order.data).call()
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