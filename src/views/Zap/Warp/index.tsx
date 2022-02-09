import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import Container from 'components/Container'
import AppBody from 'components/Zap/AppBody'
import CardNav from 'components/Zap/CardNav'

const Warp = () => {

    return(
        <Container>
            <CardNav activeIndex={1}/>
            <AppBody>
                <Text>
                    Warp Form form here
                </Text>
            </AppBody>
        </Container>
    )
}

export default Warp