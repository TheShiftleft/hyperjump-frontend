import { Currency } from '@hyperjump-defi/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import useLast from '../../hooks/useLast'
import { useSelectedListUrl } from '../../state/lists/hooks'
import Modal from '../Modal'
import { NetworkSearch } from './NetworkSearch'
import { ListSelect } from './ListSelect'
import { BridgeNetwork } from './types'

interface NetworkSelectionModalProps {
  isOpen: boolean
  onDismiss: () => void
  isOrigin: boolean
  selectedNetwork?: BridgeNetwork | null
  onNetworkSelect: (bridgeNetwork: BridgeNetwork) => void
  // eslint-disable-next-line react/no-unused-prop-types
}



export default function NetworkSelectionModal({
  isOpen,
  onDismiss,
  isOrigin,
  onNetworkSelect,
  selectedNetwork,
}: NetworkSelectionModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleNetworkSelect = useCallback(
    (bridgeNetwork: BridgeNetwork) => {
      onNetworkSelect(bridgeNetwork)
      onDismiss()
    },
    [onDismiss, onNetworkSelect]
  )

  const handleClickChangeList = useCallback(() => {
    setListView(true)
  }, [])
  const handleClickBack = useCallback(() => {
    setListView(false)
  }, [])

  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={listView ? 40 : noListSelected ? 0 : 40}>
      {listView ? (
        <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
      ) : noListSelected ? (
        <NetworkSearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          isOrigin={isOrigin}
          onNetworkSelect={handleNetworkSelect}
          onChangeList={handleClickChangeList}
          selectedNetwork={selectedNetwork}
        />
      ) : (
        <NetworkSearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          isOrigin={isOrigin}
          onNetworkSelect={handleNetworkSelect}
          onChangeList={handleClickChangeList}
          selectedNetwork={selectedNetwork}
        />
      )}
    </Modal>
  )
}
