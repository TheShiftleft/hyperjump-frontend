import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, useModal } from 'uikit'
import Container from 'components/Container'
import AppBody from '../AppBody'
import CardNav from '../CardNav'

const Zap = () => {

    return(
        <Container>
            <CardNav />
            <AppBody>
                <Text>
                    Zap form here
                </Text>
            </AppBody>
        </Container>
    )
}

export default Zap