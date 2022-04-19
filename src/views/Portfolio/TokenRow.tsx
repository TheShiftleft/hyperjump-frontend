import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Heading, Button, useModal } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount, Token } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'
import { useSwapActionHandlers } from 'state/swap/hooks'
import { getBroomAddress } from 'utils/addressHelpers'
import getNetwork from 'utils/getNetwork'
import { Field } from 'state/swap/actions'
import { useWeb3React } from '@web3-react/core'
import { useCurrency } from 'hooks/Tokens'
import { useTokenContract } from 'hooks/useContract'
import CurrencyLogo from 'components/CurrencyLogo'
import Logo from 'components/Logo'
import ConvertModal from './ConvertModal'
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

  const tokenContract0 = useTokenContract(token.tokenPairs[0])
  const tokenContract1 = useTokenContract(token.tokenPairs[1])

  const [symbols, setSymbols] = useState([undefined, undefined])
  useMemo(() => {
    let isMounted = true
    const fetchSymbols = async () => {
      if(!tokenContract0 && !tokenContract1) return 
      const data = await Promise.all(
        [tokenContract0.symbol(), tokenContract1.symbol()]
      )
      if(isMounted){
        setSymbols(data)
      }
    }
    fetchSymbols()

    return () => {
      isMounted = false
    }
  },[tokenContract0, tokenContract1])
  
  const currency0 = useCurrency(token.tokenPairs[0])
  const currency1 = useCurrency(token.tokenPairs[1])

  return (
    <>
      <StyledRow>
        <CellInner>
          <IconContainer>
            {token.tokenPairs.length > 0 ? (
                <DoubleCurrencyLogo
                  key={token.tokenObj.address}
                  currency0={currency0}
                  currency1={currency1}
                  size={30}
                />
            ) : token.logo ? (
              <StyledLogo size='30px' srcs={[token.logo]} alt="icon" />
            ) : (
                <CurrencyLogo currency={token.tokenObj} size='30px' />
            )}
          </IconContainer>
          
        </CellInner>
        <CellInner style={{flex: '1'}}>
          <CellLayout
            label={
              token.tokenPairs.length > 0
                ? `${symbols[0]} - ${symbols[1]} `
                : token.tokenObj.symbol
            }
            align="left"
          >
            {token.price
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 4,
                }).format(token.price)
              : '-'}
          </CellLayout>
        </CellInner>
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
