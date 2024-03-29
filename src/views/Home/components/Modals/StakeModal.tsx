import React, { useEffect, useState } from 'react'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from 'uikit'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import PercentageButton from './PercentageButton'
import getNetwork from '../../../../utils/getNetwork'

interface StakeModalProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
}

const StakeModal: React.FC<StakeModalProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { config } = getNetwork()
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool
  const { onStake } = useSousStake(sousId, false)
  const { onUnstake } = useSousUnstake(sousId, pool.enableEmergencyWithdraw)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance
  }

  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
    }
  }, [stakeAmount, stakingLimit, userData, stakingToken, isRemovingStake, setHasReachedStakedLimit])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingToken.decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        await onUnstake(stakeAmount, stakingToken.decimals)
        toastSuccess('Unstaked!', `Your ${earningToken.symbol} earnings have also been harvested to your wallet!`)
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError('Canceled', 'Please try again and confirm the transaction.')
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await onStake(stakeAmount, stakingToken.decimals)
        toastSuccess('Staked!', `Your ${stakingToken.symbol} funds have been staked in the pool!`)
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError('Canceled', 'Please try again and confirm the transaction.')
        setPendingTx(false)
      }
    }
  }

  const chain_id = config.id
  const stakingTokenImg = stakingToken?.address[chain_id]

  return (
    <Modal title={isRemovingStake ? 'Unstake' : 'Stake in Pool'} onDismiss={onDismiss}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? 'Unstake' : 'Stake'}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingTokenImg}.png`} width={24} height={24} alt={stakingToken.symbol} />
          <Text ml="4px" bold>
            {stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit}
        decimals={stakingToken.decimals}
      />
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {`Balance: ${getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals)}`}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>Max</PercentageButton>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit}
        mt="24px"
      >
        {pendingTx ? 'Confirming' : 'Confirm'}
      </Button>
    </Modal>
  )
}

export default StakeModal
