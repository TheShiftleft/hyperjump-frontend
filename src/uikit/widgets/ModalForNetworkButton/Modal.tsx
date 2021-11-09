import React from 'react'
import styled from 'styled-components'
import Text from '../../components/Text/Text'
import Flex from '../../components/Flex/Flex'
import { ArrowBackIcon, CloseIcon } from '../../components/Svg'
import { IconButton } from '../../components/Button'
import { InjectedProps } from './types'

interface Props extends InjectedProps {
  title: string
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
}

const StyledModal = styled.div`
padding: 24px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: auto;
    min-width: 10px;
    max-width: 100%;
  },

`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 0px;
`

const ModalTitle = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex: 1;
`

const ModalStyledTitle = styled(Text)`
  font-family: Oswald;
  color: #44c4e2;
`

const Modal: React.FC<Props> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = true,
  bodyPadding = '16px',
}) => (
  <StyledModal>
    <ModalHeader>
      <ModalTitle>
        {onBack && (
          <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
            <ArrowBackIcon color="primary" />
          </IconButton>
        )}
        <ModalStyledTitle color="primary" fontSize="16px" bold>
          {title}
        </ModalStyledTitle>
      </ModalTitle>
      {!hideCloseButton && (
        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="primary" />
        </IconButton>
      )}
    </ModalHeader>
    <Flex flexDirection="column" justifyContent="center" alignItems="center" p={bodyPadding}>
      {children}
    </Flex>
  </StyledModal>
)

export default Modal
