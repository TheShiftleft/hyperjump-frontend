import React from 'react'
import { Card, CardBody, Heading, Text, Image } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const StyledHeist = styled(Card)`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.primary};
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`

const HyprStats = () => {
  const { t } = useTranslation()

  return (
    <StyledHeist>
      <CardBody>
        <a href="https://hyperjump.fi/hyperheist/" target="_blank" rel="noreferrer">
          <Row>
            <Image src="images/games/hyper-heist-logo.png" width={618} height={317} />
          </Row>
        </a>
      </CardBody>
    </StyledHeist>
  )
}

export default HyprStats
