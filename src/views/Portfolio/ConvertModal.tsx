import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import getNetwork from 'utils/getNetwork'
import { ApprovalState } from 'hooks/useApproveCallback'

import { TokenProps } from 'hooks/moralis'
import { Modal, Button, Box, Text, Flex, Image } from 'uikit'
import { getRouterAddress } from 'utils/addressHelpers'
import { BroomCallbackState, useBroomSweep } from 'hooks/useBroom'

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
`

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`

const TokenContainer = styled.div`
  height: 500px;
  overflow-y: auto;
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
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  )
}

const ConvertModal: React.FC<ConvertModalProps> = ({ onDismiss, selectedtoken, selectTokens, amounts }) => {
  const { t } = useTranslation()

  const [step, setStep] = useState(1)

  const onSelectTokens = () => {
    setStep(1)
  }

  const onApprove = () => {
    if ([ApprovalState.NOT_APPROVED, ApprovalState.UNKNOWN].includes(selectTokens.approval)) {
      selectTokens.approvalCallback()
    }
  }

  // Lagyan mo dito bro ng params sa useBroomSweep
  const { state: broomState, callback: broomCallback } = useBroomSweep(selectTokens.token.amount, 
    selectTokens.token.tokenObj.address,
  )

  const handleBroomCallback = useCallback(() => {
    if (broomState !== BroomCallbackState.INVALID) {
      broomCallback()
        .then((result) => {
          console.log('result', result)
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [broomCallback, broomState])

  return (
    <Modal title={t('Convert small balances')} onDismiss={onDismiss}>
      {step === 1 && (
        <Box>
          <Text fontSize="18px" marginBottom="30px">
            To convert small balances, you will need to sign <br /> wallet transaction.
          </Text>

          <Box>
            <StyledRow>
              <CellInner>
                <Text>Approve ETH</Text>
              </CellInner>

              <CellLayout label="0.0002 BNB">≈ $0.10</CellLayout>
            </StyledRow>

            <StyledRow>
              <CellInner>
                <Text>Estimated conversion cost</Text>
              </CellInner>

              <CellLayout label="0.0038 BNB">≈ $1.77</CellLayout>
            </StyledRow>
          </Box>

          <Box>
            <Text fontSize="18px" marginTop="30px">
              Summary
            </Text>

            <StyledRow>
              <CellInner>
                <Text>You will get approximately</Text>
              </CellInner>

              <CellLayout label="10.87 JUMP">≈ $1.40</CellLayout>
            </StyledRow>

            <StyledRow>
              <CellInner>
                <IconImage src={selectedtoken.logo} alt="icon" width={40} height={40} mr="8px" />
              </CellInner>
              <CellInner>
                <CellLayout label={selectedtoken.tokenObj.name}>
                  {selectedtoken.price && selectedtoken.price.toFixed(2)}
                </CellLayout>
              </CellInner>
              <CellInner>
                <CellLayout
                  label={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    selectedtoken.volume,
                  )}
                >
                  {new Intl.NumberFormat('en-US').format(selectedtoken.amount)}
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
        </Box>
      )}
    </Modal>
  )
}

export default ConvertModal
