/* eslint-disable vars-on-top */
import React, { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import styled from 'styled-components'
import { usePrevious } from 'react-use'
import { Play } from 'react-feather'
import { formattedNum } from '../../../../utils/analytics'
import { useDarkModeManager } from '../../../../contexts/Analytics/LocalStorage'
import { IconWrapper } from '..'

dayjs.extend(utc)

export const CHART_TYPES = {
  BAR: 'BAR',
  AREA: 'AREA'
}

const Wrapper = styled.div`
  position: relative;
`

// constant height for charts
const HEIGHT = 300

const TradingViewChart = ({
  type = CHART_TYPES.BAR,
  data,
  base,
  baseChange,
  field,
  title,
  width,
  useWeekly = false
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrev = usePrevious(data)

  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      let tooltip = document.getElementById(`tooltip-id${type}`)
      let node = document.getElementById(`test-id${type}`)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrev, type])

  // parese the data and format for tardingview consumption
  const formattedData = data?.map(entry => {
    return {
      time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
      value: parseFloat(entry[field])
    }
  })

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if them switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      let tooltip = document.getElementById(`tooltip-id${type}`)
      let node = document.getElementById(`test-id${type}`)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme, type])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && formattedData) {
      let chart = createChart(ref.current, {
        width,
        height: HEIGHT,
        layout: {
          backgroundColor: 'transparent',
          textColor
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0
          },
          borderVisible: false
        },
        timeScale: {
          borderVisible: false
        },
        grid: {
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          },
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          }
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false
          }
        },
        localization: {
          priceFormatter: val => formattedNum(val, true)
        }
      })

      let series =
        type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
              color: '#8be1ea',
              priceFormat: {
                type: 'volume'
              },
              scaleMargins: {
                top: 0.32,
                bottom: 0
              },
              lineColor: '#8be1ea',
              lineWidth: 3
            })
          : chart.addAreaSeries({
              topColor: '#8be1ea',
              bottomColor: 'rgba(112, 82, 64, 0)',
              lineColor: '#8be1ea',
              lineWidth: 3
            })

      series.setData(formattedData)
      let toolTip = document.createElement('div')
      toolTip.setAttribute('id', `tooltip-id${type}`)
      toolTip.className = darkMode ? 'three-line-legend-dark' : 'three-line-legend'
      ref.current.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.fontWeight = '500'
      toolTip.style.left = '-4px'
      toolTip.style.top = '-8px'
      toolTip.style.backgroundColor = 'transparent'

      // format numbers
      let percentChange = baseChange?.toFixed(2)
      let formattedPercentChange = `${(percentChange > 0 ? '+' : '')}${percentChange}%`
      let color = percentChange >= 0 ? 'green' : 'red'

      // get the title of the chart
      const setLastBarText = () => {
        toolTip.innerHTML =
          `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title} ${
            type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''
          }</div>
          <div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >
            ${formattedNum(base ?? 0, true)}
            <span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>
          </div>`
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(({ param }) => {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText()
        } else {
          let date = `${param.time.year}-${param.time.month}-${param.time.day}`;
          let dateStr = useWeekly
            ? `${dayjs(date).startOf('week').format('MMMM D, YYYY')}-${dayjs(date).endOf('week').format('MMMM D, YYYY')}`
            : dayjs(date).format('MMMM D, YYYY')
          let price = param.seriesPrices.get(series)

          toolTip.innerHTML =
            `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>
            <div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">
            ${(formattedNum(price, true))}
            </div>
            <div>
            ${dateStr}
            </div>`
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [
    base,
    baseChange,
    chartCreated,
    darkMode,
    data,
    formattedData,
    textColor,
    title,
    topScale,
    type,
    useWeekly,
    width
  ])

  // responsiveness
  useEffect(() => {
    if (width) {
      if (chartCreated) chartCreated.resize(width, HEIGHT)
      if (chartCreated) chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, width])

  return (
    <Wrapper>
      <div ref={ref} id={` test-id${type}`} />
      <IconWrapper>
        <Play
          onClick={() => {
            if (chartCreated) chartCreated.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </Wrapper>
  )
}

export default TradingViewChart
