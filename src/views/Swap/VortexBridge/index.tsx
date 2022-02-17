import { Currency, CurrencyAmount, JSBI, Token, Trade, ChainId } from '@hyperjump-defi/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { BigNumber as EthBigNumber} from '@ethersproject/bignumber'
import { BIG_TEN } from 'utils/bigNumber'
import  { Redirect, Route } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import { CardBody, ArrowDownIcon, Button, IconButton, AutoRenewIcon, Text, useModal, ChevronDownIcon } from 'uikit'
import Modal from 'components/Modal'
import styled, { ThemeContext } from 'styled-components'
import Card, { GreyCard } from 'components/Card'
import { darken } from 'polished'
import { AutoColumn } from 'components/Column'
import NetworkBridgeInputPanel from 'components/NetworkBridgeInputPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TransactionSubmittedContent from 'components/TransactionConfirmationModal/TransactionSubmittedContent'

import ProgressSteps from 'components/ProgressSteps'
import Container from 'components/Container'
import NetworkLogo from 'components/NetworkLogo'
import bridgeNetworks from 'config/constants/bridgeNetworks'

import { BASE_EXCHANGE_URL, INITIAL_ALLOWED_SLIPPAGE } from 'config/index'
import { useFarms } from 'state/hooks'
import { ApprovalState, useApproveCallbackFromBridge } from 'hooks/useApproveCallback'
import { useBridgeCallback } from 'hooks/useBridgeCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedBridgeInfo, useBridgeActionHandlers, useBridgeState, useBridgeNetworkActionHandlers } from 'state/bridge/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { LinkStyledButton } from 'components/Shared'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import Loader from 'components/Loader'
import useI18n from 'hooks/useI18n'
import PageHeaderSwap from 'components/PageHeaderSwap'
import ConnectWalletButton from 'components/ConnectWalletButton'
import V2ExchangeRedirectModal from 'components/V2ExchangeRedirectModal'
import { getBalanceNumber } from 'utils/formatBalance'
import useGovTokenBurnRate from 'hooks/useGovTokenBurnRate'
import getNetwork from 'utils/getNetwork'
import NetworkSelectionModal from 'components/NetworkSelectionModal/NetworkSelectionModal'
import BigNumber from 'bignumber.js'
import AppBody from '../AppBody'

const NetworkSelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  margin-bottom: 10px;
  padding: 0 0.5rem;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  margin-bottom: 10px;
  padding: 0 0.5rem;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const Aligner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.colors.primary};
  padding:10px;
  border-radius: 8px;

`
const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-bottom: 20px;
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
  height: 70px;
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.textSubtle};
  z-index: 1;
  border: 2px solid #44c4e2;
  background-color: rgba(13, 29, 54, 0.5);

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-30%)')};
  transition: transform 300ms ease-in-out;
  opacity: ${({ show }) => (show ? '1' : '0')};
`
const Bridge = () => {
    const { config } = getNetwork()
    const { data, userDataLoaded } = useFarms()
    const loadedUrlParams = useDefaultsFromURLSearch()
    const TranslateString = useI18n()
    const [modalOpen, setModalOpen] = useState(false)
    const [input, setInput] = useState(false)
    const [bridgeTokensOnly] = useState(true)
    const [isOpen, setModalSubmitted] = useState(false)
    const [networkRedirect, setNetworkRedirect] = useState(false)
    const [toRedirect, setRedirect] = useState(false)
    const [isInvalidAmountWithFee, setInvalidAmountWithFee] = useState(false)
    const [transactionHash, setTransactionHash] = useState("") 
    const [fromBridgeNetworkKey, setFromBridgeNetworkKey] = useState("0") 
    const [toBridgeNetworkKey, setToBridgeNetworkKey] = useState("1")
    const [bridgingFee, setBridgeFee] = useState("0.0")
    const [amountToWithFee, setAmountToWithFee] = useState("0.0")
    const [modalCountdownSecondsRemaining, setModalCountdownSecondsRemaining] = useState(5)
    const [disableSwap, setDisableSwap] = useState(false)
    const [hasPoppedModal, setHasPoppedModal] = useState(false)
    const [interruptRedirectCountdown, setInterruptRedirectCountdown] = useState(false)
    const [onPresentV2ExchangeRedirectModal] = useModal(
        <V2ExchangeRedirectModal handleCloseModal={() => setInterruptRedirectCountdown(true)} />,
    )
    const onPresentV2ExchangeRedirectModalRef = useRef(onPresentV2ExchangeRedirectModal)

    useMemo(() => {
      // make sure that outputChain is not blank OR not equal to the current network otherwise redirect to the correct network
      if(loadedUrlParams?.outputChainId === '' || loadedUrlParams?.outputChainId === config.id.toString() || !loadedUrlParams ){ 
          Object.keys(bridgeNetworks)
          .forEach(function eachKey(key) { 
            if(bridgeNetworks[key].chainId === config.id)
                setFromBridgeNetworkKey(key)

            if(ChainId.BSC_MAINNET === config.id && bridgeNetworks[key].chainId === ChainId.FTM_MAINNET ){
              setToBridgeNetworkKey(key)
            }else if(ChainId.FTM_MAINNET === config.id && bridgeNetworks[key].chainId === ChainId.BSC_MAINNET ){
              setToBridgeNetworkKey(key)
            }
          });
      }
    }, [loadedUrlParams, config]) 

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])

    const { account } = useWeb3React()
    const [isExpertMode] = useExpertModeManager()

    // bridge state
    const { independentField, typedValue, recipient, outputChainId  } = useBridgeState()

    const { currencyBalances, parsedAmount, currencies, inputError: bridgeInputError } = useDerivedBridgeInfo()
        
    // Manage disabled trading pairs that should redirect users to V2
    useEffect(() => {
        const disabledSwaps = []
        const inputCurrencySymbol = currencies[Field.INPUT]?.symbol || ''
        const outputCurrencySymbol = currencies[Field.OUTPUT]?.symbol || ''
        const doesInputMatch = disabledSwaps.includes(inputCurrencySymbol)
        const doesOutputMatch = disabledSwaps.includes(outputCurrencySymbol)
        
        if (doesInputMatch && doesOutputMatch) {
            // Prevent infinite re-render of modal with this condition
            if (!hasPoppedModal) {
                setHasPoppedModal(true)
                onPresentV2ExchangeRedirectModalRef.current()
            }

            // Controls the swap buttons being disabled & renders a message
            setDisableSwap(true)

            const tick = () => {
                setModalCountdownSecondsRemaining((prevSeconds) => prevSeconds - 1)
            }
            const timerInterval = setInterval(() => tick(), 1000)

            if (interruptRedirectCountdown) {
                // Reset timer if countdown is interrupted
                clearInterval(timerInterval)
                setModalCountdownSecondsRemaining(5)
            }

            if (modalCountdownSecondsRemaining <= 0) {
                window.location.href = BASE_EXCHANGE_URL
            }

            return () => {
                clearInterval(timerInterval)
            }
        }

        // Unset disableSwap state if the swap inputs & outputs dont match disabledSwaps
        setDisableSwap(false)
        return undefined
    }, [
        currencies,
        hasPoppedModal,
        modalCountdownSecondsRemaining,
        onPresentV2ExchangeRedirectModalRef,
        interruptRedirectCountdown,
    ])

    const parsedAmounts =  {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : undefined,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : undefined,
    }

    const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useBridgeActionHandlers()
    const { onSwitchNetworks, onNetworkSelection } = useBridgeNetworkActionHandlers()

    const isValid = !bridgeInputError
    const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(Field.INPUT, value)
        },
        [onUserInput],
    )
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput],
    )
    
    // modal and loading
    const [{ showConfirm,  bridgeErrorMessage, attemptingTxn, txHash }, setBridgeState] = useState<{
        showConfirm: boolean
        attemptingTxn: boolean
        bridgeErrorMessage: string | undefined
        txHash: string | undefined
    }>({
        showConfirm: false,
        attemptingTxn: false,
        bridgeErrorMessage: undefined,
        txHash: undefined,
    })

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: parsedAmounts[dependentField]?.toSignificant(6)
    }

    // check whether the user has approved the router on the input token
    const [approval, approveCallback] = useApproveCallbackFromBridge((independentField === Field.INPUT ? parsedAmount : undefined))

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
        if (approval === ApprovalState.PENDING) {
            setApprovalSubmitted(true)
        }
    }, [approval, approvalSubmitted])

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow = useMemo(() => {
      return !bridgeInputError &&
        (approval === ApprovalState.NOT_APPROVED ||
        approval === ApprovalState.PENDING ||
        (approvalSubmitted && approval === ApprovalState.APPROVED)) 
    }, [bridgeInputError, approval, approvalSubmitted])
      

    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

    // the callback to execute the bridge
    const { callback: bridgeCallback, error: bridgeCallbackError, calculatedBridgeFee: calcFee } = useBridgeCallback(
        (independentField === Field.INPUT ? parsedAmount : undefined),
        bridgeNetworks[toBridgeNetworkKey],
        bridgeNetworks[fromBridgeNetworkKey],
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        recipient,
    )

    if(calcFee){
      calcFee.then((bridgeAmountAndFee) => {
        const amountWithFee = new BigNumber(bridgeAmountAndFee[0])
        setInvalidAmountWithFee(amountWithFee.isLessThan(0))
        setBridgeFee(bridgeAmountAndFee[1])
        setAmountToWithFee((amountWithFee.isGreaterThan(0) ? amountWithFee.toString() : new BigNumber("0.0").toString()))
      })
    }

    const handleConfirmDismiss = useCallback(() => {
      setBridgeState((prevState) => ({ ...prevState, showConfirm: false }))
  
      // if there was a tx hash, we want to clear the input
      setModalSubmitted(false)
      if (txHash) {
        onUserInput(Field.INPUT, '')
        onUserInput(Field.OUTPUT, '')
        setBridgeState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          bridgeErrorMessage: undefined,
          txHash: undefined,
        }))
      }
    }, [onUserInput, txHash, setBridgeState])
    
    const handleBridge = useCallback(() => {
      setBridgeState((prevState) => ({ ...prevState, attemptingTxn: true, bridgeErrorMessage: undefined, txHash: undefined }))
      if (!bridgeCallback) {
        return
      }
      
      bridgeCallback()
        .then((hash) => {
          setBridgeState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            bridgeErrorMessage: undefined,
            txHash: hash,
          }))
          if(hash){
            setTransactionHash(hash.transactionHash)
            setModalSubmitted(true)
            onUserInput(Field.INPUT, '')
            setAmountToWithFee("0")
          }
        })
        .catch((error) => {
          setBridgeState((prevState) => ({
            ...prevState,
            attemptingTxn: false,
            bridgeErrorMessage: error.message,
            txHash: undefined,
          }))
        })
    }, [bridgeCallback, setBridgeState, onUserInput, setAmountToWithFee])

    useEffect(() => {
        // Override Default TO Bridge Network based on config
        Object.keys(bridgeNetworks)
          .forEach(function eachKey(key) { 
            
            if(bridgeNetworks[key].chainId === config.id){
              setFromBridgeNetworkKey(key);
              
            }
            
            if(bridgeNetworks[key].chainId.toString() === outputChainId){
              setToBridgeNetworkKey(key)
            }
              
 
          });
    },[config, outputChainId])

    const handleFromNetworkSelect = useCallback(
      (fromNetwork) => {
        console.log("fromNetwork", fromNetwork)
        setHasPoppedModal(false)
        setInterruptRedirectCountdown(false)
        setApprovalSubmitted(false) // reset 2 step UI for approvals
        onNetworkSelection(Field.INPUT, fromNetwork, bridgeNetworks[toBridgeNetworkKey])
        Object.keys(bridgeNetworks)
          .forEach(function eachKey(key) { 
            if(bridgeNetworks[key].chainId === fromNetwork.chainId)
                setFromBridgeNetworkKey(key)
            
          });
        setNetworkRedirect(true)
      },
      [onNetworkSelection, toBridgeNetworkKey],
    )

    const handleToNetworkSelect = useCallback(
      (toNetwork) => {
        if(toNetwork.chainId === config.id)
          return

        console.log("frmbridgeNetworks", bridgeNetworks[fromBridgeNetworkKey])
        setHasPoppedModal(false)
        setInterruptRedirectCountdown(false)
        setApprovalSubmitted(false) // reset 2 step UI for approvals
        onNetworkSelection(Field.OUTPUT, toNetwork, bridgeNetworks[fromBridgeNetworkKey])
        setAmountToWithFee(new BigNumber("0.0").toString())
        onUserInput(Field.INPUT, "0")
        Object.keys(bridgeNetworks)
          .forEach(function eachKey(key) { 
            if(bridgeNetworks[key].chainId === toNetwork.chainId) {
              setToBridgeNetworkKey(key)
              setRedirect(true)
            }
          }); 
      },
      [config, onNetworkSelection, fromBridgeNetworkKey, onUserInput],
    )

    const handleInputSelect = useCallback(
        (inputCurrency) => {
            console.log("11inputCurrency", inputCurrency)
            setHasPoppedModal(false)
            setInterruptRedirectCountdown(false)
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, inputCurrency)
            setAmountToWithFee(new BigNumber("0.0").toString())
            onUserInput(Field.INPUT, "0")
        },
        [onCurrencySelection, onUserInput],
    )

    const handleMaxInput = useCallback(() => {
        if (maxAmountInput) {
            onUserInput(Field.INPUT, maxAmountInput.toExact())
        }
    }, [maxAmountInput, onUserInput])

    const handleOutputSelect = useCallback(
        (outputCurrency) => {
          console.log("11inputCurrency222", outputCurrency)
            setHasPoppedModal(false)
            setInterruptRedirectCountdown(false)
            onCurrencySelection(Field.OUTPUT, outputCurrency)
            setAmountToWithFee(new BigNumber("0.0").toString())
            onUserInput(Field.INPUT, "0")
        },
        [onCurrencySelection, onUserInput],
    )

    return (
        <>
            <Container>
                {(networkRedirect ? <Route path='/bridge' component={() => { 
                    window.location.href = `${bridgeNetworks[fromBridgeNetworkKey].redirect_url}?outputChainId=${bridgeNetworks[toBridgeNetworkKey].chainId}&inputCurrency=${bridgeNetworks[fromBridgeNetworkKey].tokens[0].address}&outputCurrency=${bridgeNetworks[toBridgeNetworkKey].tokens[0].address}`; 
                    return null;
                }} /> : '')}
                {(toRedirect ? <Redirect to={`/bridge?outputChainId=${bridgeNetworks[toBridgeNetworkKey].chainId}&inputCurrency=${bridgeNetworks[fromBridgeNetworkKey].tokens[0].address}&outputCurrency=${bridgeNetworks[toBridgeNetworkKey].tokens[0].address}`} /> : '')}
                <CardNav activeIndex={2} />
                <AppBody>
                    <Wrapper id="swap-page" color="transparent">
                        <PageHeaderSwap
                            title={TranslateString(8, 'Vortex Bridge')}
                            description={TranslateString(1192, `Move ${bridgeNetworks[fromBridgeNetworkKey].name} tokens to ${bridgeNetworks[toBridgeNetworkKey].name}`)}

                        />
                        <CardBody p="12px">
                            <AutoColumn gap="md">
                                <NetworkSelect
                                    selected={!!currencies[Field.INPUT]}
                                    className="open-currency-select-button"
                                    onClick={() => {
                                        setModalOpen(true)
                                        setInput(true)
                                    }}
                                >
                                    <AutoColumn justify="start">
                                        <Aligner>
                                            {bridgeNetworks[fromBridgeNetworkKey] && (
                                                <NetworkLogo bridgeNetwork={bridgeNetworks[fromBridgeNetworkKey]} size="24px" style={{ marginRight: '8px' }} />
                                            )}
                                            <Text id="pair">
                                                {(bridgeNetworks[fromBridgeNetworkKey] && bridgeNetworks[fromBridgeNetworkKey].name 
                                                    ? bridgeNetworks[fromBridgeNetworkKey].name
                                                    : bridgeNetworks[fromBridgeNetworkKey].name) || TranslateString(1196, 'From Chain')}
                                            </Text>

                                            <ChevronDownIcon />
                                        </Aligner>
                                    </AutoColumn>
                                </NetworkSelect>
                                <NetworkBridgeInputPanel
                                    label={TranslateString(194, 'Amount')}
                                    value={formattedAmounts[Field.INPUT]}
                                    showMaxButton={!atMaxAmountInput}
                                    currency={currencies[Field.INPUT]}
                                    onUserInput={handleTypeInput}
                                    onMax={handleMaxInput}
                                    onCurrencySelect={handleInputSelect}
                                    otherCurrency={currencies[Field.OUTPUT]}
                                    bridgeTokensOnly={bridgeTokensOnly}
                                    selectedBridgeNetwork={bridgeNetworks[fromBridgeNetworkKey]}
                                    id="bridge-currency-input"
                                />
                                <AutoColumn justify="start">
                                    
                                    <NetworkSelect
                                        selected={!!currencies[Field.OUTPUT]}
                                        className="open-currency-select-button"
                                        onClick={() => {
                                          setModalOpen(true)
                                          setInput(false)
                                        }}
                                    >
                                        <AutoColumn justify="start">
                                            <Aligner>
                                                {bridgeNetworks[toBridgeNetworkKey] && (
                                                    <NetworkLogo bridgeNetwork={bridgeNetworks[toBridgeNetworkKey]} size="24px" style={{ marginRight: '8px' }} />
                                                )}
                                                <Text id="pair">
                                                    {(bridgeNetworks[toBridgeNetworkKey] && bridgeNetworks[toBridgeNetworkKey].name 
                                                        ? bridgeNetworks[toBridgeNetworkKey].name
                                                        : bridgeNetworks[toBridgeNetworkKey].name) || TranslateString(1196, 'To Chain')}
                                                </Text>
                                                <ChevronDownIcon />
                                            </Aligner>
                                        </AutoColumn>
                                    </NetworkSelect>
                                </AutoColumn>
                                <NetworkBridgeInputPanel
                                    value={amountToWithFee}
                                    onUserInput={handleTypeOutput}
                                    label={
                                        independentField === Field.INPUT
                                            ? TranslateString(196, 'Destination (estimated)')
                                            : TranslateString(80, 'Destination')
                                    }
                                    showMaxButton={false}
                                    currency={currencies[Field.OUTPUT]}
                                    onCurrencySelect={handleOutputSelect}
                                    otherCurrency={currencies[Field.INPUT]}
                                    bridgeTokensOnly={bridgeTokensOnly}
                                    selectedBridgeNetwork={bridgeNetworks[toBridgeNetworkKey]}
                                    id="bridge-currency-output"
                                />
                            </AutoColumn>
                            <BottomGrouping>
                              {!account ? (
                                  <ConnectWalletButton width="100%" />
                                ) : isInvalidAmountWithFee ? (
                                  <GreyCard style={{ textAlign: 'center' }}>
                                    <Text mb="4px">{TranslateString(1194, 'Amount must be greater than fee')}</Text>
                                  </GreyCard>
                                ) : showApproveFlow ? (
                                  <RowBetween>
                                    {approval === ApprovalState.APPROVED ? 
                                      (<Button
                                        endIcon={attemptingTxn ? <AutoRenewIcon spin color="currentColor" /> : null}
                                        onClick={() => {
                                          handleBridge()
                                        }}
                                        style={{ width: '100%' }}
                                        id="swap-button"
                                        disabled={
                                          !isValid ||
                                          approval !== ApprovalState.APPROVED ||
                                          attemptingTxn
                                        }
                                        variant={isValid ? 'danger' : 'primary'}
                                      >
                                        {(bridgeInputError ?? undefined ? bridgeInputError : TranslateString(292, `Bridge to ${bridgeNetworks[toBridgeNetworkKey].name}`))}
                                      </Button>)
                                    : 
                                      (<Button
                                        onClick={approveCallback}
                                        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                                        style={{ width: '100%' }}
                                        variant='primary'
                                      >
                                        {approval === ApprovalState.PENDING ? (
                                          <AutoRow gap="6px" justify="center">
                                            Approving <Loader stroke="white" />
                                          </AutoRow>
                                        ) : (
                                          `Approve ${currencies[Field.INPUT]?.symbol}`
                                        )}
                                      </Button> )
                                    }
                                  </RowBetween>
                                ) : (
                                  <Button
                                    endIcon={attemptingTxn ? <AutoRenewIcon spin color="currentColor" /> : null}
                                    onClick={() => {
                                      handleBridge()
                                    }}
                                    id="bridge-button"
                                    disabled={
                                      !isValid || !!bridgeCallbackError || attemptingTxn
                                    }
                                    variant={isValid ? 'danger' : 'primary'}
                                    width="100%"
                                  >
                                    {(bridgeInputError ?? undefined ? bridgeInputError : TranslateString(292, `Bridge to ${bridgeNetworks[toBridgeNetworkKey].name}`))}

                                  </Button>
                                )}
                                {bridgeErrorMessage ? <SwapCallbackError error={bridgeErrorMessage} /> : null}
                                
                            </BottomGrouping>
                        </CardBody>
                    </Wrapper>
                </AppBody>
                <AdvancedDetailsFooter show={Boolean(calcFee)}>
                  <CardBody>
                    <RowBetween>
                      <RowFixed>
                        <Text color="info" fontSize="14px" fontWeight="bold">
                          {bridgingFee} 
                        </Text>
                        <Text color="primary" fontSize="14px" marginLeft="5px">
                          {TranslateString(226, `${currencies[Field.OUTPUT]?.symbol} transaction fee on ${bridgeNetworks[toBridgeNetworkKey]?.name}`)}
                        </Text>
                      </RowFixed>
                    </RowBetween>
                  </CardBody>
                </AdvancedDetailsFooter>
            </Container>
            
            <Modal isOpen={isOpen} onDismiss={handleConfirmDismiss} maxHeight={90}>
              <TransactionSubmittedContent chainId={bridgeNetworks[fromBridgeNetworkKey].chainId} hash={transactionHash} onDismiss={handleConfirmDismiss} />
            </Modal>
            
            <NetworkSelectionModal
                isOpen={modalOpen}
                onDismiss={handleDismissSearch}
                isOrigin={input}
                onNetworkSelect={input ? handleFromNetworkSelect : handleToNetworkSelect}
                selectedNetwork={input ? bridgeNetworks[fromBridgeNetworkKey] : bridgeNetworks[toBridgeNetworkKey]}
            />
        </>
    )
}

export default Bridge
