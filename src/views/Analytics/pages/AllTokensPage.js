/* eslint-disable react/jsx-pascal-case */

import React, { useEffect } from 'react'
import 'feather-icons'
import { useMedia } from 'react-use'

import TopTokenList from '../components/TokenList'
import { TYPE, PageWrapper, FullWrapper } from '../components'
import Panel from '../components/Panel'
import { useAllTokenData } from '../../../contexts/Analytics/TokenData'
import { RowBetween } from '../../../components/Row'
import {Search} from '../components/Search'

function AllTokensPage() {
  const allTokens = useAllTokenData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below600 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Top Tokens</TYPE.largeHeader>
          {!below600 && <Search small  />}
        </RowBetween>
        <Panel style={{ marginTop: '6px', padding: below600 && '1rem 0 0 0 ' }}>
          <TopTokenList tokens={allTokens} itemMax={50} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
