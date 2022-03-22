import React, { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Button, Flex } from 'uikit'
import styled from 'styled-components'
import getNetwork from 'utils/getNetwork'
import farms20 from 'config/constants/farms20'
import { FarmConfig } from 'config/constants/types'
import { useMasterchef20 } from 'hooks/useContract'
import { getMasterChef20UserInfos } from 'utils/callHelpers'
import FarmMigratePool from './FarmMigratePool'
import FarmMigrateXjump from './FarmMigrateXjump'

const FarmV20Migrator = () => {
  // state
  const [allUserPoolInfo, setAllUserPoolsInfo] = useState([])
  const [gotPoolsInfo, setGotPoolsInfo] = useState(false)
  const [counter, setCounter] = useState(0)
  const [canMigrate, setCanMigrate] = useState(false)

  // info vars
  const { account } = useWeb3React()
  const { config, chainId } = getNetwork()
  const masterchef20Contract = useMasterchef20()

  // local vars that we know won't change
  const poolLength = 15
  const pidsToExcludeInOldFarmConfig = { 56: [5, 6], 250: [5, 11] }
  const oldWrappedFarmingTokenPid = { 56: 6, 250: 5 }

  // get user info for all pools if not already fetched
  useEffect(() => {
    let isMounted = true
    if (!gotPoolsInfo && account && poolLength > 0) {
      let allUserInfos = []

      const fetchUserInfo = async () => {
        allUserInfos = await getMasterChef20UserInfos(poolLength, account)
        Promise.all(allUserInfos)
      }

      fetchUserInfo().then(() => {
        if (isMounted) {
          setAllUserPoolsInfo(allUserInfos)
          setCounter(counter + 1)
          setGotPoolsInfo(true)
        }
      })
    }
    return () => {
      isMounted = false
    }
  }, [gotPoolsInfo, account, counter, poolLength, masterchef20Contract, allUserPoolInfo])

  // check if user has deposited in farm 2.0 and set canMigrate
  useEffect(() => {
    let isMounted = true

    if (allUserPoolInfo.length && account && gotPoolsInfo && !canMigrate) {
      const seeIfCanMigrate = async () => {
        allUserPoolInfo.map((userInfo) => {
          if (userInfo[0] > 0) {
            if (isMounted) {
              setCanMigrate(true)
            }
            return false
          }
          return false
        })
      }
      seeIfCanMigrate()
    }
    return () => {
      isMounted = false
    }
  }, [account, allUserPoolInfo, gotPoolsInfo, canMigrate])

  return (
    <StyledFarmMigrator>
      <CardBody>
        <Flex justifyContent="space-between" mb="20px">
          <Flex flexDirection="column">
            <Heading scale="xl">
              <HeadingColor>Farm V2.0 Migrator</HeadingColor>
            </Heading>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            {account && canMigrate && (
              <MigrateButton
                onClick={async () => {
                  setGotPoolsInfo(false)
                }}
              >
                {!gotPoolsInfo ? 'Loading pools...' : 'Reload'}
              </MigrateButton>
            )}
          </Flex>
        </Flex>
        {!gotPoolsInfo && account ? (
          <Heading>Loading pools...</Heading>
        ) : (
          <>
            {(account && !canMigrate) || !account ? <Heading>Nothing for to migrate.</Heading> : false}
            <br />
            {/* first staking pool */}
            {allUserPoolInfo.map((pool) => {
              const pid = allUserPoolInfo.indexOf(pool)
              const amount: string = pool[0]

              if (pid === oldWrappedFarmingTokenPid[chainId] && pool[0] > 0) {
                return <FarmMigrateXjump key={pid} pid={pid} stakedBalance={amount} />
              }

              return false
            })}

            {/* then farms  */}
            {allUserPoolInfo.map((pool) => {
              const pid = allUserPoolInfo.indexOf(pool)
              const amount: string = pool[0]

              if (pid !== oldWrappedFarmingTokenPid[chainId] && pool[0] > 0) {
                const farms20PoolsConfig = farms20[config.network]
                const farm20PoolConfig: FarmConfig = farms20PoolsConfig.find((farmPool20) => farmPool20.pid === pid)
                const farm20PoolName: string = farm20PoolConfig?.lpSymbol
                const lpTokenAddress: string = farm20PoolConfig?.lpAddresses[chainId]

                if (!pidsToExcludeInOldFarmConfig[chainId].includes(pid)) {
                  return (
                    <div key={pid}>
                      <FarmMigratePool
                        pid={pid}
                        name={farm20PoolName}
                        stakedBalance={amount}
                        lpToken={lpTokenAddress}
                      />
                    </div>
                  )
                }
              }

              return false
            })}
          </>
        )}
      </CardBody>
    </StyledFarmMigrator>
  )
}

export default FarmV20Migrator

const StyledFarmMigrator = styled(Card)`
  background-color: rgba(2, 5, 11, 0.7);
  border-radius: ${({ theme }) => theme.radii.card};
  border-radius: 50px;
  &::after {
    content: '';
    background-image: url('images/haru/haru-thumbs-up.png');
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: 180px 180px;
    background-position: right -60px bottom 0px;
    background-size: 300px;
    position: absolute;
    z-index: -1;
  }
`

const HeadingColor = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: Bebas neue, cursive;
`

const MigrateButton = styled(Button)`
  max-height: 30px;
  padding: 5px !important;
  margin: 5px !important;
  border-radius: 5px;
  color: black;
`
