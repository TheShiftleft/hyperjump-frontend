import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../Modal'
import {SwapSearch} from './SwapSearch'

export interface OtherSwapConfig{
    name: string
    logoUrl: string
    url: string
    imageUrl: string
}
interface SwapSelectionModalProps{
    isOpen: boolean
    onDismiss: () => void
    selectedSwap: OtherSwapConfig
    onSwapSelect: (swap: OtherSwapConfig) => void
}


export default function SwapSelectionModal({
    isOpen,
    onDismiss,
    selectedSwap,
    onSwapSelect
} : SwapSelectionModalProps){

    const handleSwapSelect = useCallback(
        (swap) => {
          onSwapSelect(swap)
          onDismiss()
        },
        [onDismiss, onSwapSelect]
      )
    return (
        <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={40}>
            <SwapSearch
             isOpen={isOpen}
             onDismiss={onDismiss}
             isOrigin={false}
             onSwapSelect={handleSwapSelect}
             selectedSwap={selectedSwap}
            />
        </Modal>
    )
}