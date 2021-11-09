/* eslint-disable react/jsx-pascal-case */

import React, { useEffect } from 'react'
import 'feather-icons'
import { useMedia } from 'react-use'

import { TYPE, PageWrapper, FullWrapper } from '../components'
import Panel from '../components/Panel'
import { useAllPairData } from '../../../contexts/Analytics/PairData'
import PairList from '../components/PairList'
import { RowBetween } from '../../../components/Row'
import {Search} from '../components/Search'

function AllPairsPage() {
  const allPairs = useAllPairData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Top Pairs</TYPE.largeHeader>
          {!below800 && <Search small  />}
        </RowBetween>
        <Panel style={{ padding: below800 && '1rem 0 0 0 ' }}>
          <PairList pairs={allPairs} disbaleLinks  maxItems={50} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllPairsPage
