import { useMemo } from "react";
import { ApprovedTransaction } from "views/Tools/Unrekt";
import { useRevokeContract } from "./useContract";

export enum RevokeCallbackState {
  INVALID,
  VALID,
  PENDING,
}

export default function useRevoke(transaction: ApprovedTransaction) {
  const contract = useRevokeContract(transaction.contract)
  return useMemo(() => {
    if(!transaction.contract || !transaction.approved || !contract){
      return {
        status: RevokeCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies'
      }
    }
    return {
      status: RevokeCallbackState.VALID,
      callback: async () => {
        const revoke = await contract.approve(transaction.approved, 0)
        return revoke
      },
      error: ''
    }
  },[transaction.contract, transaction.approved, contract])

}