import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Image, Checkbox, Heading, Button, useModal } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'

import { getBroomAddress } from 'utils/addressHelpers'

import ConvertModal from './ConvertModal'

export interface TokenRowProps {
  token: TokenProps
  selectTokens?: (token, isSelected, approval, approvalCallback) => void
  isModal?: boolean
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

const Label = styled(Heading)`
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  font-weight: 700px;
`

const ContentContainer = styled.div`
  min-height: 20px;
  display: flex;

  margin-top: 5px;
  text-align: justify;
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

const StyledRowContainer = styled.div`
  // border-radius: ${({ theme }) => theme.radii.card};
  // border: 2px solid ${({ theme }) => theme.colors.primary};
  // background-color: rgba(13, 29, 54, 0.4);
  width: 100%;

  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
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

const StyledCheckbox = styled(Checkbox)`
  border: 1px solid #7645d9;
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
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  const { t } = useTranslation()
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>
        <Heading>{children}</Heading>
      </ContentContainer>
    </div>
  )
}

const TokenRow: React.FunctionComponent<TokenRowProps> = (props) => {
  const { t } = useTranslation()
  const [isSelected, setIsSelected] = useState(false)

  const broomAddress = getBroomAddress()

  const { token, isModal, selectTokens } = props

  const [approval, approveCallback] = useApproveCallback(
    new TokenAmount(token.tokenObj, JSBI.BigInt('100')),
    broomAddress,
  )

  useEffect(() => {
    if (isModal) {
      selectTokens(token, isSelected, approval, approveCallback)
    }
  }, [isModal, isSelected, selectTokens, token, approval, approveCallback])

  const [onPresentConvertModal] = useModal(<ConvertModal selectedtoken={token} />)

  const onConvert = () => {
    onPresentConvertModal()
  }

  // const handleRenderRow = () => {
  return (
    <>
      <StyledRow>
        {isModal && (
          <CellInner style={{ width: 50 }}>
            <StyledCheckbox checked={isSelected} onChange={() => setIsSelected(!isSelected)} scale="sm" />
          </CellInner>
        )}
        <CellInner>
          <IconImage src={token.logo} alt="icon" width={40} height={40} mr="8px" />
          <CellLayout label={token.tokenObj.name}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(token.price)}
          </CellLayout>
        </CellInner>
        <CellInner />
        <CellInner>
          <CellLayout
            label={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(token.volume)}
          >
            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 4 }).format(token.amount)}
          </CellLayout>
        </CellInner>
      </StyledRow>
      {token.price < 10 && !isModal && (
        <ConvertRow>
          <StyledButton onClick={onConvert}>Convert</StyledButton>
        </ConvertRow>
      )}
    </>
  )
  // }

  // return <StyledRowContainer>{handleRenderRow()}</StyledRowContainer>
}

export default TokenRow
