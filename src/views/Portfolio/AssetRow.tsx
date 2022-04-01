import React from 'react'
import styled from 'styled-components'
import { Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenProps } from 'hooks/moralis'

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
  const { token, totalvolume } = props
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
            label={`${
              assetpercentage
                ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(assetpercentage)
                : ''
            } %`}
          />
        </CellInner>
      </StyledRow>
      <ProgressBarRow>
        <ProgressBar progress={assetpercentage || 0} />
      </ProgressBarRow>
    </>
  )
}

export default AssetRow
