import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { getLotteryABI } from 'config/abi'
import { getLotteryAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { LotteryRound, LotteryRoundUserTickets, LotteryResponse } from 'state/types'
import { getLotteryContract, getFarmingTokenContract } from 'utils/contractHelpers'
import { useMemo } from 'react'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'

const lotteryContract = getLotteryContract()
// console.log("LotteryContract", lotteryContract)
// Variable used to determine how many past rounds should be populated by node data rather than subgraph

const processViewLotterySuccessResponse = (response, lotteryId: string): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicketInFarmingToken,
    treasuryFee,
    firstTicketId,
    lastTicketId,
    amountCollectedInFarmingToken,
    finalNumber,
    farmingTokenPerBracket,
    countWinnersPerBracket,
    rewardsBreakdown,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedFarmingTokenPerBracket = farmingTokenPerBracket.map((farmingTokenInBracket) => ethersToSerializedBigNumber(farmingTokenInBracket))
  const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
    ethersToSerializedBigNumber(winnersInBracket),
  )
  const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => ethersToSerializedBigNumber(reward))

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicketInFarmingToken: ethersToSerializedBigNumber(priceTicketInFarmingToken),
    treasuryFee: treasuryFee?.toString(),
    firstTicketId: firstTicketId?.toString(),
    lastTicketId: lastTicketId?.toString(),
    amountCollectedInFarmingToken: ethersToSerializedBigNumber(amountCollectedInFarmingToken),
    finalNumber,
    farmingTokenPerBracket: serializedFarmingTokenPerBracket,
    countWinnersPerBracket: serializedCountWinnersPerBracket,
    rewardsBreakdown: serializedRewardsBreakdown,
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInFarmingToken: '',
    treasuryFee: '',
    firstTicketId: '',
    lastTicketId: '',
    amountCollectedInFarmingToken: '',
    finalNumber: null,
    farmingTokenPerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
  }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
   // console.log(lotteryContract.methods)
    const lotteryData = await lotteryContract.methods.viewLottery(lotteryId).call()
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map((id) => ({
    name: 'viewLottery',
    address: getLotteryAddress(),
    params: [id],
  }))
  try {
    const multicallRes = await multicall(getLotteryABI(), calls, { requireSuccess: false })
    const processedResponses = multicallRes.map((res, index) =>
      processViewLotterySuccessResponse(res[0], lotteryIds[index]),
    )
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const calls = ['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'].map((method) => ({
      address: getLotteryAddress(),
      name: method,
    }))
    const [[currentLotteryId], [maxNumberTicketsPerBuyOrClaim]] = (await multicall(
      getLotteryABI(),
      calls,
    )) as ethers.BigNumber[][]

    return {
      currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
      maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim ? maxNumberTicketsPerBuyOrClaim.toString() : null,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuyOrClaim: null,
    }
  }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    if ((currentIdAsInt - i) < 0) break
    roundIds.push(currentIdAsInt - i)
  }
  return roundIds.map((roundId) => roundId.toString())
}

export const useProcessLotteryResponse = (
  lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
  const {
    priceTicketInFarmingToken: priceTicketInFarmingTokenAsString,
    amountCollectedInFarmingToken: amountCollectedInFarmingTokenAsString,
  } = lotteryData

  const priceTicketInFarmingToken = useMemo(() => {
    return new BigNumber(priceTicketInFarmingTokenAsString)
  }, [priceTicketInFarmingTokenAsString])

  const amountCollectedInFarmingToken = useMemo(() => {
    return new BigNumber(amountCollectedInFarmingTokenAsString)
  }, [amountCollectedInFarmingTokenAsString])

  return {
    isLoading: lotteryData.isLoading,
    lotteryId: lotteryData.lotteryId,
    userTickets: lotteryData.userTickets,
    status: lotteryData.status,
    startTime: lotteryData.startTime,
    endTime: lotteryData.endTime,
    priceTicketInFarmingToken,
    treasuryFee: lotteryData.treasuryFee,
    firstTicketId: lotteryData.firstTicketId,
    lastTicketId: lotteryData.lastTicketId,
    amountCollectedInFarmingToken,
    finalNumber: lotteryData.finalNumber,
    farmingTokenPerBracket: lotteryData.farmingTokenPerBracket,
    countWinnersPerBracket: lotteryData.countWinnersPerBracket,
    rewardsBreakdown: lotteryData.rewardsBreakdown,
  }
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}
