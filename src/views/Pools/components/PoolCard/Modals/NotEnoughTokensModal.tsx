import React from 'react'

import { Modal, Text, Button } from 'uikit'
import getNetwork from 'utils/getNetwork'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { config } = getNetwork()

  return (
    <Modal title={`${tokenSymbol}  required`} onDismiss={onDismiss}>
      <Text color="failure" bold>
        Insufficient {tokenSymbol} balance
      </Text>
      <Text mt="24px">{`You need more tokens to stake in this ${tokenSymbol} pool!`}</Text>
      <Text>{`Buy some ${config.farmingToken.symbol}`}</Text>
      <Button variant="text" onClick={onDismiss}>
        Close Window
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
