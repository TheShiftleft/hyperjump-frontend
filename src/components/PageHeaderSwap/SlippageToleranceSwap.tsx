import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Flex, Input, Text } from 'uikit'
import { useUserSlippageTolerance } from 'state/user/hooks'
import QuestionHelper from '../QuestionHelper'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const Option = styled.div`
  padding: 0 4px;
`

const Options = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const SlippageBox = styled(Box)`
  padding: 0;
`

const SlippageButton = styled(Button)`
  border: 2px solid #44c4e2;
  border-radius: 14px;
  background-color: transparent;
  color: white;
  max-height: 35px;
  font-weight: 400;
  font-size: 14px;
  width: 45px;

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
    width: 55px;
  }
`

const InputContainer = styled(Flex)`
  border: 2px solid #44c4e2;
  border-radius: 14px;
  background-color: transparent;
  margin-left: 8px;
  max-height: 35px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const SlippageInput = styled(Input)`
  border: none;
  color: white;
  max-height: 35px;
  text-align: right;
  padding-right: 0;
  font-size: 14px;
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
]

type SlippageToleranceSettingsModalProps = {
  translateString: (translationId: number, fallback: string) => string
}

const SlippageToleranceSwap = ({ translateString }: SlippageToleranceSettingsModalProps) => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError(translateString(1144, 'Enter a valid slippage percentage'))
      }
    } catch {
      setError(translateString(1144, 'Enter a valid slippage percentage'))
    }
  }, [value, setError, setUserslippageTolerance, translateString])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError(translateString(1146, 'Your transaction may fail'))
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError(translateString(1148, 'Your transaction may be frontrun'))
    }
  }, [userSlippageTolerance, setError, translateString])

  return (
    <SlippageBox>
      <Options>
        <Flex mr={[0, 0, '8px']}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <SlippageButton variant={value === predefinedValue ? 'primary' : 'tertiary'} onClick={handleClick}>
                  {label}
                </SlippageButton>
              </Option>
            )
          })}
        </Flex>
        <InputContainer alignItems="center">
          <SlippageInput
            type="number"
            scale="lg"
            step={0.1}
            min={0.1}
            placeholder="5"
            value={value}
            onChange={handleChange}
            isWarning={error !== null}
          />
          <Text ml="5px" mr="5px">
            %
          </Text>
        </InputContainer>
      </Options>
      <Flex alignItems="center" justifyContent="flex-end" mt="5px">
        <Text>{translateString(88, 'Slippage')}</Text>
      </Flex>
      {error && <Text color="failure">{error}</Text>}
    </SlippageBox>
  )
}

export default SlippageToleranceSwap
