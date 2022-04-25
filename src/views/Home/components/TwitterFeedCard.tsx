import React from 'react'
import styled from 'styled-components'
import { Timeline } from 'react-twitter-widgets'

import { Card, CardBody, Heading, Flex } from 'uikit'

const StyledCard = styled(Card)`
  flex: 4;
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: 50px;
  margin-left: auto;
  margin-right: auto;
`

const TwitterBody = styled(CardBody)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const TwitterLogo = styled.img`
  height: auto;
  width: auto;
  max-width: 75px;
  max-height: 75px;
`

const TwitterFeedCard = () => {
  return (
    <StyledCard>
      <TwitterBody>
        <Flex justifyContent="space-between" alignItems="flex-end" mb="20px" width="100%">
          <div>
            <Heading scale="xl">
              <HeadingColor>TWITTER FEED</HeadingColor>
            </Heading>
            <Heading>NEWS FROM TWITTERVERSE</Heading>
          </div>

          <TwitterLogo src="twitter.png" />
        </Flex>

        <Timeline
          data-theme="dark"
          dataSource={{
            sourceType: 'profile',
            screenName: 'HyperJump_fi',
          }}
          options={{
            width: '450',
            height: '500',
            theme: 'dark',
          }}
        />
      </TwitterBody>
    </StyledCard>
  )
}

export default TwitterFeedCard
