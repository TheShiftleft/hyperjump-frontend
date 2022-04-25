import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, AutoRenewIcon, Won } from 'uikit'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import getNetwork from 'utils/getNetwork'
import { getBalanceAmount } from 'utils/formatBalance'
import { callWithEstimateGas } from 'utils/calls'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserLotteries } from 'state/lottery'
import { useAppDispatch } from 'state'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useLotteryContract } from 'hooks/useContract'

const { config } = getNetwork()
const rewardToken = config.farmingToken.symbol

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<ClaimInnerProps> = ({ onSuccess, roundsToClaim }) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { maxNumberTicketsPerBuyOrClaim, currentLotteryId } = useLottery()
  const { toastSuccess, toastError } = useToast()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingBatchClaims, setPendingBatchClaims] = useState(
    Math.ceil(
      roundsToClaim[activeClaimIndex].ticketsWithUnclaimedRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber(),
    ),
  )
  const lotteryContract = useLotteryContract()
  const activeClaimData = roundsToClaim[activeClaimIndex]

  const farmingTokenPriceUsd = usePriceFarmingTokenUsd()
  const farmingTokenReward = activeClaimData.farmingTokenTotal
  const dollarReward = farmingTokenReward.times(farmingTokenPriceUsd)
  const rewardAsBalance = getBalanceAmount(farmingTokenReward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()

  const parseUnclaimedTicketDataForClaimCall = (ticketsWithUnclaimedRewards: LotteryTicket[], lotteryId: string) => {
    const ticketIds = ticketsWithUnclaimedRewards.map((ticket) => {
      return ticket.id
    })
    const brackets = ticketsWithUnclaimedRewards.map((ticket) => {
      return ticket.rewardBracket
    })
    return { lotteryId, ticketIds, brackets }
  }

  const claimTicketsCallData = parseUnclaimedTicketDataForClaimCall(
    activeClaimData.ticketsWithUnclaimedRewards,
    activeClaimData.roundId,
  )

  const shouldBatchRequest = maxNumberTicketsPerBuyOrClaim.lt(claimTicketsCallData.ticketIds.length)

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      dispatch(fetchUserLotteries({ account, currentLotteryId }))
    } else {
      onSuccess()
    }
  }

  const getTicketBatches = (ticketIds: string[], brackets: number[]): { ticketIds: string[]; brackets: number[] }[] => {
    const requests = []
    const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

    for (let i = 0; i < ticketIds.length; i += maxAsNumber) {
      const ticketIdsSlice = ticketIds.slice(i, maxAsNumber + i)
      const bracketsSlice = brackets.slice(i, maxAsNumber + i)
      requests.push({ ticketIds: ticketIdsSlice, brackets: bracketsSlice })
    }

    return requests
  }

  const handleClaim = async () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    setPendingTx(true)
    try {
      const tx = await callWithEstimateGas(lotteryContract, 'claimTickets', [lotteryId, ticketIds, brackets])
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(
          'Prizes Collected!',
          `Your ${rewardToken} prizes for round ${lotteryId} have been sent to your wallet`,
        )
        setPendingTx(false)
        handleProgressToNextClaim()
      }
    } catch (error) {
      console.error(error)
      toastError('Error', `${error.message} - Please try again.`)
      setPendingTx(false)
    }
  }

  const handleBatchClaim = async () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    const ticketBatches = getTicketBatches(ticketIds, brackets)
    const transactionsToFire = ticketBatches.length
    const receipts = []
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const ticketBatch of ticketBatches) {
      try {
        /* eslint-disable no-await-in-loop */
        const tx = await callWithEstimateGas(lotteryContract, 'claimTickets', [
          lotteryId,
          ticketBatch.ticketIds,
          ticketBatch.brackets,
        ])
        const receipt = await tx.wait()
        /* eslint-enable no-await-in-loop */
        if (receipt.status) {
          // One transaction within batch has succeeded
          receipts.push(receipt)
          setPendingBatchClaims(transactionsToFire - receipts.length)

          // More transactions are to be done within the batch. Issue toast to give user feedback.
          if (receipts.length !== transactionsToFire) {
            toastSuccess(
              'Prizes Collected!',

              `Claim ${receipts.length} of ${transactionsToFire} for round ${lotteryId} was successful. Please confirm the next transation`,
            )
          }
        }
      } catch (error) {
        console.error(error)
        setPendingTx(false)
        toastError('Error', `${error.message} - Please try again.`)
        break
      }
    }

    // Batch is finished
    if (receipts.length === transactionsToFire) {
      setPendingTx(false)
      toastSuccess(
        'Prizes Collected!',
        `Your ${rewardToken} prizes for round ${lotteryId} have been sent to your wallet`,
      )
      handleProgressToNextClaim()
    }
  }

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="4px" textAlign={['center', null, 'left']}>
          You won
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={rewardAsBalance}
            fontSize="44px"
            bold
            color="primary"
            unit={rewardToken}
          />
          <Won ml={['0', null, '12px']} width="64px" />
        </Flex>
        <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={dollarRewardAsBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        />
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          Round #{activeClaimData.roundId}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => (shouldBatchRequest ? handleBatchClaim() : handleClaim())}
        >
          {pendingTx ? 'Claiming' : 'Claim'} {pendingBatchClaims > 1 ? `(${pendingBatchClaims})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
