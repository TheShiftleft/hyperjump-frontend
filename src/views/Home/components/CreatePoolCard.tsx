import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Flex, Link } from 'uikit'


const CreatePoolCard = () => {
 

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="flex-end">
          <HeadingText>
            WANT TO
            <HeadingColor> CREATE A POOL </HeadingColor>
            FOR YOUR TOKEN?
          </HeadingText>
          <ButtonContainer>
            <Link
              external
              href="https://docs.google.com/forms/d/e/1FAIpQLSdqRqH9chWa2cd6Hg3nmuVzvRixUohOVov26R70LoxOwomRbA/viewform?vc=0&c=0&w=1&flr=0"
            >
              <ApplyButton>APPLY NOW</ApplyButton>
            </Link>
          </ButtonContainer>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default CreatePoolCard

const StyledFarmStakingCard = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: ${({ theme }) => theme.radii.card};
`

const Block = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radii.card};
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  color: ${({ theme }) => theme.colors.primary};
`

const HeadingColor = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const HeadingText = styled.p`
  font-size: 28px;
  font-family: Bebas neue, cursive;
`

const ButtonContainer = styled.div`
  margin-left: 8px;
`

const ApplyButton = styled(Button)`
  max-height: 30px;
  width: 100px;
  border-radius: 5px;
  padding: 5px 3px !important;
  color: black;
`
