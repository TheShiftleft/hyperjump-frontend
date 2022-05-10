import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Vault } from 'state/types'
import BigNumber from 'bignumber.js'
import { Link } from 'uikit'
import DepositAction from './DepositAction'
import WithdrawAction from './WithdrawAction'

export interface ActionPanelProps {
  vault: Vault
  expanded: boolean
  price: BigNumber
  allowance: BigNumber
  amountDeposited: BigNumber
  walletBalance: BigNumber
  tvl: BigNumber
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0 12px;
  cursor: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  margin-left: 0;
  flex-direction: column;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`

const StyledLink = styled(Link)`
  font-weight: 400;
`

const StyledLinkWrapper = styled.div`
  background-color: rgba(13, 29, 54, 0.6);
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 8px;
  flex-direction: row;
  justify-content: space-evenly;
  display: flex;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  vault,
  expanded,
  allowance,
  walletBalance,
  amountDeposited,
  price,
}) => {
  return (
    <Container expanded={expanded}>
      <ActionContainer>
        <DepositAction
          vault={vault}
          allowance={allowance}
          walletBalance={walletBalance}
          amountDeposited={amountDeposited}
          price={price}
        />
        <WithdrawAction
          vault={vault}
          allowance={allowance}
          walletBalance={walletBalance}
          amountDeposited={amountDeposited}
          price={price}
        />
        <StyledLinkWrapper>
          <StyledLink href={vault.addLiquidityUrl}>Add liquity</StyledLink>
          <StyledLink href={vault.buyTokenUrl}>Buy tokens</StyledLink>
        </StyledLinkWrapper>
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
