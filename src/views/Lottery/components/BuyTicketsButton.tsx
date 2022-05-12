import React from 'react'
import { Button, useModal, WaitIcon, ButtonProps } from 'uikit'
import { useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import BuyTicketsModal from './BuyTicketsModal/BuyTicketsModal'

interface BuyTicketsButtonProps extends ButtonProps {
  disabled?: boolean
}

const BuyTicketsButton: React.FC<BuyTicketsButtonProps> = ({ disabled, ...props }) => {
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const {
    currentRound: { status },
  } = useLottery()

  const getBuyButtonText = () => {
    if (status === LotteryStatus.OPEN) {
      return 'Buy Tickets'
    }
    return (
      <>
        <WaitIcon mr="4px" color="textDisabled" /> On sale soon!
      </>
    )
  }

  return (
    <Button {...props} disabled={disabled} onClick={onPresentBuyTicketsModal}>
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
