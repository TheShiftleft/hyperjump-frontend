import { Flex, Text, Heading, Card } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { useGetTokensList } from 'hooks/moralis'
import styled from 'styled-components'
import { SubHeader } from 'uikit/components/SubHeader'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { Pair } from '@hyperjump-defi/sdk'
import getNetwork from 'utils/getNetwork'
import TokenRow from './TokenRow'
import AssetRow from './AssetRow'

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
  display: block;
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

const WalletTable: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { config } = getNetwork()

  const usertokens = useGetTokensList(account)
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const [v2PairsBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  let totalVolume = 0
  usertokens.forEach(async (token) => {
    if (!token.tokenObj.name.includes('.')) {
      totalVolume += token.volume
    }

    allV2PairsWithLiquidity.forEach((lptoken) => {
      if (lptoken.liquidityToken.address === token.tokenObj.address) {
        token.tokenObj.symbol = `${lptoken.token0.symbol} - ${lptoken.token1.symbol}`
      }
    })
  })

  return (
    <WalletTableContainer>
      <PageHeader>
        <NetWorthBox>
          <NetWorthHeading>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalVolume || 0)}
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
      {usertokens.length > 0 ? (
        <Table>
          <ColumnTable>
            <Flex flexDirection="column" alignItems="center">
              <WalletTableHeading>Wallet</WalletTableHeading>
            </Flex>
            {usertokens
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
            {usertokens
              .filter((token) => !token.tokenObj.name.includes('.'))
              .map((token) => (
                <AssetRow key={token.tokenObj.address} token={token} totalvolume={totalVolume} />
              ))}
          </ColumnTable>
        </Table>
      ) : (
        <NoTokenBox>
          <WalletTableHeading>{t('No Available Tokens to Convert')}</WalletTableHeading>
        </NoTokenBox>
      )}
    </WalletTableContainer>
  )
}

export default WalletTable
