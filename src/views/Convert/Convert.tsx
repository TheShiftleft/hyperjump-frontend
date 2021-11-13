import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading } from 'uikit'
import Page from 'components/layout/Page'
import getNetwork from 'utils/getNetwork'
import Converter from './components/Converter'

const { chainId } = getNetwork()
const oldFarmingToken = chainId === 56 ? 'alloy' : 'ori'

const Convert: React.FC = () => {
  return (
    <Page>
      <Container>
        <Flex justifyContent="center" width="100%">
          <HeadingFlex flexDirection="column" alignItems="center">
            <MainHeading>
              Convert your
              <Heading color="primary" ml="5px" mr="5px">
                ${oldFarmingToken}
              </Heading>
              to
              <Heading color="primary" ml="5px" mr="5px">
                $JUMP
              </Heading>
            </MainHeading>
          </HeadingFlex>
          <ShipLogo src="/images/plane.png" />
        </Flex>

        <Column>
          <Converter />
        </Column>
      </Container>
    </Page>
  )
}

export default Convert

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
