import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Image, Checkbox, Heading, Text, Button, Flex } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@hyperjump-defi/sdk'
import { TokenProps } from 'hooks/moralis'

import { getBroomAddress } from 'utils/addressHelpers'
import { Token } from 'graphql'
import { height } from 'styled-system'

export interface AssetRowProps {
  token: TokenProps

  totalvolume: number
}

const CellInner = styled.div`
  padding-top: 24px;
  //   margin-left: -24px;
  //   margin-right: -24px;
  font-size: 16px;
  align-items: center;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
`

const Label = styled(Heading)`
  color: white;
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
const ProgressBarRow = styled.div`
  display: flex;

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
`
const ProgressParent = styled.div`
  width: 100%;
  background-color: rgba(2, 5, 11, 0.7);
  border-color: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
`

const ProgressChild = styled.div<{ linewidth: string }>`
  height: 100%;
  width: ${(props) => props.linewidth}%;

  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
`
const ProgressSpan = styled.span`
  padding: 5px;
  color: white;
  font-weight: 700;
`
interface ProgressBarProps {
  progress?: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { t } = useTranslation()

  return (
    <ProgressParent>
      <ProgressChild linewidth={progress.toString()}>
        <ProgressSpan />
      </ProgressChild>
    </ProgressParent>
  )
}

interface CellLayoutProps {
  label?: string
}
const CellLayout: React.FC<CellLayoutProps> = ({ label, children }) => {
  const { t } = useTranslation()
  return (
    <div>
      {label && <Label>{label} </Label>}
      <ContentContainer>
        <Heading>{children}</Heading>
      </ContentContainer>
    </div>
  )
}

const AssetRow: React.FunctionComponent<AssetRowProps> = (props) => {
  //   const { t } = useTranslation()
  //   const [isSelected, setIsSelected] = useState(false)

  //   const broomAddress = getBroomAddress()

  const { token, totalvolume } = props

  //   const [approval, approveCallback] = useApproveCallback(
  //     new TokenAmount(token.tokenObj, JSBI.BigInt('100')),
  //     broomAddress,
  //   )

  //   useEffect(() => {
  //     if (isModal) {
  //       selectTokens(token, isSelected, approval, approveCallback)
  //     }
  //   }, [isModal, isSelected, selectTokens, token, approval, approveCallback])

  //   const handleRenderRow = () => {
  const assetpercentage = (token.volume / totalvolume) * 100

  return (
    <>
      <StyledRow>
        <CellInner>
          <CellLayout label={`${token.tokenObj.name} WALLET`} />
        </CellInner>
        <CellInner />
        <CellInner>
          <CellLayout
            label={`${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(assetpercentage)} %`}
          />
        </CellInner>
      </StyledRow>
      <ProgressBarRow>
        <ProgressBar progress={assetpercentage} />
      </ProgressBarRow>
    </>
  )
  //   }

  //   return <StyledRowContainer>{handleRenderRow()}</StyledRowContainer>
}

export default AssetRow
