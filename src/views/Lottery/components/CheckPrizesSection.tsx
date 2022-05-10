import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Flex, useModal, AutoRenewIcon } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'

import useAuth from 'hooks/useAuth'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import UserBlock from 'uikit/widgets/Menu/components/UserBlock'
import ClaimPrizesModal from './ClaimPrizesModal'
import useGetUnclaimedRewards, { FetchStatus } from '../hooks/useGetUnclaimedRewards'

const ClaimPrizeFlex = styled(Flex)`
  border-top: 5px solid #44c4e2;
  border-bottom: 5px solid #44c4e2;
  padding: 20px 32px;
  margin: 0 16px;
  flex-direction: column;
  align-items: center;
  min-width: none;

  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 260px;
  }
`

const HeadingContainer = styled.div`
  white-space: nowrap;
  margin: 0 20px;
  > * {
    display: inline-block;
  }
  font-size: 24px;
`

const Highlight = styled.span`
  text-align: left;
  font-size: 48px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  line-height: 1.1;
  color: #49ceeb;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 64px;
  }
`

const CheckPrizesSection = () => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const {
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const { fetchAllRewards, unclaimedRewards, fetchStatus } = useGetUnclaimedRewards()
  const userLotteryData = useGetUserLotteriesGraphData()
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={unclaimedRewards} />, false)
  const isFetchingRewards = fetchStatus === FetchStatus.IN_PROGRESS
  const lotteryIsNotClaimable = status === LotteryStatus.CLOSE
  const isCheckNowDisabled = !userLotteryData.account || lotteryIsNotClaimable

  useEffect(() => {
    if (fetchStatus === FetchStatus.SUCCESS) {
      // Manage showing unclaimed rewards modal once per page load / once per lottery state change
      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(true)
        setHasCheckedForRewards(true)
        onPresentClaimModal()
      }

      if (unclaimedRewards.length === 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(false)
        setHasCheckedForRewards(true)
      }
    }
  }, [unclaimedRewards, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change, or when lottery isTransitioning state changes
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account, isTransitioning])

  const getBody = () => {
    if (!account) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <ClaimPrizeFlex>
            <HeadingContainer>
              <Heading scale="xxl">{'are you a '}</Heading>
              <Highlight>&nbsp;winner &nbsp;</Highlight>
              <Heading scale="xxl">???</Heading>
            </HeadingContainer>
            <Heading scale="xl" textAlign="center" color="#F4EEFF" mb="24px">
              Connect your wallet to find out
            </Heading>
            <UserBlock account={account} login={login} logout={logout} />
          </ClaimPrizeFlex>
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <ClaimPrizeFlex>
            <Heading scale="xxl" textAlign="center" color="#F4EEFF">
              No prizes to collect...
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              Better luck next time!
            </Heading>
          </ClaimPrizeFlex>
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <ClaimPrizeFlex>
            <Highlight>Congratulations!</Highlight>

            <Heading textAlign="center" color="#F4EEFF">
              Why not play again
            </Heading>
          </ClaimPrizeFlex>
        </Flex>
      )
    }
    const checkNowText = () => {
      if (lotteryIsNotClaimable) {
        return 'Calculating rewards...'
      }
      if (isFetchingRewards) {
        return 'Checking'
      }
      return 'Check Now'
    }
    return (
      <Flex alignItems="center" justifyContent="center">
        <ClaimPrizeFlex>
          <HeadingContainer>
            <Heading scale="xxl">{'are you a '}</Heading>
            <Highlight>&nbsp;winner&nbsp;</Highlight>
            <Heading scale="xxl">???</Heading>
          </HeadingContainer>
          <Button
            disabled={isCheckNowDisabled}
            onClick={fetchAllRewards}
            isLoading={isFetchingRewards}
            endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}
          >
            {checkNowText()}
          </Button>
        </ClaimPrizeFlex>
      </Flex>
    )
  }

  return <Flex>{getBody()}</Flex>
}

export default CheckPrizesSection
