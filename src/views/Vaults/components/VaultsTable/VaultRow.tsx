import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { Vault } from 'state/types'
import { VaultUserData } from 'views/Vaults/types'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import calcDaily from 'utils/calcDaily'

import NameCell from './Cells/NameCell'
import BalanceCell from './Cells/BalanceCell'
import ApyCell from './Cells/ApyCell'
import TotalDepositedCell from './Cells/TotalDepositedCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './Actions/ActionPanel'

export interface VaultRowProps extends VaultUserData {
  vault: Vault
  apy: BigNumber
  price: BigNumber
  tvl: BigNumber
}

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const StyledRowContainer = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 1% 2%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: rgba(13, 29, 54, 0.5);
  backdrop-filter: blur(2px);
`

const UserCells = styled.div`
  display: flex;
  flex-basis: 30%;
  justify-content: space-around;
  flex-direction: row;
`

const VaultRow: React.FC<VaultRowProps> = (props) => {
  const { vault, apy, price, tvl, allowance, amountDeposited, walletBalance } = props
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <StyledRowContainer>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell vault={vault} />
        {!(isXs || isSm) && (
          <UserCells>
            <BalanceCell
              title="Balance"
              balance={walletBalance}
              balanceUsd={walletBalance.multipliedBy(price).div(BIG_TEN.pow(vault.tokenDecimals))}
            />
            <BalanceCell
              title="Deposited"
              balance={amountDeposited}
              balanceUsd={amountDeposited.multipliedBy(price).div(BIG_TEN.pow(vault.tokenDecimals))}
            />
          </UserCells>
        )}
        <ApyCell title="APY" apy={apy} />
        <ApyCell title="DAILY" apy={calcDaily(apy)} />
        {(isLg || isXl) && <TotalDepositedCell tvl={tvl} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isMd || isLg || isXl} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <StyledRow>
          <ActionPanel
            price={price}
            expanded={expanded}
            vault={vault}
            allowance={allowance}
            amountDeposited={amountDeposited}
            walletBalance={walletBalance}
            tvl={tvl}
          />
        </StyledRow>
      )}
    </StyledRowContainer>
  )
}

export default VaultRow
