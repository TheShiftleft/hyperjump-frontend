import React from 'react'
import { Button, ButtonProps, useWalletModal } from 'uikit'
import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const { label } = props
  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {label ? TranslateString(292, 'Bridge to Fantom') : TranslateString(292, 'Unlock Wallet')}
      {/* {TranslateString(292, 'Bridge to Fantom')} */}
    </Button>
  )
}

export default UnlockButton
