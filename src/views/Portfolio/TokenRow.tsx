import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Image, Heading, Button, useModal } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount, Token, Pair } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'
import { useSwapActionHandlers } from 'state/swap/hooks'
import { getBroomAddress } from 'utils/addressHelpers'
import getNetwork from 'utils/getNetwork'
import { Field } from 'state/swap/actions'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { useWeb3React } from '@web3-react/core'

import ConvertModal from './ConvertModal'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

export interface TokenRowProps {
  token: TokenProps
  selectTokens?: (token, isSelected, approval, approvalCallback) => void
  isModal?: boolean
  align?: string
}

const CellInner = styled.div`
  padding-top: 24px;
  // margin-left: -24px;
  // margin-right: -24px;
  font-size: 16px;
  align-items: center;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
`

const Label = styled(Heading)<{ align: string }>`
  color: ${({ theme }) => theme.colors.primary};
  text-align: ${(props) => props.align};
  font-weight: 700px;
`

const ContentContainer = styled.div`
  min-height: 20px;
  display: flex;

  margin-top: 5px;
  text-align: right;
  justify-content: space-between;
`

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;

  cursor: pointer;
  color: white;
  width: 100%;
`
const ConvertRow = styled.div`
  display: flex;
  align-items: right;
  justify-content: right;
  cursor: pointer;
  color: white;
  width: 100%;
`

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;
  position: relative;
  margin-right: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const StyledButton = styled(Button)`
  border-radius: 5px;
  max-height: 25px;
  padding: 5px 5px !important;
  color: black;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-top: 5px;
`

interface CellLayoutProps {
  label?: string
  align?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children, align }) => {
  const { t } = useTranslation()
  return (
    <div>
      {label && <Label align={align}>{label}</Label>}
      <ContentContainer>
        <Heading>{children}</Heading>
      </ContentContainer>
    </div>
  )
}

const TokenRow: React.FunctionComponent<TokenRowProps> = (props) => {
  const { t } = useTranslation()
  const { config } = getNetwork()
  const { account } = useWeb3React()
  const broomAddress = getBroomAddress()
  const { token } = props
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

  const TokenPairs = allV2PairsWithLiquidity.find(
    (lptoken) => lptoken.liquidityToken.address === token.tokenObj.address,
  )

  const [approval, approveCallback] = useApproveCallback(
    new TokenAmount(token.tokenObj, JSBI.BigInt('100')),
    broomAddress,
  )

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const selectedToken = { token, approval, isSelected: true, approvalCallback: approveCallback }

  const ToCurrency = new Token(
    config.baseCurrency.symbol === 'FTM' ? 250 : 56,
    config.baseCurrency.symbol === 'FTM' ? config.farmingToken.address[250] : config.farmingToken.address[56],
    config.farmingToken.decimals,
    config.farmingToken.symbol,
    'HyperJump',
  )

  const FromCurrency = new Token(
    config.baseCurrency.symbol === 'FTM' ? 250 : 56,
    selectedToken.token.tokenObj.address,
    selectedToken.token.tokenObj.decimals,
    selectedToken.token.tokenObj.symbol,
    selectedToken.token.tokenObj.name,
  )
  const DefaultFromCurrency = FromCurrency
  const DefaultToCurrency = ToCurrency

  const [onPresentConvertModal] = useModal(<ConvertModal selectedtoken={token} selectTokens={selectedToken} />)

  const onConvert = () => {
    onPresentConvertModal()
    onCurrencySelection(Field.INPUT, DefaultFromCurrency)
    onCurrencySelection(Field.OUTPUT, DefaultToCurrency)
    onUserInput(Field.INPUT, selectedToken.token.amount.toString())
  }

  return (
    <>
      <StyledRow>
        <CellInner>
          {TokenPairs ? (
            <>
              {allV2PairsWithLiquidity
                .filter((lptoken) => lptoken.liquidityToken.address === token.tokenObj.address)
                .map((v2Pair) => (
                  <DoubleCurrencyLogo
                    key={v2Pair.liquidityToken.address}
                    currency0={unwrappedToken(v2Pair.token0)}
                    currency1={unwrappedToken(v2Pair.token1)}
                    margin
                    size={30}
                  />
                ))}
            </>
          ) : (
            <IconImage src={token.logo} alt="icon" width={30} height={30} ml="16px" />
          )}

          <CellLayout label={token.tokenObj.symbol} align="left">
            {token.price
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 4,
                }).format(token.price)
              : '-'}
          </CellLayout>
        </CellInner>
        <CellInner />
        <CellInner>
          <CellLayout
            align="right"
            label={
              token.volume
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 4,
                  }).format(token.volume)
                : '-'
            }
          >
            {token.amount ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 4 }).format(token.amount) : '-'}
          </CellLayout>
        </CellInner>
      </StyledRow>
      {token.volume < 10 && token.volume !== 0 && (
        <ConvertRow>
          <StyledButton onClick={onConvert}>{t('Convert')}</StyledButton>
        </ConvertRow>
      )}
    </>
  )
}

export default TokenRow
