
import { useMemo } from "react"

export default function estimateZapInToken(contract, from, to, router, amt) {
    return useMemo(async () => {
        const result = await contract.methods
        .estimateZapInToken(from, to, router, amt)
        .call()
        return result
    },[contract, from, to, router, amt])
}