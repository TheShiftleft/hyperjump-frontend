import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, ButtonMenuItem, ChartIcon } from 'uikit'
import { Link as ReactLink } from 'react-router-dom'

interface PageHeaderProps {
  type?: string,
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  padding: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const TextContainer = styled(ReactLink)`
  display: flex;
  justify-content: center;
  padding: 0px 20px 0px 20px;
  cursor: pointer;
  border-bottom: 2px solid  ${({ theme }) => theme.colors.primary};
`

const Details = styled.div`
  flex: 1;
`

const PageHeader = ({type = '', title, description} : PageHeaderProps) => {

  return (
    <StyledPageHeader>
      <Flex mb='10px'>
        <TextContainer style={ !(type.toLowerCase() === 'unrekt') ? {border: 'none'} : {}}  as={ReactLink} to='/unrekt'>
          <Text color="primary" bold>
              UnRekt
          </Text>
        </TextContainer>
        <TextContainer style={ !(type.toLowerCase() === 'chainlist') ? {border: 'none'} : {}} as={ReactLink} to='/chainlist'>
          <Text color="primary" bold>
              Chainlist
          </Text>
        </TextContainer>
      </Flex>
      <Flex alignItems="center">
        <Details>
          {description && (
            <Text color="textSubtle" fontSize="14px">
              {description}
            </Text>
          )}
        </Details>
      </Flex>
    </StyledPageHeader>
  )
}

export default PageHeader