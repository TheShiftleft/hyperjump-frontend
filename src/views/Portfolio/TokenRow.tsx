import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Image, Checkbox } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'

import { getBroomAddress } from 'utils/addressHelpers'

export interface TokenRowProps {
  token: TokenProps
  selectTokens?: (token, isSelected, approval, approvalCallback) => void
  isModal?: boolean
}

const CellInner = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;
  width: 100px;
`
const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: white;
`

const StyledRowContainer = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const StyledCheckbox = styled(Checkbox)`
  border: 1px solid #7645d9;
`

interface CellLayoutProps {
  label?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  )
}

const TokenRow: React.FunctionComponent<TokenRowProps> = (props) => {
  const { t } = useTranslation()
  const [isSelected, setIsSelected] = useState(false)

  const broomAddress = getBroomAddress()
  
  const { token, isModal, selectTokens } = props

  const [approval, approveCallback] = useApproveCallback(new TokenAmount(token.tokenObj, JSBI.BigInt('100')), broomAddress)

  useEffect(() => {
    if (isModal) {
      selectTokens(token, isSelected, approval, approveCallback)
    }
  }, [isModal, isSelected, selectTokens, token, approval, approveCallback])

  const handleRenderRow = () => {
    return (
      <StyledRow>
        {isModal && (
          <CellInner style={{ width: 50 }}>
            <StyledCheckbox checked={isSelected} onChange={() => setIsSelected(!isSelected)} scale="sm" />
          </CellInner>
        )}
        <CellInner>
          <IconImage src={token.logo} alt="icon" width={40} height={40} mr="8px" />
        </CellInner>
        <CellInner>
          <CellLayout label={token.tokenObj.name}>{token.price && token.price.toFixed(2)}</CellLayout>
        </CellInner>
        <CellInner>
          <CellLayout label={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(token.volume)}>
            {new Intl.NumberFormat('en-US').format(token.amount)}
          </CellLayout>
        </CellInner>
      </StyledRow>
    )
  }

  return <StyledRowContainer>{handleRenderRow()}</StyledRowContainer>
}

export default TokenRow
