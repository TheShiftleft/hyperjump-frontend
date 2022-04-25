import React, { useState } from 'react'
import { Modal, Text, Button, Heading, Flex, AutoRenewIcon, ButtonMenu, ButtonMenuItem, HelpIcon } from 'uikit'
import { useSousHarvest } from 'hooks/useHarvest'
import { useSousStake } from 'hooks/useStake'
import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'

interface CollectModalProps {
  formattedBalance: string
  fullBalance: string
  earningToken: Token
  earningsDollarValue: string
  sousId: number
  isCompoundPool?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  earningsDollarValue,
  sousId,
  isCompoundPool = false,
  onDismiss,
}) => {
  const { toastSuccess, toastError } = useToast()
  const { onReward } = useSousHarvest(sousId, false)
  const { onStake } = useSousStake(sousId, false)
  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    // compounding
    if (shouldCompound) {
      try {
        await onStake(fullBalance, earningToken.decimals)
        toastSuccess('Compounded!', `Your ${earningToken.symbol} earnings have been re-invested into the pool!`)
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError('Canceled', 'Please try again and confirm the transaction.')
        setPendingTx(false)
      }
    } else {
      // harvesting
      try {
        await onReward()
        toastSuccess('Collect!', `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError('Canceled', 'Please try again and confirm the transaction.')
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal title={`${earningToken.symbol} ${isCompoundPool ? 'Collect' : 'Collect'}`} onDismiss={onDismiss}>
      {isCompoundPool && (
        <Flex justifyContent="center" alignItems="center" mb="24px">
          <ButtonMenu
            activeIndex={shouldCompound ? 0 : 1}
            scale="sm"
            variant="subtle"
            onItemClick={(index) => setShouldCompound(!index)}
          >
            <ButtonMenuItem as="button">Compound</ButtonMenuItem>
            <ButtonMenuItem as="button">Collect</ButtonMenuItem>
          </ButtonMenu>
          <Flex ml="10px">
            <HelpIcon color="textSubtle" />
          </Flex>
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>{shouldCompound ? 'Compounding' : 'Collecting'}:</Text>
        <Flex flexDirection="column">
          <Heading>
            {formattedBalance} {earningToken.symbol}
          </Heading>
          <Text fontSize="12px" color="textSubtle">{`~${earningsDollarValue || 0} USD`}</Text>
        </Flex>
      </Flex>

      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? 'Confirming' : 'Confirm'}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        Close Window
      </Button>
    </Modal>
  )
}

export default CollectModal
