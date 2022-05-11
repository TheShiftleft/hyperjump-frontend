import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ApprovalState } from 'hooks/useApproveCallback'
import { TokenProps } from 'hooks/moralis'
import { Modal, Button, Box, Text, Flex, Image } from 'uikit'
import { BroomCallbackState, useBroomSweep } from 'hooks/useBroom'
import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import TradePrice from 'components/swap/TradePrice'
import useToast from 'hooks/useToast'
import { useAllTokens } from 'hooks/Tokens'
import CurrencyLogo from 'components/CurrencyLogo'
import BigNumber from 'bignumber.js'
import { computeTradePriceBreakdown } from '../../utils/prices'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

interface ConvertModalProps {
  onDismiss?: () => void
  selectedtoken?: TokenProps
  amounts?: number[]
  selectTokens: ConvertTokenProps
}

interface ConvertTokenProps {
  token: TokenProps
  isSelected: boolean
  approval: number
  approvalCallback?: () => Promise<void>
}

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: white;
`

const CellInner = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;
  width: 60px;
  white-space: nowrap;
  @media (max-width: 545px) {
    font-size: 14px;
  }
`

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  @media (max-width: 545px) {
    font-size: 11px;
  }
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 545px) {
    font-size: 11px;
  }
`

const ButtonBox = styled(Flex)`
  margin-top: 20px;
  align-items: center;
  justify-content: center;

  & > button {
    width: 40%;
    margin: 0 10%;
  }
`
interface CellLayoutProps {
  label?: string
  align?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  )
}

const ConvertModal: React.FC<ConvertModalProps> = ({ onDismiss, selectedtoken, selectTokens }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const [limitPrice, setLimitPrice] = useState('')
  const [limitValidity, setLimitValidity] = useState({ valid: true, error: '' })
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, parsedAmount, currencies } = useDerivedSwapInfo()
  const inputvalue = new BigNumber(selectTokens.token.amount).toString()
  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], inputvalue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = v2Trade
  const { realizedLPFee } = computeTradePriceBreakdown(trade)

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currencies[Field.OUTPUT] ?? undefined)
  const selectTokenBalance = useCurrencyBalance(account ?? undefined, currencies[Field.INPUT] ?? undefined)

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const onApprove = () => {
    if ([ApprovalState.NOT_APPROVED, ApprovalState.UNKNOWN].includes(selectTokens.approval)) {
      selectTokens
        .approvalCallback()
        .then((result) => {
          toastSuccess(
            `${t('Approved')}!`,
            t('Your %symbol% balances have been approved for conversion', { symbol: tokenSymbol }),
          )
        })
        .catch((e) => {
          toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        })
    }
  }

  const { state: broomState, callback: broomCallback } = useBroomSweep(
    selectTokenBalance,
    selectTokens.token.tokenObj.address,
    selectTokens.token.tokenObj.decimals,
  )

  const totalestimateJump = Number(formattedAmounts[Field.INPUT]) * Number(trade?.executionPrice.toSignificant(6))

  const estimateconvcost = realizedLPFee
    ? Number(realizedLPFee.toSignificant(6)) * Number(selectedtoken.price ? selectedtoken.price.toFixed(2) : 0)
    : 0

  const tokenSymbol = selectedtoken.tokenObj.symbol

  const handleBroomCallback = useCallback(() => {
    if (broomState !== BroomCallbackState.INVALID) {
      broomCallback()
        .then((result) => {
          toastSuccess(
            `${t('Converted')}!`,
            t('Your %symbol% balances have been converted into JUMP', { symbol: tokenSymbol }),
          )
          console.info('result', result)
          onDismiss()
        })
        .catch((e) => {
          if (e.code === 4001) {
            toastError(t('Rejected'), t(e.message))
          }

          if (e.code === -32603) {
            toastError(t(e.message), t(e.data.message))
          }
        })
    }
  }, [broomCallback, broomState, toastSuccess, toastError, t, onDismiss, tokenSymbol])

  return (
    <Modal title={t('Convert small balances')} onDismiss={onDismiss}>
      <Text fontSize="18px" marginBottom="30px">
        To convert small balances, you will need to sign <br /> wallet transaction.
      </Text>

      <Box>
        <StyledRow>
          <CellInner>
            <Text fontSize="14px">
              {' '}
              {selectTokens.approval !== ApprovalState.APPROVED ? 'Approve ETH' : 'Approved ETH'}
            </Text>
          </CellInner>

          <CellLayout
            align="right"
            label={selectTokenBalance ? `${selectTokenBalance.toSignificant(6)} ${tokenSymbol}` : '-'}
          >
            ≈ ${`${selectedtoken.volume ? new BigNumber(selectedtoken.volume).decimalPlaces(10) : 0}`}
          </CellLayout>
        </StyledRow>

        <StyledRow>
          <CellInner>
            <Text fontSize="14px">Estimated conversion cost</Text>
          </CellInner>
          <CellLayout
            align="right"
            label={realizedLPFee ? `${realizedLPFee.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          >
            ≈ {`$${realizedLPFee ? new BigNumber(estimateconvcost).decimalPlaces(10) : 0}`}
          </CellLayout>
        </StyledRow>
        <TradePrice
          price={trade?.executionPrice}
          limit={limitPrice}
          showInverted={showInverted}
          setShowInverted={setShowInverted}
          setLimitPrice={setLimitPrice}
          setLimitValidity={setLimitValidity}
        />
      </Box>

      <Box>
        <Text fontSize="14px" marginTop="30px">
          Summary
        </Text>

        <StyledRow>
          <CellInner>
            <Text fontSize="14px">You will get approximately</Text>
          </CellInner>

          <CellLayout
            label={
              selectedCurrencyBalance
                ? `${selectedCurrencyBalance.toSignificant(6)}${selectedCurrencyBalance.currency.symbol}`
                : '-'
            }
          >
            ≈ {`${totalestimateJump ? new BigNumber(totalestimateJump).decimalPlaces(10) : 0}`}
          </CellLayout>
        </StyledRow>

        <StyledRow>
          <CellInner>
            <CurrencyLogo currency={selectedtoken.tokenObj} size="30px" />
            {/* )} */}
          </CellInner>
          <CellInner>
            <CellLayout label={selectedtoken.tokenObj.name}>
              {`${selectedtoken.price ? new BigNumber(selectedtoken.price).decimalPlaces(12) : 0}`}
            </CellLayout>
          </CellInner>
          <CellInner>
            <CellLayout
              label={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                selectedtoken.volume || 0,
              )}
            >
              {new Intl.NumberFormat('en-US').format(selectedtoken.amount || 0)}
            </CellLayout>
          </CellInner>
        </StyledRow>
      </Box>

      <ButtonBox>
        {selectTokens.approval !== ApprovalState.APPROVED ? (
          <Button onClick={onApprove}>{t('Approve')}</Button>
        ) : (
          <Button
            onClick={() => {
              handleBroomCallback()
            }}
          >
            {t('Convert')}
          </Button>
        )}
      </ButtonBox>
    </Modal>
  )
}

export default ConvertModal
