/* eslint-disable react/require-default-props */
import React from 'react'
import styled from 'styled-components'
import ToggleView from 'views/Pools/components/ToggleView/ToggleView'
import { Toggle, Text } from 'uikit'

import { ViewMode } from 'views/Farms/components/types'
import TabButtons from './TabButtons'
import Select, { OptionProps } from './Select/Select'
import SearchInput from './SearchInput'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

interface ViewControlProps {
  rootPath: string
  viewMode: ViewMode
  setViewMode?: () => void
  stakedOnly: boolean
  setStakedOnly: (stakedOnly: boolean) => void
  hasStakeInFinished: boolean
  options: Array<any>
  handleOptionChange: (option: OptionProps) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ViewControl: React.FC<ViewControlProps> = (props: ViewControlProps) => {
  const {
    viewMode,
    rootPath,
    setViewMode,
    stakedOnly,
    setStakedOnly,
    hasStakeInFinished,
    options,
    handleOptionChange,
    handleSearchChange,
  } = props

  return (
    <ControlContainer>
      <ViewControls>
        {!!setViewMode && <ToggleView viewMode={viewMode} onToggle={setViewMode} />}
        <ToggleWrapper>
          <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
          <Text>Staked only</Text>
        </ToggleWrapper>
        <TabButtons rootPath={rootPath} hasStakeInFinished={hasStakeInFinished} />
      </ViewControls>
      <FilterContainer>
        <LabelWrapper>
          <Text textTransform="uppercase">Sort by</Text>
          <Select options={options} onChange={handleOptionChange} />
        </LabelWrapper>
        <LabelWrapper style={{ marginLeft: 16 }}>
          <Text textTransform="uppercase">Search</Text>
          <SearchInput onChange={handleSearchChange} placeholder="Search" />
        </LabelWrapper>
      </FilterContainer>
    </ControlContainer>
  )
}

export default ViewControl
