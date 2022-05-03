import React, { useEffect, useMemo, useRef, useState } from 'react'
import Container from 'components/Container'
import styled from 'styled-components';
import { AppBody, PageHeader, CardBody } from 'components/Tools'
import { SearchInput } from 'components/NetworkSelectionModal/styleds';
import { useChains } from 'hooks/api';
import { Button, ChevronUpIcon } from 'uikit';
import ChainlistTable, { Chain } from './Table'

const StyledSearchContainer = styled.div`
  margin-bottom: 20px;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0px;
  padding-bottom: px;
`

const NUMBER_OF_CHAINS_VISIBLE = 10

const Chainlist = () => {
  const chains:Chain[] = useChains()
  const [searchQuery, setSearchQuery] = useState('')
  const [numberOfChainsVisible, setNumberOfChainsVisible] = useState(NUMBER_OF_CHAINS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const searchedChain = useMemo(() => {
    return searchQuery === '' ? chains?.slice(0, numberOfChainsVisible) :
    chains.filter((chain) => {
      return (
        chain.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.chainId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chain.nativeCurrency ? chain.nativeCurrency.symbol : '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    })?.slice(0, numberOfChainsVisible) 
  },[searchQuery, chains, numberOfChainsVisible])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfChainsVisible((chainsCurrentlyVisible) => chainsCurrentlyVisible + NUMBER_OF_CHAINS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])
  const tableWrapperEl = useRef<HTMLDivElement>(null)

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Container ref={tableWrapperEl}>
      <AppBody>
        <PageHeader type='chainlist' description="Powered by Chainlist.org" />
        <CardBody>
          <StyledSearchContainer>
            <SearchInput onChange={({target}) => setSearchQuery(target.value)} placeholder='Search Networks: Eth, Fantom, ...'/>
          </StyledSearchContainer>
          <ChainlistTable chains={searchedChain}/>
          <div ref={loadMoreRef} />
          <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              To Top
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer>
        </CardBody>
      </AppBody>
    </Container>
  )
}

export default Chainlist