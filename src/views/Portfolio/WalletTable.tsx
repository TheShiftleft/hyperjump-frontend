import { Flex, Text, Heading, Card, Skeleton } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'
import PageHeader from 'components/PageHeader'
import { useGetTokensList } from 'hooks/portfolio'
import styled from 'styled-components'
import { SubHeader } from 'uikit/components/SubHeader'
import { Dots } from 'components/swap/styleds'
import TokenRow from './TokenRow'
import AssetRow from './AssetRow'

const NoTokenBox = styled(Card)`
  padding: 50px;

  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
  justify-content: center;
  background-color: transparent;
  border-radius: 50px;
  align-items: center;
`
const NetWorthBox = styled(Card)`
  padding: 30px;
  flex-direction: column;
  display: flex;
  margin-bottom: 20px;
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  align-items: center;

  &::after {
    content: '';
    background-image: url('/images/dashboard/treasure.png');
    background-repeat: no-repeat;
    background-size: 120px 120px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: right 20px bottom 15px;
    position: absolute;
    z-index: -1;
  }
`
const NetWorthHeading = styled(Heading)`
  margin-bottom: 4px;
  align-items: center;
  line-height: 1.25;
  font-weight: 900;
  font-size: 40px;
  position: relative;
`

const WalletTableContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 48px;
  padding-right: 48px;
  @media (min-width: 620px) {
    padding-left: 48px;
    padding-right: 48px;
  }

  max-width: 1094px;
`

const Table = styled.div`
  margin-bottom: 30px;
  height: 600px;
  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 136px;
    -moz-column-gap: 136px;
    column-gap: 136px;
    padding-bottom: 16px;
  }
  media (min-width: 620px) {
    grid-gap: 48px;
    gap: 48px;
  }
  grid-gap: 24px;
  gap: 24px;
  padding-top: 24px;
  padding-bottom: 24px;
  display: grid;
  position: relative;
  overflow: scroll;
`

const ColumnTable = styled.div`
  display: block;
  overflow: inherit;
`

const TableLine = styled.div`
  @media (min-width: 900px) {
    width: 2px;
    height: 100%;
    left: 50%;
    top: 0;
    position: absolute;
  }
  display: block;
  background-color: ${({ theme }) => theme.colors.primary};
`

const WalletTableHeading = styled(Heading)`
  margin-bottom: 12px;
  display: flex;
  text-align: justify;
  align-items: center;
  font-size: 30px;
`
const NoAvailText = styled(Text)`
  font-size: 30px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`

const WalletTable: React.FC = () => {
  const { account } = useWeb3React()

  const { data, isLoading } = useGetTokensList(account)
  const usertokens = data

  let totalVolume = 0

  usertokens.forEach(async (token) => {
    if (Number.isNaN(token.volume)) {
      token.volume = 0
    }
    totalVolume += token.volume
  })

  return (
    <WalletTableContainer>
      <PageHeader>
        <NetWorthBox>
          <NetWorthHeading>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
              totalVolume || 0,
            )}
          </NetWorthHeading>
          <Text color="primary">Net Worth</Text>
        </NetWorthBox>

        <WalletTableHeading>
          <SubHeader color="primary" ml="5px" mr="5px">
            DeFi
          </SubHeader>
          Investments
        </WalletTableHeading>
      </PageHeader>

      {!isLoading && usertokens?.length > 0 ? (
        <Table>
          <ColumnTable>
            <Flex flexDirection="column" alignItems="center">
              <WalletTableHeading>Wallet</WalletTableHeading>
            </Flex>
            {usertokens.map((token) => (
              <TokenRow key={token.tokenObj.name} token={token} />
            ))}
          </ColumnTable>
          <TableLine />
          <ColumnTable>
            <Flex flexDirection="column" alignItems="center">
              <WalletTableHeading>Asset Allocation</WalletTableHeading>
            </Flex>
            {usertokens.map((token) => (
              <AssetRow key={token.tokenObj.name} token={token} totalvolume={totalVolume} />
            ))}
          </ColumnTable>
        </Table>
      ) : (
        <NoTokenBox>
          <WalletTableHeading>
            <NoAvailText>
              <Dots>Loading Available Tokens</Dots>
            </NoAvailText>
          </WalletTableHeading>
        </NoTokenBox>
      )}
    </WalletTableContainer>
  )
}

export default WalletTable
