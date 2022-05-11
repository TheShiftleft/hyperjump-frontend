import React from 'react'
import styled from 'styled-components'
import { Heading, Button, useModal } from 'uikit'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount, Token } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'
import { useSwapActionHandlers } from 'state/swap/hooks'
import { getBroomAddress } from 'utils/addressHelpers'
import getNetwork from 'utils/getNetwork'
import { Field } from 'state/swap/actions'
import { useWeb3React } from '@web3-react/core'
import CurrencyLogo from 'components/CurrencyLogo'
import Logo from 'components/Logo'
import BigNumber from 'bignumber.js'
import { useCurrencyBalance } from 'state/wallet/hooks'
import ConvertModal from './ConvertModal'

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
`

const StyledRow = styled.div`
  display: flex;
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

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`
const IconContainer = styled.div`
  position: relative;
  margin-right: 24px;
  width: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  return (
    <div>
      {label && <Label align={align}>{label}</Label>}
      <ContentContainer style={{ justifyContent: align }}>
        <Heading>{children}</Heading>
      </ContentContainer>
    </div>
  )
}

const TokenRow: React.FunctionComponent<TokenRowProps> = (props) => {
  const { config } = getNetwork()
  const { account } = useWeb3React()
  const broomAddress = getBroomAddress()
  const { token } = props

  const selectTokenBalance = useCurrencyBalance(account ?? undefined, token.tokenObj ?? undefined)

  if (!token.amount) {
    token.amount = selectTokenBalance ? Number(selectTokenBalance.toSignificant(6)) : 0
  }
  if (!token.volume) {
    token.volume = token.price * token.amount
  }

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
  const inputValue = new BigNumber(selectedToken.token.amount).toString()

  const onConvert = () => {
    onPresentConvertModal()
    onCurrencySelection(Field.INPUT, DefaultFromCurrency)
    onCurrencySelection(Field.OUTPUT, DefaultToCurrency)
    onUserInput(Field.INPUT, inputValue)
  }

  return (
    <>
      <StyledRow>
        <CellInner>
          <IconContainer>
            {token.logo ? (
              <StyledLogo size="30px" srcs={[token.logo]} alt="icon" />
            ) : (
              <CurrencyLogo currency={token.tokenObj} size="30px" />
            )}
          </IconContainer>
        </CellInner>
        <CellInner style={{ flex: '1' }}>
          <CellLayout label={token.tokenObj.symbol} align="left">
            {`$${token.price ? new BigNumber(token.price).decimalPlaces(4) : 0}`}
          </CellLayout>
        </CellInner>
        <CellInner>
          <CellLayout align="right" label={`$${token.volume ? new BigNumber(token.volume).decimalPlaces(18) : 0}`}>
            {`${token.amount !== 0 ? new BigNumber(token.amount).decimalPlaces(18) : 0}`}
          </CellLayout>
        </CellInner>
      </StyledRow>
      {token.volume < 10 && token.volume > 0 && (
        <ConvertRow>
          <StyledButton onClick={onConvert}>Convert</StyledButton>
        </ConvertRow>
      )}
    </>
  )
}

export default TokenRow
