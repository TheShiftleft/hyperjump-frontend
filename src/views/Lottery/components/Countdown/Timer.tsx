import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'

export interface TimerProps {
  minutes?: number
  hours?: number
  days?: number
}

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const StyledTimerText = styled(Heading)`
  background: #49ceeb;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const HeadingContainer = styled.div`
  white-space: nowrap;
  margin: 0 5px;
  > * {
    display: inline-block;
  }
  font-size: 24px;
`

const Highlight = styled.span`
  text-align: left;
  font-size: 24px;
  font-weight: 400;
  font-family: 'Bebas Neue', cursive;
  line-height: 1.1;
  color: #49ceeb;
`

const Wrapper: React.FC<TimerProps> = ({ minutes, hours, days }) => {
  const { t } = useTranslation()

  return (
    <HeadingContainer >
      {Boolean(days) && (
        <>
          <Heading color="#49ceeb" mb="-4px" scale="lg">
            {days}
          </Heading>
          <Heading color="#49ceeb" mr="12px" scale="lg">{t('d')}</Heading>
        </>
      )}
      {Boolean(hours) && (
        <>
          <Heading color="#49ceeb" mb="-4px" scale="lg">
            {hours}
          </Heading>
          <Heading color="#49ceeb" mr="12px" scale="lg">{t('h')}</Heading>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <Heading color="#49ceeb" mb="-4px" scale="lg">
            {minutes}
          </Heading>
          <Heading color="#49ceeb" mr="12px" scale="lg">{t('m')}</Heading>
        </>
      )}
    </HeadingContainer>
  )
}

export default Wrapper
