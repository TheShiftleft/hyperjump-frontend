import React from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { Text } from 'uikit'

const sizeSwitch = 80;

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 61px;
`

const BackgroundText = styled(Text)`
  position: relative;
  text-align: center;
  height: 0;
  top: 12px;
  color: white;
`

const Switch = styled.div`
  background-color: #05193c;
  cursor: pointer;
  display: block;
  position: relative;
  float: left;
  width: 326px;
  height: 100%;
  padding: 8px;
  border-radius: 300px;
`

const Handle = styled.span`
  display: block;
  background-color: white;
  height: 45px;
  width: 45px;
  border-radius: 50%;
`

function ZapSlider({ handlerZap }: { handlerZap?: React.FC }) {

  const conditionMove = () => {
  
    // if(parseInt(switchHandle.css('left')) === (sizeSwitch)) {
    //   console.log(123) 
    // }
    // switchHandle.animate({
    //   left: 0
    // }, 100);
  }

  return (
    <Container>
      <Switch>
        <BackgroundText>Slide to Zap</BackgroundText>
        <Draggable
          axis="x"
          bounds={{left: 0, right: 265}}
          onStop={conditionMove}
        >
          <Handle/>  
        </Draggable>
      </Switch>
    </Container>
  )
}

export default ZapSlider
