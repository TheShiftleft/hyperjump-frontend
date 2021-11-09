import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon, Button } from 'uikit'
import useI18n from 'hooks/useI18n'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

//  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
const StyledPageHeader = styled.div`
  padding: 0 10px;
`

const SwapHeading = styled(Heading)`
  font-size: 30px;
`

const Details = styled.div`
  flex: 1;
`

const AddButton = styled(Button)`
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
`

const IconImg = styled.img`
  width: 35px;
  overflow: hidden;
`

const PoolHeader = ({ title, description, children }: PageHeaderProps) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Flex justifyContent="space-between" alignItems="center" flex="1" pl="50px" pr="20px">
          <Heading>{TranslateString(168, 'Your Liquidity')}</Heading>
          <Link to="/add" >
            <AddButton>
            <Heading color="textDisabled">
              {TranslateString(168, 'Add Liquidity')}
            </Heading>
            </AddButton>
          </Link>
        </Flex>
        <IconButton
          variant="text"
          onClick={onPresentRecentTransactions}
          title={TranslateString(1202, 'Recent transactions')}
        >
          <IconImg src="images/swap/Transactions.png" />
        </IconButton>
        {children && <Text mt="16px">{children}</Text>}
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PoolHeader
