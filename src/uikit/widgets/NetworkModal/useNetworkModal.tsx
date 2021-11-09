import React from 'react'
import { useModal } from '../Modal'
import NetworkModal from './NetworkModal'

interface ReturnType {
  onPresentNetworkModal: () => void
}

const useNetworkModal = (): ReturnType => {
  const [onPresentNetworkModal] = useModal(<NetworkModal />)
  return { onPresentNetworkModal }
}

export default useNetworkModal
