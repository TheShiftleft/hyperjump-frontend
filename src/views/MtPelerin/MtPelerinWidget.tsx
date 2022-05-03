import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import Page from 'components/layout/Page'
import Iframe from 'react-iframe'

export interface WidgetProps {
  language: string
  primary: string
  success: string
  sellsourcecurrency: string
  selldestinationcurrency: string
  buysourcecurrency: string
  buydestinationcurrency: string
  defaulttab: string
  network: string
  viewtype: string
}

const MtPelerinWidget: React.FC<WidgetProps> = ({
  language,
  primary,
  success,
  sellsourcecurrency,
  selldestinationcurrency,
  buysourcecurrency,
  buydestinationcurrency,
  defaulttab,
  network,
  viewtype,
}) => {
  const rampUrl = `https://widget.mtpelerin.com/?lang=${language}&type=${viewtype}&primary=${primary}&success=${primary}&ssc=${sellsourcecurrency}&sdc=${selldestinationcurrency}&tab=${defaulttab}&bsc=${buysourcecurrency}&bdc=${buydestinationcurrency}&network=${network}`
  return (
    <Page>
      <Container>
        <RampBox>
          <OnRampIframe title="onRampWidget" url={rampUrl} />
        </RampBox>
      </Container>
    </Page>
  )
}

export default MtPelerinWidget

const Container = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const OnRampIframe = styled(Iframe)`
  width: 100%;
  height: 100%;
`

const RampBox = styled.div`
  background-color: #ffffff;
  border-color: #152b4e;
  border-radius: 50px;
  border-style: solid;
  border-width: 10px;
  margin-bottom: 20px;
  width: 300px;
  height: 690px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 600px;
    height: 600px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 600px;
    height: 640px;
  }
`
