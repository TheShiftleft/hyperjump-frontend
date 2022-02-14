import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { FarmConfig, PoolConfig, VaultConfig, LotteryStatus, LotteryTicket } from 'config/constants/types'
import { ChainId } from '@hyperjump-defi/sdk'
import { PopupContent } from './application/actions'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }

export type SerializedBigNumber = string

export interface Farm extends FarmConfig {
  tokenAmountMc?: SerializedBigNumber
  quoteTokenAmountMc?: SerializedBigNumber
  tokenAmountTotal?: SerializedBigNumber
  quoteTokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  startTime?: number
  endTime?: number
  userData?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  startBlock?: number
  endBlock?: number
  apr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  isAutoVault?: boolean
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

// Slices states

export type FarmsState = Record<ChainId, ChainFarmsState>

export interface ChainFarmsState {
  data: Farm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export type PoolsState = Record<ChainId, ChainPoolsState>

export interface ChainPoolsState {
  data: Pool[]
  userDataLoaded: boolean
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// Vaults
export interface Vault extends VaultConfig {
  tvl: SerializedBigNumber
  pricePerFullShare: SerializedBigNumber
}

export type VaultAllowanceData = Array<SerializedBigNumber>
export type VaultApyData = Record<string, number>
export interface VaultBalanceEntry {
  tokenAddress: string
  tokenBalance: SerializedBigNumber
}
export type VaultBalanceData = Record<string, VaultBalanceEntry>
export type VaultTokenPriceData = Record<string, number>
export type VaultLpPriceData = Record<string, number>

export interface VaultPriceData {
  tokens: VaultTokenPriceData
  lps: VaultLpPriceData
}

export interface ChainVaultsState {
  vaults: Vault[]
  apys: VaultApyData
  prices: VaultPriceData
  balances: VaultBalanceData
  allowances: VaultAllowanceData
}

export type VaultsState = Record<ChainId, ChainVaultsState>

// Lottery

export interface LotteryRoundUserTickets {
  isLoading?: boolean
  tickets?: LotteryTicket[]
}

interface LotteryRoundGenerics {
  isLoading?: boolean
  lotteryId: string
  status: LotteryStatus
  startTime: string
  endTime: string
  treasuryFee: string
  firstTicketId: string
  lastTicketId: string
  finalNumber: number
}

export interface LotteryRound extends LotteryRoundGenerics {
  userTickets?: LotteryRoundUserTickets
  priceTicketInFarmingToken: BigNumber
  amountCollectedInFarmingToken: BigNumber
  farmingTokenPerBracket: string[]
  countWinnersPerBracket: string[]
  rewardsBreakdown: string[]
}

export interface LotteryResponse extends LotteryRoundGenerics {
  priceTicketInFarmingToken: SerializedBigNumber
  amountCollectedInFarmingToken: SerializedBigNumber
  farmingTokenPerBracket: SerializedBigNumber[]
  countWinnersPerBracket: SerializedBigNumber[]
  rewardsBreakdown: SerializedBigNumber[]
}

export interface LotteryState {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
  isTransitioning: boolean
  currentRound: LotteryResponse & { userTickets?: LotteryRoundUserTickets }
  lotteriesData?: LotteryRoundGraphEntity[]
  userLotteryData?: LotteryUserGraphEntity
}

export interface LotteryRoundGraphEntity {
  id: string
  totalUsers: string
  totalTickets: string
  winningTickets: string
  status: LotteryStatus
  finalNumber: string
  startTime: string
  endTime: string
  ticketPrice: SerializedBigNumber
}

export interface LotteryUserGraphEntity {
  account: string
  totalFarmingToken: string
  totalTickets: string
  rounds: UserRound[]
}

export interface UserRound {
  claimed: boolean
  lotteryId: string
  status: LotteryStatus
  endTime: string
  totalTickets: string
  tickets?: LotteryTicket[]
}

export type UserTicketsResponse = [ethers.BigNumber[], number[], boolean[]]

// General

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  blockNumber: { [chainId: number]: number }
  popupList: PopupList
  walletModalOpen: boolean
  settingsMenuOpen: boolean
  chainId: ChainId
}

export enum HistoryFilter {
  ALL = 'all',
  COLLECTED = 'collected',
  UNCOLLECTED = 'uncollected',
}

// Global state

export interface State {
  application: ApplicationState
  block: BlockState
  farms: FarmsState
  pools: PoolsState
  vaults: VaultsState
  lottery: LotteryState
}
