/* eslint-disable react/jsx-pascal-case */

import React, { useEffect } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { TYPE, PageWrapper, FullWrapper } from '../components'
import Panel from '../components/Panel'
import LPList from '../components/LPList'
import AccountSearch from '../components/AccountSearch'
import { useTopLps } from '../../../contexts/Analytics/GlobalData'
import LocalLoader from '../components/LocalLoader'
import { RowBetween } from '../../../components/Row'
import {Search} from '../components/Search'

const AccountWrapper = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

function AccountLookup() {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const topLps = useTopLps()

  const below600 = useMedia('(max-width: 600px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Wallet analytics</TYPE.largeHeader>
          {!below600 && <Search small  />}
        </RowBetween>
        <AccountWrapper>
          <AccountSearch />
        </AccountWrapper>
        <TYPE.main fontSize='1.125rem' style={{ marginTop: '2rem' }}>
          Top Liquidity Positions
        </TYPE.main>
        <Panel>{topLps && topLps.length > 0 ? <LPList lps={topLps} maxItems={200} /> : <LocalLoader />}</Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(AccountLookup)
