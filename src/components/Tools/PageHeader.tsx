import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, ButtonMenuItem, ChartIcon } from 'uikit'

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

const TextContainer = styled.div`
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
      <Flex>
        <TextContainer>
          <Text color="primary" bold>
              UnRekt
          </Text>
        </TextContainer>
      </Flex>
      <Flex alignItems="center">
        <Details>
          {type.toLowerCase() !== "swap" &&
            <Heading mb="8px" color="primary">
              {title}
            </Heading>
          }
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