import { Button, Flex, Box, Text, useModal } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { useGetTokensList } from 'hooks/moralis'
import React from 'react'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import Container from 'components/layout/Container'
import TokenRow from './TokenRow'
import BroomModal from './BroomModal'
import WalletLogin from './WalletLogin'

const ButtonBox = styled(Box)`
  text-align: center;
  margin: 50px 0;
`

const Portfolio: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { config } = getNetwork()

  const tokens = useGetTokensList(account)
  console.log(tokens)
  let totalVolume = 0
  tokens.forEach((token) => {
    if (!token.tokenObj.name.includes('.')) {
      totalVolume += token.volume
    }
  })

  const [onPresentBroomModal] = useModal(<BroomModal tokens={tokens} />)

  const onConvert = () => {
    onPresentBroomModal()
  }

  return (
    <Container>
      {account ? (
        <>
          <PageHeader>
            <Flex justifyContent="center" flexDirection="column">
              <Text fontSize="24px" textAlign="center">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalVolume)}
              </Text>
              <Text color="white" textAlign="center">
                Net Worth
              </Text>
            </Flex>
          </PageHeader>
          <Page>
            {tokens
              .filter((token) => !token.tokenObj.name.includes('.'))
              .map((token) => (
                <TokenRow token={token} />
              ))}
            <ButtonBox>
              <Button onClick={onConvert}>{t('Convert small balances to JUMP')}</Button>
            </ButtonBox>
          </Page>
        </>
      ) : (
        <WalletLogin />
      )}
    </Container>
  )
}

export default Portfolio
