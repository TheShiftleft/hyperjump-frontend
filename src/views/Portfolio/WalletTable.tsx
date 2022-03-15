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
import TokenRow from './TokenRow'
import BroomModal from './BroomModal'
import WalletLogin from './WalletLogin'
import AssetRow from './AssetRow'

const ButtonBox = styled(Box)`
  text-align: center;
  margin: 50px 0;
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

  //   const testtokens = [
  //     {
  //       tokenObj: {
  //         decimals: 18,
  //         symbol: 'SPIRIT',
  //         name: 'SpiritSwap Token',
  //         chainId: 56,
  //         address: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  //       },
  //       logo: 'https://assets.coingecko.com/coins/images/15118/small/4mY2Biy9_400x400.jpg?1619753382',
  //       amount: 0.000352588792428512,
  //       volume: 2.0,
  //       price: 10.002343213,
  //     },
  //     {
  //       tokenObj: {
  //         decimals: 18,
  //         symbol: 'WFTM',
  //         name: 'Wrapped Fantom',
  //         chainId: 56,
  //         address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  //       },
  //       logo: 'https://assets.coingecko.com/coins/images/16036/small/Fantom.png?1622679930',
  //       amount: 1,
  //       volume: 1.097692515715209,
  //       price: 1.097692515715209,
  //     },
  //     {
  //       tokenObj: {
  //         decimals: 6,
  //         symbol: 'USDC',
  //         name: 'USD Coin',
  //         chainId: 56,
  //         address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  //       },
  //       logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
  //       amount: 0.199143,
  //       volume: 0.19963181690724344,
  //       price: 1.002454602507964,
  //     },
  //   ]
  //   const tokens = []
  //   testtokens.forEach((token) => {
  //     const tokenObj = new Token(
  //       token.tokenObj.chainId,
  //       token.tokenObj.address,
  //       parseInt(token.tokenObj.decimals.toString()),
  //       token.tokenObj.symbol,
  //       token.tokenObj.name,
  //     )
  //     const newToken: TokenProps = {
  //       tokenObj,
  //       logo: token.logo,

  //       amount: token.amount,
  //       volume: token.volume,
  //       price: token.price,
  //     }
  //     tokens.push(newToken)
  //   })

  const tokens = useGetTokensList(account)
  console.log(tokens)

  let totalVolume = 0
  tokens.forEach((token) => {
    if (!token.tokenObj.name.includes('.')) {
      totalVolume += token.volume
    }
  })

  //   const [onPresentBroomModal] = useModal(<BroomModal tokens={tokens} />)

  //   const onConvert = () => {
  //     onPresentBroomModal()
  //   }

  return (
    <WalletTableContainer>
      <PageHeader>
        <NetWorthBox>
          <NetWorthHeading>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalVolume)}
          </NetWorthHeading>
          <Text color="primary">Net Worth</Text>
        </NetWorthBox>
        <WalletTableHeading>
          <Heading color="primary" ml="5px" mr="5px">
            DeFi
          </Heading>
          Investments
        </WalletTableHeading>
      </PageHeader>

      <Table>
        <ColumnTable>
          <Flex flexDirection="column" alignItems="center">
            <WalletTableHeading>Wallet</WalletTableHeading>
          </Flex>
          {tokens
            .filter((token) => !token.tokenObj.name.includes('.'))
            .map((token) => (
              <TokenRow token={token} />
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
              <AssetRow token={token} totalvolume={totalVolume} />
            ))}
        </ColumnTable>
      </Table>

      {/* <ButtonBox>
        <Button onClick={onConvert}>{t('Convert small balances to JUMP')}</Button>
      </ButtonBox> */}
    </WalletTableContainer>
  )
}

export default WalletTable
