import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, ButtonMenuItem, ChartIcon } from 'uikit'

interface PageHeaderProps {
    title: string
    description: string
}

const StyledPageHeader = styled.div`
  padding: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const Details = styled.div`
  flex: 1;
`

const PageHeader = ({ title, description } : PageHeaderProps) => {

    return(
        <StyledPageHeader>
            <Flex alignItems="center">
                <Details>
                    <Heading mb="8px" color="primary">
                    {title}
                    </Heading>
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