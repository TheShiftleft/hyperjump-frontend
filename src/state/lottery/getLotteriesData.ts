import { gql, request } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import getNetwork from 'utils/getNetwork'
import { LotteryRoundGraphEntity, LotteryResponse } from 'state/types'
import { getRoundIdsArray, fetchMultipleLotteries } from './helpers'

const { config } = getNetwork()
const subgraph_endpoint = `https://api.thegraph.com/subgraphs/name/angry-mech/lottery-${config.name.toLocaleLowerCase()}` 

const applyNodeDataToLotteriesGraphResponse = (
  nodeData: LotteryResponse[],
  graphResponse: LotteryRoundGraphEntity[],
): LotteryRoundGraphEntity[] => {
  //   If no graph response - return node data
  if (graphResponse.length === 0) {
    return nodeData.map((nodeRound) => {
      return {
        endTime: nodeRound.endTime,
        finalNumber: nodeRound.finalNumber.toString(),
        startTime: nodeRound.startTime,
        status: nodeRound.status,
        id: nodeRound.lotteryId.toString(),
        ticketPrice: nodeRound.priceTicketInFarmingToken,
        totalTickets: '',
        totalUsers: '',
        winningTickets: '',
      }
    })
  }

  //   Else if there is a graph response - merge with node data where node data is more reliable
  const mergedResponse = graphResponse.map((graphRound, index) => {
    const nodeRound = nodeData[index]
    // if there is node data for this index, overwrite graph data. Otherwise - return graph data.
    if (nodeRound) {
      // if isLoading === true, there has been a node error - return graphRound
      if (!nodeRound.isLoading) {
        return {
          endTime: nodeRound.endTime,
          finalNumber: nodeRound.finalNumber.toString(),
          startTime: nodeRound.startTime,
          status: nodeRound.status,
          id: graphRound.id,
          ticketPrice: graphRound.ticketPrice,
          totalTickets: graphRound.totalTickets,
          totalUsers: graphRound.totalUsers,
          winningTickets: graphRound.winningTickets,
        }
      }
      return graphRound
    }
    return graphRound
  })
  return mergedResponse
}

const getGraphLotteries = async (): Promise<LotteryRoundGraphEntity[]> => {
  const query = gql`
    query getLotteries {
      lotteries(first: 100, orderDirection: desc, orderBy: block) {
        id
        totalUsers
        totalTickets
        winningTickets
        status
        finalNumber
        startTime
        endTime
        ticketPrice
      }
    }
  `

  try {
    const response = await request(subgraph_endpoint, query)
    return response.lotteries
  } catch (error) {
    console.error(error)
    return []
  }
}

const getLotteriesData = async (currentLotteryId: string): Promise<LotteryRoundGraphEntity[]> => {
  const idsForNodesCall = getRoundIdsArray(currentLotteryId)
  const nodeData = await fetchMultipleLotteries(idsForNodesCall)
  const graphResponse = await getGraphLotteries()
  const mergedData = applyNodeDataToLotteriesGraphResponse(nodeData, graphResponse)
  return mergedData
}

export default getLotteriesData
