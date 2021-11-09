import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import styled from 'styled-components'
import { Button, useModal, Image, Flex, Text } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { getAddress, getMechAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { Pool } from 'state/types'
import { PoolCategory } from 'config/constants/types'
import getNetwork from 'utils/getNetwork'
import MechsModal from './MechsModal'
import Spacer from '../../../components/Spacer'

interface MechConverterProps {
  pool: Pool
}

const MechConverter: React.FC<MechConverterProps> = ({ pool }) => {
  const { sousId, stakingToken, poolCategory, userData } = pool
  const { account } = useWeb3React()
  const [pendingTx] = useState(false)
  const stakingTokenContract = useERC20(getAddress(stakingToken.address))
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { onUnstake } = useSousUnstake(sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { handleApprove } = useSousApprove(stakingTokenContract, sousId, 'MECHS')
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const allowance = new BigNumber(userData?.allowance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const { balance: mechBalance } = useTokenBalance(getMechAddress())
  const { config } = getNetwork()

  const [onPresentWithdraw] = useModal(
    <MechsModal title="Disassemble MECHs" max={mechBalance} onConfirm={onUnstake} tokenName="MECHs" />,
  )
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const [onPresentDeposit] = useModal(
    <MechsModal title="Assemble MECHs" max={stakingTokenBalance} onConfirm={onStake} tokenName={stakingToken.symbol} />,
  )
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  return (
    <Card>
      <StyledFlex justifyContent="space-between">
        <StyledInfoCard>
          <StyledImage src={`/images/tokens/${config.farmingToken.symbol.toLowerCase()}.png`} width={72} height={72} alt="alloy" />
          <Text color="primary" fontSize="10px" style={{ textAlign: 'center' }} bold>
            {`${config.farmingToken.symbol} Available`}
          </Text>
          <StyledText2 color="text" bold>
            <Balance fontSize="14px" value={getBalanceNumber(stakingTokenBalance)} />
          </StyledText2>
        </StyledInfoCard>
        <StyledInfoCard>
          <StyledImage src="/images/tokens/mech.png" width={72} height={72} alt="mech" />
          <Text color="primary" fontSize="10px" style={{ textAlign: 'center' }} bold>
            MECHS Available
          </Text>
          <StyledText2 color="text" bold>
            <Balance fontSize="14px" value={getBalanceNumber(mechBalance)} />
          </StyledText2>
        </StyledInfoCard>
      </StyledFlex>
      {!account && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <UnlockButton
            style={{ height: '30px', width: '136px', borderRadius: '15px', padding: '0 12px', fontSize: '12px' }}
          />
        </div>
      )}
      {account &&
        (needsApproval ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleApprove}
              style={{ height: '30px', width: '136px', borderRadius: '15px', padding: '0 12px', fontSize: '12px' }}
            >
              {`Approve ${stakingToken.symbol}`}
            </Button>
          </div>
        ) : (
          <StyledFlex2 justifyContent="space-between">
            <StyledButton color="primary" onClick={onPresentDeposit}>
              <StyledText color="white" fontSize="11px" bold>
                Build MECHS
              </StyledText>
            </StyledButton>
            <Spacer size="sm" />
            <StyledButton
              color="primary"
              disabled={mechBalance.eq(new BigNumber(0)) || pendingTx}
              onClick={onPresentWithdraw}
            >
              <StyledText color="white" fontSize="11px" bold>
                {`Convert to ${config.farmingToken.symbol}`}
              </StyledText>
            </StyledButton>
          </StyledFlex2>
        ))}
    </Card>
  )
}

const StyledInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 20px;
  padding: 2px 5px;
  align-items: center;
  width: 75px;
  margin-bottom: 6px;
  margin-top: 10px;
  border: 1px solid black;
  @media (min-width: 390px) {
    width: 100px;
    padding: 4px 7px;
  }
`

const StyledImage = styled(Image)`
  width: 36px;
  height 36px;
  @media (min-width: 390px) {
    width: 72px;
    height 72px;
  }
`

const StyledFlex = styled(Flex)`
  margin: auto;
  width: 176px;
  @media (min-width: 390px) {
    width: 238px;
  }
`

const StyledFlex2 = styled(Flex)`
  margin: auto;
  width: 230px;
  @media (min-width: 390px) {
    width: 276px;
  }
`

const StyledButton = styled(Button)`
  width: 136px;
  height: 20px;
  border-radius: 15px;
  padding: 0 12px;
  @media (min-width: 390px) {
    height: 30px;
  }
`

const StyledText = styled(Text)`
  font-size: 10px;
`

const StyledText2 = styled(Text)`
  font-size: 10px;
  @media (min-width: 390px) {
    font-size: 14px;
  }
`

const Card = styled.div`
  background: ${(props) => props.theme.card.background};
  background: url(/images/factory-bg.png) no-repeat;
  width: 300px;
  height 138px;
  background-size: 300px 138px;
  @media (min-width: 390px) {
    background-size: cover;
    width: 390px;
    height 175px;
  }
`

export default MechConverter
