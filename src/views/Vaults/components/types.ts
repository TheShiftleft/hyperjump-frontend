export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APR: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'vault',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'apy',
    sortable: true,
    label: 'APY',
  },
  {
    id: 5,
    name: 'amountDeposited',
    sortable: true,
    label: 'Deposited',
  },
  {
    id: 6,
    name: 'allowance',
    sortable: true,
    label: 'Allowance',
  },
  {
    id: 7,
    name: 'price',
    sortable: true,
    label: 'Price',
  },
]

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'vault',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'apy',
    sortable: true,
    label: 'APY',
  },
  {
    id: 3,
    name: 'tvl',
    sortable: true,
    label: 'TVL',
  },
  {
    id: 4,
    name: 'walletBalance',
    sortable: true,
    label: 'Balance',
  },
  {
    id: 5,
    name: 'amountDeposited',
    sortable: true,
    label: 'Deposited',
  },
  {
    id: 6,
    name: 'allowance',
    sortable: true,
    label: 'Allowance',
  },
  {
    id: 7,
    name: 'price',
    sortable: true,
    label: 'Price',
  },
]

export enum ViewMode {
  'TABLE' = 'TABLE',
  'CARD' = 'CARD',
}
