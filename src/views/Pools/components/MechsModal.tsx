import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

interface MechsModalProps {
  max: BigNumber
  title: string
  onConfirm: (amount: string, decimals?: number) => Promise<void>
  onDismiss?: () => void
  tokenName: string
}

const MechsModal: React.FC<MechsModalProps> = ({ max, title, onConfirm, onDismiss, tokenName }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={title} onDismiss={onDismiss} hideCloseButton>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button onClick={onDismiss} style={{ height: '70px', borderRadius: '20px' }}>
          Cancel
        </Button>
        <Button
          style={{ height: '70px', borderRadius: '20px' }}
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? 'Pending Confirmation' : 'Confirm'}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default MechsModal
