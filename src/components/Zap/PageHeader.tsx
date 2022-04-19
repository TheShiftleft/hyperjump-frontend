import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, ButtonMenuItem, ChartIcon } from 'uikit'

interface PageHeaderProps {
    title: string
    description: string
    zapToPool: boolean
    setZapToPool?:(value: boolean) => void,
    isZap?: boolean
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
const TextContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  cursor: pointer;
  border-bottom: 2px solid  ${({ theme }) => theme.colors.primary};
`

const PageHeader = ({ title, description, zapToPool = false, setZapToPool, isZap } : PageHeaderProps) => {

    return(
        <StyledPageHeader>
            <Flex alignItems="center">
                <Details>
                    <Flex mb="8px">
                        <TextContainer 
                            style={ !zapToPool ? {} : {border: "none"}} 
                            onClick={() => {
                                setZapToPool(false)
                            }}
                        >
                            <Text color="primary" bold>
                                {isZap ? 'Zap' : 'Warp'}
                            </Text>
                        </TextContainer>
                        <TextContainer 
                            style={ !zapToPool ? {border: "none"} : {}} 
                            onClick={() => {
                                setZapToPool(true)
                            }}
                        >
                            <Text color="primary" bold>
                                {isZap ? 'Zap Into Pools' : 'Warp Into Pools'}
                            </Text>
                        </TextContainer>
                    </Flex>
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