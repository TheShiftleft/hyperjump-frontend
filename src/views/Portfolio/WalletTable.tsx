import { Button, Flex, Box, Text, useModal, Heading, Card } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { useGetTokensList } from 'hooks/moralis'
import React from 'react'
import styled from 'styled-components'
import { ChainId, Token } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import Container from 'components/layout/Container'
import { SubHeader } from 'uikit/components/SubHeader'
import TokenRow from './TokenRow'
import BroomModal from './BroomModal'
import WalletLogin from './WalletLogin'
import AssetRow from './AssetRow'

const ButtonBox = styled(Box)`
  text-align: center;
  margin: 50px 0;
`
const NoTokenBox = styled(Card)`
  padding: 50px;
  flex-direction: column;
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
  height: 100%;
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
`

const ColumnTable = styled.div`
  //   border-radius: ${({ theme }) => theme.radii.card};
  //   border: 2px solid ${({ theme }) => theme.colors.primary};
  //   background-color: none;
  //   border-radius: 50px;
  display: block;
  //   padding: 50px;
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
  text-align: center;
  align-items: center;

  font-size: 30px;
`

interface TokenProps {
  tokenObj: Token
  logo: string
  amount: number
  volume: number
  price: number
}

const WalletTable: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { config } = getNetwork()

  const tokens = useGetTokensList(account)

  let totalVolume = 0
  tokens.forEach((token) => {
    if (!token.tokenObj.name.includes('.')) {
      totalVolume += token.volume
    }
  })

  return (
    <WalletTableContainer>
      <PageHeader>
        <NetWorthBox>
          <NetWorthHeading>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalVolume)}
          </NetWorthHeading>
          <Text color="primary">Net Worth</Text>
        </NetWorthBox>
        {/* To change to subheader */}
        <WalletTableHeading>
          <SubHeader color="primary" ml="5px" mr="5px">
            DeFi
          </SubHeader>
          Investments
        </WalletTableHeading>
      </PageHeader>
      {tokens.length > 0 ? (
        <Table>
          <ColumnTable>
            <Flex flexDirection="column" alignItems="center">
              <WalletTableHeading>Wallet</WalletTableHeading>
            </Flex>
            {tokens
              .filter((token) => !token.tokenObj.name.includes('.'))
              .map((token) => (
                <TokenRow key={token.tokenObj.address} token={token} />
              ))}
          </ColumnTable>
          <TableLine />
          <ColumnTable>
            <Flex flexDirection="column" alignItems="center">
              <WalletTableHeading>Asset Allocation</WalletTableHeading>
            </Flex>
            {tokens
              .filter((token) => !token.tokenObj.name.includes('.'))
              .map((token) => (
                <AssetRow key={token.tokenObj.address} token={token} totalvolume={totalVolume} />
              ))}
          </ColumnTable>
        </Table>
      ) : (
        <NoTokenBox>
          <WalletTableHeading>No Available Tokens to Convert</WalletTableHeading>
        </NoTokenBox>
      )}

      {/* <ButtonBox>
        <Button onClick={onConvert}>{t('Convert small balances to JUMP')}</Button>
      </ButtonBox> */}
    </WalletTableContainer>
  )
}

export default WalletTable
