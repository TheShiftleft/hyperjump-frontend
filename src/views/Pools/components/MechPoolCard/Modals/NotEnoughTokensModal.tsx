import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Modal, Text, Button } from 'uikit'
import getNetwork from 'utils/getNetwork'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { config } = getNetwork()

  return (
    <Modal
      title={t('%symbol%s required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
    >
      <Text color="failure" bold>
        {t('Insufficient %symbol% balance', { symbol: tokenSymbol })}
      </Text>
      <Text mt="24px">{t('You need to assemble some MECHs to stake in this pool!', { symbol: tokenSymbol })}</Text>
      <Text>
        {t(`Buy some ${config.farmingToken.symbol} and assemble MECHs, or make sure your MECHSs aren't in another pool or LP.`, {
          symbol: tokenSymbol,
        })}
      </Text>
      <Button variant="text" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
