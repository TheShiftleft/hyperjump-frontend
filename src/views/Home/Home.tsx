import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from 'uikit'
import Page from 'components/layout/Page'
import FarmingTokenStats from 'views/Home/components/FarmingTokenStats'
import GovTokenStats from 'views/Home/components/GovTokenStats'
import CrossChainTVLCard from 'views/Home/components/CrossChainTVLCard'
import TwitterFeedCard from 'views/Home/components/TwitterFeedCard'
import CreatePoolCard from 'views/Home/components/CreatePoolCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import FarmingTokenStakingCard from 'views/Home/components/FarmingTokenStakingCard'
import WinCard from 'views/Home/components/WinCard'
import JumpConverter from 'views/Convert/components/JumpConverter'
import MechConverter from 'views/Convert/components/MechConverter'
import Welcome from 'views/Home/components/Welcome'
import V1Links from 'views/Home/components/V1Links'

const Container = styled(Flex)`
  grid-gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.xs} {
    justify-content: center;
  }
`

const EarnFlex = styled(Flex)`
  background-color: transparent;
`

const Column = styled(Flex)`
  flex: 1;
  flex-direction: column;
  grid-gap: 16px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.xs} {
    max-width: 375px;
    min-width: 370px;
  }
`

const HeadingFlex = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 190px;
  }
`

const MainLogo = styled.img`
  width: 200px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 400px;
  }
`

const MainHeading = styled(Heading)`
  margin: 5px 0 0 0;
  display: flex;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 10px 0;
  }
`

const ShipLogo = styled.img`
  max-height: 150px;
  align-self: flex-end;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const Home: React.FC = () => {
  return (
    <Page>
      <Container>
        <Flex justifyContent="center" width="100%">
          <HeadingFlex flexDirection="column" alignItems="center">
            <MainLogo src="/images/hyperjump-full-logo.png" />
            <MainHeading>
              INTERGALACTIC
              <Heading color="primary" ml="5px" mr="5px">
                DE-FI
              </Heading>
              PROTOCOL
            </MainHeading>
          </HeadingFlex>
          <ShipLogo src="/images/plane.png" />
        </Flex>
        <Column>
          <JumpConverter />
        </Column>
        <Column>
          <MechConverter />
        </Column>
        <Column>
          <V1Links />
        </Column>
        <Column>
          <FarmingTokenStats />
          <GovTokenStats />
        </Column>
        <Column>
          <FarmingTokenStakingCard />
          <EarnFlex>
            <EarnAssetCard />
            <EarnAPRCard />
          </EarnFlex>
          <CreatePoolCard />
          <WinCard />
        </Column>
        <Column>
          <CrossChainTVLCard />
          <TwitterFeedCard />
        </Column>
      </Container>
    </Page>
  )
}

export default Home
