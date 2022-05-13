import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Modal, Text, Flex, HelpIcon, BalanceInput, Ticket, Skeleton, Button, ArrowForwardIcon } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getFarmingTokenAddress } from 'utils/addressHelpers'
import { BIG_ZERO, ethersToBigNumber } from 'utils/bigNumber'
import { useAppDispatch } from 'state'
import { usePriceFarmingTokenUsd } from 'state/hooks'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserTicketsAndLotteries } from 'state/lottery'
import getNetwork from 'utils/getNetwork'
import useTheme from 'hooks/useTheme'
import useTokenBalance, { FetchStatus } from 'hooks/useTokenBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useFarmingTokenContract, useLotteryContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useAuth from 'hooks/useAuth'
import UserBlock from 'uikit/widgets/Menu/components/UserBlock'
import { getGasPriceOptions } from 'utils/callHelpers'
import ApproveConfirmButtons, { ButtonArrangement } from './ApproveConfirmButtons'
import NumTicketsToBuyButton from './NumTicketsToBuyButton'
import EditNumbersModal from './EditNumbersModal'
import { useTicketsReducer } from './useTicketsReducer'

const { config } = getNetwork()
const rewardToken = ` ${config.farmingToken.symbol}`

const StyledModal = styled(Modal)`
  min-width: 280px;
  max-width: 320px;
`

const ShortcutButtonsWrapper = styled(Flex)<{ isVisible: boolean }>`
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 24px;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
`

interface BuyTicketsModalProps {
  onDismiss?: () => void
}

enum BuyingStage {
  BUY = 'Buy',
  EDIT = 'Edit',
}

const BuyTicketsModal: React.FC<BuyTicketsModalProps> = ({ onDismiss }) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { theme } = useTheme()
  const {
    maxNumberTicketsPerBuyOrClaim,
    currentLotteryId,
    currentRound: {
      priceTicketInFarmingToken,
      userTickets: { tickets: userCurrentTickets },
    },
  } = useLottery()
  const [ticketsToBuy, setTicketsToBuy] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [buyingStage, setBuyingStage] = useState<BuyingStage>(BuyingStage.BUY)
  const [maxPossibleTicketPurchase, setMaxPossibleTicketPurchase] = useState(BIG_ZERO)
  const [maxTicketPurchaseExceeded, setMaxTicketPurchaseExceeded] = useState(false)
  const [userNotEnoughFarmingToken, setUserNotEnoughFarmingToken] = useState(false)
  const lotteryContract = useLotteryContract()
  const farmingTokenContract = useFarmingTokenContract()
  const { toastSuccess } = useToast()
  const { balance: userFarmingToken, fetchStatus } = useTokenBalance(getFarmingTokenAddress())
  // balance from useTokenBalance causes rerenders in effects as a new BigNumber is instanciated on each render, hence memoising it using the stringified value below.
  const stringifiedUserFarmingToken = userFarmingToken.toJSON()
  const memoisedUserFarmingToken = useMemo(
    () => new BigNumber(stringifiedUserFarmingToken),
    [stringifiedUserFarmingToken],
  )
  const farmingTokenPriceBusd = usePriceFarmingTokenUsd()
  const dispatch = useAppDispatch()
  const hasFetchedBalance = fetchStatus === FetchStatus.SUCCESS
  const userFarmingTokenDisplayBalance = getFullDisplayBalance(userFarmingToken, 18, 3)

  const limitNumberByMaxTicketsPerBuy = useCallback(
    (number: BigNumber) => {
      return number.gt(maxNumberTicketsPerBuyOrClaim) ? maxNumberTicketsPerBuyOrClaim : number
    },
    [maxNumberTicketsPerBuyOrClaim],
  )

  const validateInput = useCallback(
    (inputNumber: BigNumber) => {
      const limitedNumberTickets = limitNumberByMaxTicketsPerBuy(inputNumber)
      const farmingTokenCost = priceTicketInFarmingToken.times(limitedNumberTickets)

      if (farmingTokenCost.gt(userFarmingToken)) {
        setUserNotEnoughFarmingToken(true)
      } else if (limitedNumberTickets.eq(maxNumberTicketsPerBuyOrClaim)) {
        setMaxTicketPurchaseExceeded(true)
      } else {
        setUserNotEnoughFarmingToken(false)
        setMaxTicketPurchaseExceeded(false)
      }
    },
    [limitNumberByMaxTicketsPerBuy, maxNumberTicketsPerBuyOrClaim, userFarmingToken, priceTicketInFarmingToken],
  )

  useEffect(() => {
    const getMaxPossiblePurchase = () => {
      const maxBalancePurchase = memoisedUserFarmingToken.div(priceTicketInFarmingToken)
      const maxPurchase = limitNumberByMaxTicketsPerBuy(maxBalancePurchase)

      if (hasFetchedBalance && maxPurchase.lt(1)) {
        setUserNotEnoughFarmingToken(true)
      } else {
        setUserNotEnoughFarmingToken(false)
      }

      setMaxPossibleTicketPurchase(maxPurchase)
    }
    getMaxPossiblePurchase()
  }, [
    maxNumberTicketsPerBuyOrClaim,
    priceTicketInFarmingToken,
    memoisedUserFarmingToken,
    limitNumberByMaxTicketsPerBuy,
    hasFetchedBalance,
  ])

  useEffect(() => {
    const numberOfTicketsToBuy = new BigNumber(ticketsToBuy)
    const ticketCost = priceTicketInFarmingToken.times(numberOfTicketsToBuy)
    setTotalCost(ticketCost.gt(0) ? getFullDisplayBalance(ticketCost) : '0')
  }, [ticketsToBuy, priceTicketInFarmingToken])

  const getNumTicketsByPercentage = (percentage: number): number => {
    const percentageOfMaxTickets = maxPossibleTicketPurchase.gt(0)
      ? maxPossibleTicketPurchase.div(new BigNumber(100)).times(new BigNumber(percentage))
      : BIG_ZERO
    return Math.floor(percentageOfMaxTickets.toNumber())
  }

  const tenPercentOfBalance = getNumTicketsByPercentage(10)
  const twentyFivePercentOfBalance = getNumTicketsByPercentage(25)
  const fiftyPercentOfBalance = getNumTicketsByPercentage(50)
  const oneHundredPercentOfBalance = getNumTicketsByPercentage(100)

  const handleInputChange = (input: string) => {
    // Force input to integer
    const inputAsInt = parseInt(input, 10)
    const inputAsBN = new BigNumber(inputAsInt)
    const limitedNumberTickets = limitNumberByMaxTicketsPerBuy(inputAsBN)
    validateInput(inputAsBN)
    setTicketsToBuy(inputAsInt ? limitedNumberTickets.toString() : '')
  }

  const handleNumberButtonClick = (number: number) => {
    setTicketsToBuy(number.toFixed())
    setUserNotEnoughFarmingToken(false)
    setMaxTicketPurchaseExceeded(false)
  }

  const [updateTicket, randomize, tickets, allComplete, getTicketsForPurchase] = useTicketsReducer(
    parseInt(ticketsToBuy, 10),
    userCurrentTickets,
  )

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await farmingTokenContract.methods.allowance(account, lotteryContract.address).call()
          const currentAllowance = ethersToBigNumber(response)
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: async () => {
        const gasOptions = await getGasPriceOptions()
        return farmingTokenContract.methods
          .approve(lotteryContract.address, ethers.constants.MaxInt256.toString())
          .send({ from: account, ...gasOptions })
      },
      onApproveSuccess: async () => {
        toastSuccess('Contract approved - you can now purchase tickets')
      },
      onConfirm: () => {
        const ticketsForPurchase = getTicketsForPurchase()
        // console.log('Purchasing Tickets', ticketsForPurchase)
        return lotteryContract.buyTickets(currentLotteryId, ticketsForPurchase)
      },
      onSuccess: async () => {
        onDismiss()
        dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
        toastSuccess('Lottery tickets purchased!')
      },
    })

  // console.log('ISAPPROVED', isApproved)

  const getErrorMessage = () => {
    if (userNotEnoughFarmingToken) return `Insufficient ${rewardToken} balance`
    return `The maximum number of tickets you can buy in one transaction is ${maxNumberTicketsPerBuyOrClaim.toString()}`
  }

  const disableBuying =
    !isApproved ||
    isConfirmed ||
    userNotEnoughFarmingToken ||
    !ticketsToBuy ||
    new BigNumber(ticketsToBuy).lte(0) ||
    getTicketsForPurchase().length !== parseInt(ticketsToBuy, 10)

  if (buyingStage === BuyingStage.EDIT) {
    return (
      <EditNumbersModal
        totalCost={totalCost}
        updateTicket={updateTicket}
        randomize={randomize}
        tickets={tickets}
        allComplete={allComplete}
        onConfirm={handleConfirm}
        isConfirming={isConfirming}
        onDismiss={() => setBuyingStage(BuyingStage.BUY)}
      />
    )
  }

  return (
    <StyledModal title="Buy Tickets" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle">Buy:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Text mr="4px" bold>
            Tickets
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        isWarning={userNotEnoughFarmingToken || maxTicketPurchaseExceeded}
        placeholder="0"
        value={ticketsToBuy}
        onUserInput={handleInputChange}
        /*  currencyValue={
          farmingTokenPriceBusd.gt(0) &&
          `~${
            ticketsToBuy ? getFullDisplayBalance(priceTicketInFarmingToken.times(new BigNumber(ticketsToBuy))) : '0.00'
          } ${rewardToken}`
        } */
      />
      <Flex alignItems="center" justifyContent="flex-end" mt="4px" mb="12px">
        <Flex justifyContent="flex-end" flexDirection="column">
          {(userNotEnoughFarmingToken || maxTicketPurchaseExceeded) && (
            <Text fontSize="12px" color="failure">
              {getErrorMessage()}
            </Text>
          )}
          <Flex justifyContent="flex-end">
            <Text fontSize="12px" color="textSubtle" mr="4px">
              {rewardToken} Balance:
            </Text>
            {hasFetchedBalance ? (
              <Text fontSize="12px" color="textSubtle">
                {userFarmingTokenDisplayBalance}
              </Text>
            ) : (
              <Skeleton width={50} height={12} />
            )}
          </Flex>
        </Flex>
      </Flex>

      {!hasFetchedBalance ? (
        <Skeleton width="100%" height={20} mt="8px" mb="24px" />
      ) : (
        <ShortcutButtonsWrapper isVisible={hasFetchedBalance && oneHundredPercentOfBalance >= 1}>
          {tenPercentOfBalance >= 1 && (
            <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(tenPercentOfBalance)}>
              {hasFetchedBalance ? tenPercentOfBalance : ``}
            </NumTicketsToBuyButton>
          )}
          {twentyFivePercentOfBalance >= 1 && (
            <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(twentyFivePercentOfBalance)}>
              {hasFetchedBalance ? twentyFivePercentOfBalance : ``}
            </NumTicketsToBuyButton>
          )}
          {fiftyPercentOfBalance >= 1 && (
            <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(fiftyPercentOfBalance)}>
              {hasFetchedBalance ? fiftyPercentOfBalance : ``}
            </NumTicketsToBuyButton>
          )}
          {oneHundredPercentOfBalance >= 1 && (
            <NumTicketsToBuyButton onClick={() => handleNumberButtonClick(oneHundredPercentOfBalance)}>
              MAX
            </NumTicketsToBuyButton>
          )}
        </ShortcutButtonsWrapper>
      )}
      <Flex flexDirection="column">
        {/*  <Flex mb="8px" justifyContent="space-between">
          <Text color="textSubtle" fontSize="14px">
            {t('Cost')} ({rewardToken})
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {priceTicketInFarmingToken && getFullDisplayBalance(priceTicketInFarmingToken.times(ticketsToBuy || 0))}{' '}
            {rewardToken}
          </Text>
        </Flex> */}
        <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} pt="8px" mb="24px" justifyContent="space-between">
          <Text color="textSubtle" fontSize="16px">
            You pay
          </Text>
          <Text fontSize="16px" bold>
            {totalCost} {rewardToken}
          </Text>
        </Flex>

        {account ? (
          <>
            <ApproveConfirmButtons
              isApproveDisabled={isApproved}
              isApproving={isApproving}
              isConfirmDisabled={disableBuying}
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
              buttonArrangement={ButtonArrangement.SEQUENTIAL}
              confirmLabel="Buy Instantly"
            />
            {isApproved && (
              <Button
                id={`lottery_buy_ins_${ticketsToBuy}`}
                variant="secondary"
                mt="8px"
                disabled={disableBuying || isConfirming}
                onClick={() => {
                  setBuyingStage(BuyingStage.EDIT)
                }}
              >
                <Flex alignItems="center">
                  View/Edit Numbers{' '}
                  <ArrowForwardIcon
                    mt="2px"
                    color={disableBuying || isConfirming ? 'disabled' : 'primary'}
                    height="24px"
                    width="24px"
                  />
                </Flex>
              </Button>
            )}
          </>
        ) : (
          <UserBlock account={account} login={login} logout={logout} />
        )}

        <Text mt="24px" fontSize="12px" color="textSubtle">
          “Buy Instantly” chooses random numbers, with no duplicates among your tickets. Purchases are final.
        </Text>
      </Flex>
    </StyledModal>
  )
}

export default BuyTicketsModal
