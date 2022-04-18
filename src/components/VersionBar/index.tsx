import React from 'react'
import styled from 'styled-components'
import { Text, ButtonMenu, ButtonMenuItem, Button, HelpIcon, Link } from 'uikit'
import getNetwork from 'utils/getNetwork'

const Wrapper = styled.div`
  position: relative;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px;
`

const { chainId } = getNetwork()
const oldFarmLink = chainId === 56 ? 'https://bscfarmv2.hyperjump.app/' : 'https://ftmfarmv2.hyperjump.app/'
const newFarmLink = chainId === 250 ? 'https://bsc.hyperjump.app/' : 'https://ftm.hyperjump.app/'

const VersionBar = () => {
  return (
    <Wrapper>
      <Text bold mr="16px">
        Farm Version:
      </Text>
      <ButtonMenu variant="primary" scale="sm" activeIndex={0}>
        <ButtonMenuItem as="a" href={newFarmLink}>
          V2.1
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href={oldFarmLink}>
          V2.0 (old)
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default VersionBar
