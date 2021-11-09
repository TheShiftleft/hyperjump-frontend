import React from 'react'
import { LotteryButtonMenu, LotteryButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'



const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <LotteryButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="md" variant="subtle">
      <LotteryButtonMenuItem>{t('Your History')}</LotteryButtonMenuItem>
      <LotteryButtonMenuItem>{t('All History')}</LotteryButtonMenuItem>
    </LotteryButtonMenu>
  )
}

export default HistoryTabMenu
