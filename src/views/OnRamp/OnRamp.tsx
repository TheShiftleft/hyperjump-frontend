import React from 'react'
import styled from 'styled-components'
import { baseColors } from 'uikit/theme/colors'
import { Flex, Heading } from 'uikit'
import Page from 'components/layout/Page'
import OnramperWidget from '@hyperjump-defi/onramper-widget'
import Iframe from 'react-iframe'

const OnRamper: React.FC = () => {
  const wallets = {
    BNB: { address: 'bnbAddress', memo: 'cryptoTag' },
  }

  return (
    <Page>
      <Container>
        <RampBox>
          <OnRampIframe
            title="onRamp"
            url="https://widget.mtpelerin.com/?lang=en&type=web&primary=%23152B4E&ssc=BNB&sdc=USD&tab=buy&bsc=USD&bdc=BNB"
          />
        </RampBox>
      </Container>
    </Page>

    // <Page>
    //   <Container>
    //     <div
    //       style={{
    //         width: '440px',
    //         height: '595px',
    //       }}
    //     >
    //       <OnramperWidget
    //         API_KEY={process.env.REACT_APP_ONRAMP_API_KEY}
    //         color={baseColors.primary}
    //         fontFamily="Babas Neue"
    //         defaultCrypto="BNB_BEP20"
    //         defaultFiat="USD"
    //       />
    //     </div>
    //   </Container>
    // </Page>
  )
}

export default OnRamper

const Container = styled(Flex)`
  // grid-gap: 16px;
  // justify-content: space-between;
  // flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.xs} {
    justify-content: center;
  }
`

const OnRampIframe = styled(Iframe)`
  width: 600px;
  height: 600px;
`

const RampBox = styled.div`
  background-color: #ffffff;
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
