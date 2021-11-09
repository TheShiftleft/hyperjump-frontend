import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, CloseIcon } from 'uikit'
import { AutoColumn, ColumnCenter } from '../Column'

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  background-color: rgba(13, 29, 54, 0.6);
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`
export const Section = styled(AutoColumn)`
  padding: 24px;
  background-color: rgba(13, 29, 54, 0.6);
`

export const ConfirmedIcon = styled(ColumnCenter)`
  padding: 40px 0;
`

export const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

/**
 * TODO: Remove this when modal system from the UI Kit is implemented
 */
const StyledContentHeader = styled.div`
  align-items: center;
  display: flex;

  & > ${Heading} {
    flex: 1;
  }
`

type ContentHeaderProps = {
  children: ReactNode
  onDismiss: () => void
}

export const ContentHeader = ({ children, onDismiss }: ContentHeaderProps) => (
  <StyledContentHeader>
    <Heading>{children}</Heading>
    <IconButton onClick={onDismiss} variant="text">
      <CloseIcon color="primary" />
    </IconButton>
  </StyledContentHeader>
)
