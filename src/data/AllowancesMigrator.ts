import { useMemo } from 'react'
import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// use token address instead of token
export function useTokenAllowanceMigrator(tokenAddress?: string, owner?: string, spender?: string) {
  const contract = useTokenContract(tokenAddress, false)
  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result
  return allowance
}

export default useTokenAllowanceMigrator
