import React from 'react'

export default function Minting() {
    return (
        <div>
            <div className="w-[40%]">
                <div className="text-center">
                    <h2 className="font-semibold text-4xl">The not 'LEFT' verson of CryptoPhunks X Azuki</h2>
                    <p className="mt-8">10k in supply at 0.01ETH each. Gas Optimized (721A) & Contract Verified. Support our LEARNING EXPERIENCE!</p>
                </div>
                <div className="w-full bg-gray-200/40 border border-white h-12 mt-9 rounded-lg">
                    <div className="px-8 h-full flex justify-between items-center text-xl">
                        <div className="flex items-center">
                            <button className="text-2xl hover:text-primary transition-all duration-300 ease-in-out">-</button>
                            <span className="mx-7 text-2xl">8</span>
                            <button className="text-2xl hover:text-primary transition-all duration-300 ease-in-out">+</button>
                        </div>
                        <button className="hover:text-primary transition-all duration-300 ease-in-out">Max</button>
                    </div>
                </div>
                <div className="flex justify-between mt-8 text-3xl">
                    <span>Total</span>
                    <span>0.14 ETH</span>
                </div>
                <div className="mt-28">
                    <button className="w-full bg-gray-900 text-2xl rounded-lg py-4">Connect Wallet</button>
                    <div className="text-center mt-6">Minted : XXX / 6666</div>
                </div>
            </div>
        </div>
    )
}
