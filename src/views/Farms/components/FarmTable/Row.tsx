import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useMatchBreakpoints } from 'uikit'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/hooks'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;
`

const StyledRow = styled.td`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const StyledRowContainer = styled.tr`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: rgba(13, 29, 54, 0.4);

  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { details, userDataReady } = props
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    // setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isXl, isXs } = useMatchBreakpoints()

  const isMobile = !isXl
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)
  // destructure caus vercel is a bitch!
  const { apr, farm, earned } = { ...props }

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledRow onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }
            switch (key) {
              case 'details':
                return (
                  <CellInner key={key}>
                    <CellLayout>
                      <Details actionPanelToggled={actionPanelExpanded} />
                    </CellLayout>
                  </CellInner>
                )
              case 'apr':
                return (
                  <CellInner key={key}>
                    <CellLayout label="APR">
                      <Apr {...apr} hideButton={isMobile} />
                    </CellLayout>
                  </CellInner>
                )
              default:
                return (
                  <CellInner key={key}>
                    <CellLayout label={tableSchema[columnIndex].label}>
                      {/* eslint-disable */}
                      {React.createElement(cells[key], { ...props[key], userDataReady })}
                    </CellLayout>
                  </CellInner>
                )
            }
          })}
        </StyledRow>
      )
    }

    return (
      <StyledRow onClick={toggleActionPanel}>
        <FarmMobileCell>
          <CellLayout>
            <Farm {...farm} />
          </CellLayout>
        </FarmMobileCell>
        <EarnedMobileCell>
          <CellLayout label={'Earned'}>
            <Earned {...earned} userDataReady={userDataReady} />
          </CellLayout>
        </EarnedMobileCell>
        <AprMobileCell>
          <CellLayout label={'APR'}>
            <Apr {...apr} hideButton={isMobile} />
          </CellLayout>
        </AprMobileCell>
        <CellInner>
          <CellLayout>
            <Details actionPanelToggled={actionPanelExpanded} />
          </CellLayout>
        </CellInner>
      </StyledRow>
    )
  }

  return (
    <StyledRowContainer>
      {handleRenderRow()}
      {shouldRenderChild && <ActionPanel {...props} expanded={actionPanelExpanded} />}
    </StyledRowContainer>
  )
}

export default Row
