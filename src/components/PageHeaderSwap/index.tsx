import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, ButtonMenuItem, ChartIcon } from 'uikit'
import useI18n from 'hooks/useI18n'
import useWindowDimensions from 'hooks/useWindowDimension'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  type?: string,
  marketSelect?: boolean,
  setMarketSelected?:(input: boolean) => void,
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  setShowChart?: (showChart: boolean) => void
  showChart?: boolean
}

//  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
const StyledPageHeader = styled.div`
  padding: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  cursor: pointer;
  border-bottom: 2px solid  ${({ theme }) => theme.colors.primary};
`
const SwapHeading = styled(Heading)`
  font-size: 30px;
`

const Details = styled.div`
  flex: 1;
`

const PageHeader = ({type = "", marketSelect, setMarketSelected, title, description, children, setShowChart, showChart }: PageHeaderProps) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)
  return (
    <StyledPageHeader>
      {type.toLowerCase() === "swap" && 
        <Flex>
          <TextContainer style={ marketSelect ? {} : {border: "none"}} onClick={() => {
            setMarketSelected(true)
          }}>
            <Text color="primary" bold>
                Market
            </Text>
          </TextContainer>
          <TextContainer style={ marketSelect ? {border: "none"} : {}} onClick={() => {
            setMarketSelected(false)
          }}>
            <Text color="primary" bold>
                Limit Orders
            </Text>
          </TextContainer>
        </Flex>
      }
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
        {
          title !== "Vortex Bridge" &&
          <>
          <IconButton 
            variant="text" 
            onClick={() => {
                setShowChart(!showChart)
              }
            } 
            title={TranslateString(1200, 'Toggle display chart')}>
            <ChartIcon width="24px" color={showChart ? 'gray' : 'currentColor'} />
          </IconButton>
          <IconButton variant="text" onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
            <TuneIcon width="24px" color="currentColor" />
          </IconButton>
            <IconButton
              variant="text"
              onClick={onPresentRecentTransactions}
              title={TranslateString(1202, 'Recent transactions')}
            >
              <HistoryIcon width="24px" color="currentColor" />
            </IconButton>
          </>
        }

      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
