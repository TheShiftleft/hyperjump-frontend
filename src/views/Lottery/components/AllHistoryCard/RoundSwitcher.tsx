import React from 'react'
import styled from 'styled-components'
import { IconButton, ArrowForwardIcon, ArrowBackIcon, Skeleton, Flex, Box, Heading, Input, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { getDrawnDate } from '../../helpers'

const StyledInput = styled(Input)`
  width: 60px;
  height: 100%;
  padding: 4px 16px;
`

const StyledIconButton = styled(IconButton)`
  width: 32px;

  :disabled {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.textDisabled};

      path {
        fill: ${({ theme }) => theme.colors.textDisabled};
      }
    }
  }
`

const StyledHeading = styled(Heading)`
  text-transform: uppercase;
  font-family: 'Coda';
  font-size: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
  }
`

interface RoundSwitcherProps {
  isLoading: boolean
  selectedRoundId: string
  selectedLotteryInfo: any
  mostRecentRound: number
  handleInputChange: (event: any) => void
  handleArrowButonPress: (targetRound: number) => void
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({
  isLoading,
  selectedRoundId,
  selectedLotteryInfo,
  mostRecentRound,
  handleInputChange,
  handleArrowButonPress,
}) => {
  const { t } = useTranslation()
  const selectedRoundIdAsInt = parseInt(selectedRoundId, 10)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <StyledHeading color="#44c4e2" mr="18px">
          {t(`Round #${selectedRoundId}`)}
        </StyledHeading>
        <Box>
          {selectedLotteryInfo?.endTime ? (
            <Text fontSize="14px">
              {t('Drawn')} {getDrawnDate(selectedLotteryInfo.endTime)}
            </Text>
          ) : (
            <Skeleton width="185px" height="21px" />
          )}
        </Box>
      </Flex>
      <Flex alignItems="center">
        <StyledIconButton
          disabled={!selectedRoundIdAsInt || selectedRoundIdAsInt <= 1}
          onClick={() => handleArrowButonPress(selectedRoundIdAsInt - 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowBackIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButonPress(selectedRoundIdAsInt + 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
      </Flex>
    </Flex>
  )
}

export default RoundSwitcher
