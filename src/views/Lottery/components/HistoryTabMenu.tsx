import React from 'react'
import { LotteryButtonMenu, LotteryButtonMenuItem } from 'uikit'

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  return (
    <LotteryButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="md" variant="subtle">
      <LotteryButtonMenuItem>Your History</LotteryButtonMenuItem>
      <LotteryButtonMenuItem>All History</LotteryButtonMenuItem>
    </LotteryButtonMenu>
  )
}

export default HistoryTabMenu
