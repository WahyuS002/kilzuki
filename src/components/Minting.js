import React, { useEffect, useState } from 'react'
import { fetchData } from '../redux/data/dataActions'
import { toast } from 'react-toastify'
import { connect } from '../redux/blockchain/blockchainActions'

import kilzukiImg from '../images/kilzuki.png'

import { useDispatch, useSelector } from 'react-redux'

import Web3 from 'web3'

const web3 = new Web3()

export default function Minting() {
    const dispatch = useDispatch()
    const blockchain = useSelector((state) => state.blockchain)
    const data = useSelector((state) => state.data)

    const [claimingNft, setClaimingNft] = useState(false)

    const [mintAmount, setMintAmount] = useState(1)
    const [canIncrement, setCanIncrement] = useState(true)
    const [canDecrement, setCanDecrement] = useState(false)

    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: '',
        SCAN_LINK: '',
        NETWORK: {
            NAME: '',
            SYMBOL: '',
            ID: 0,
        },
        NFT_NAME: '',
        SYMBOL: '',
        MAX_SUPPLY: 0,
        GAS_LIMIT: 0,
    })

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1
        if (newMintAmount === 1) {
            setCanDecrement(false)
        }
        if (newMintAmount < 1) {
            newMintAmount = 1
        }
        setMintAmount(newMintAmount)
        setCanIncrement(true)
    }

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1
        if (newMintAmount === 20) {
            setCanIncrement(false)
        }
        if (newMintAmount > 20) {
            newMintAmount = 20
        }
        setMintAmount(newMintAmount)
        setCanDecrement(true)
    }

    const getConfig = async () => {
        const configResponse = await fetch('/config/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        const config = await configResponse.json()
        SET_CONFIG(config)
    }

    const getData = () => {
        if (blockchain.account !== '' && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account))
        }
    }

    const claimNFTs = () => {
        let cost = data.cost
        let gasLimit = CONFIG.GAS_LIMIT
        let totalCostWei = String(cost * mintAmount)

        if (data.paused) {
            toast.info('Minting will open soon.')
        } else {
            console.log('Current Wallet Supply : ', data.currentWalletSupply)
            if (parseInt(mintAmount) + parseInt(data.totalSupply) > parseInt(data.maxSupply)) {
                toast.warning('You have exceeded the max limit of minting.')
            } else {
                if (data.isFreeMintOpen) {
                    return freeMintTokens(gasLimit)
                } else {
                    return mintTokens(gasLimit, totalCostWei)
                }
            }
        }
    }

    const freeMintTokens = (gasLimit) => {
        if (parseInt(data.currentWalletSupply) + mintAmount > parseInt(data.maxFreeMintAmountPerAddr)) {
            toast.warning('Exceeds max free mint per wallet!')
        } else if (parseInt(data.totalSupply) + mintAmount > parseInt(data.maxFreeMintSupply)) {
            toast.warning('Exceeds max free mint supply!')
        } else {
            toast.info(`Minting your free ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .freeMint(mintAmount)
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                })
                .once('error', () => {
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then(() => {
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                })
        }
    }

    const mintTokens = (gasLimit, totalCostWei) => {
        if (mintAmount > parseInt(data.maxMintAmountPerTx)) {
            toast.warning('Exceeds max mint amount per tx!')
        } else if (parseInt(data.totalSupply) + mintAmount > parseInt(data.maxSupply)) {
            toast.warning('Max supply exceeded!')
        } else if (parseInt(data.currentWalletSupply) + mintAmount > 20) {
            toast.warning('Exceeds max mint per wallet!')
        } else {
            toast.info(`Minting your ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .mint(mintAmount)
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                    value: totalCostWei,
                })
                .once('error', (err) => {
                    console.log(err)
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then((receipt) => {
                    console.log(receipt)
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                })
        }
    }

    const isWalletConnected = () => {
        return blockchain.account
    }

    const isContractReady = () => {
        return blockchain.smartContract
    }

    const isLoading = () => {
        return data.loading
    }

    useEffect(() => {
        getConfig()
    }, [])

    useEffect(() => {
        getData()
    }, [blockchain.account])

    return (
        <div>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between md:gap-12">
                <div className="md:w-[40%] mt-12 md:mt-0">
                    {isWalletConnected() && isContractReady() && !isLoading() ? (
                        <div className="flex justify-center mb-7">
                            <div className="bg-gray-900/30 border border-white rounded-full flex justify-center items-center py-1 px-5 space-x-3">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                <span className="text-sm font-semibold uppercase">{data.isFreeMintOpen ? `Free Mint : Max ${data.maxFreeMintAmountPerAddr}` : 'Public Mint : Max 20'}</span>
                            </div>
                        </div>
                    ) : null}
                    <div className="text-center">
                        <h2 className="font-semibold text-xl">6666 Kilzuki ready to Kill. 300 Traits created in just 1 day due to stress because the price movement.</h2>
                        <p className="mt-8 text-sm">666 NFTs are free to mint. 721A Verified Contract.</p>
                    </div>
                    <div className="flex justify-center mt-7">
                        <div className="bg-gray-900/60 border border-white inline-block space-x-5 px-5 rounded-full">
                            <button
                                className="text-2xl"
                                onClick={(e) => {
                                    e.preventDefault()
                                    decrementMintAmount()
                                }}
                            >
                                -
                            </button>
                            <span className="text-xl font-semibold">{mintAmount}</span>
                            <button
                                className="text-2xl"
                                onClick={(e) => {
                                    e.preventDefault()
                                    incrementMintAmount()
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            className="bg-white border border-gray-900/60 rounded-full px-3 py-1 text-xs uppercase text-primary font-bold"
                            onClick={(e) => {
                                e.preventDefault()
                                setMintAmount(20)
                            }}
                        >
                            Max
                        </button>
                    </div>
                    <div className="flex justify-center mt-8 text-2xl">
                        <span className="mr-4">Total</span>
                        <span>
                            {isWalletConnected() && isContractReady() && !isLoading() ? <>{data.isFreeMintOpen ? 'Free Mint' : web3.utils.fromWei(data.cost, 'ether') * mintAmount + ' ETH'}</> : '-'}
                        </span>
                    </div>
                    <div className="mt-28">
                        {isWalletConnected() && isContractReady() && !isLoading() ? (
                            <>
                                <p className="text-center mb-3 text-gray-900 font-bold uppercase">Instant Reveal</p>
                                <button
                                    className="w-full bg-gray-900 text-2xl rounded-lg py-4"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        claimNFTs()
                                        getData()
                                    }}
                                >
                                    Mint
                                </button>
                            </>
                        ) : (
                            <>
                                {isLoading() ? (
                                    <button className="w-full bg-gray-900 text-2xl rounded-lg py-4 cursor-not-allowed">Loading ...</button>
                                ) : (
                                    <button
                                        className="w-full bg-gray-900 text-2xl rounded-lg py-4"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            dispatch(connect())
                                            getData()
                                        }}
                                    >
                                        Connect Wallet
                                    </button>
                                )}
                            </>
                        )}
                        <div className="text-center mt-6">
                            <span>
                                Total Minted : {isWalletConnected() && isContractReady() && !isLoading() ? data.totalSupply : 'XXX'} / {CONFIG.MAX_SUPPLY}
                            </span>
                        </div>
                        <div className="text-center mt-2">
                            <a href={CONFIG.SCAN_LINK} target={'_blank'} className="text-xs text-white/70" rel="noreferrer">
                                {CONFIG.CONTRACT_ADDRESS}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="md:w-[50%]">
                    <img className="border-4 border-gray-900" src={kilzukiImg} alt="Kizuki_Image" draggable={false} />
                </div>
            </div>
        </div>
    )
}
