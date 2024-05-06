"use client"

import Loading from '@/app/loading';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { FaSpinner } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { formatUnits, parseUnits } from "viem";
import { AppContext } from '@/utils/utils';
import {
    preSaleReadFunction,
    preSaleWriteFunction,
    tokenReadFunction,
    usdtReadFunction,
    usdtWriteFunction,
    checkBalanceFunction
} from "@/app/conectivity/hooks";
import { preSaleAddress } from '@/app/conectivity/environment';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import PurchaseSuccessfullModal from './PurchaseSuccessfullModal';

const timerData = {
    eventDate: "May 14, 2024 23:59:59",
    header: ["Buy", "RVM", "Token"],
    subHeader: ["Pre Sale is", "Live!"],
    tokenSold: {
        current: "2,118,504",
        total: "6000000000"
    },
    usdRaised: "$1,228,504",
    progressBar: {
        percentage: 50
    },
    buyWith: ["BNB", "USDT"],
    balance: {
        BNB: "- - BNB",
        USDT: "- - USDT"
    },
    claimDate: "1 JAN 2025",
    sendReceive: {
        BNB: {
            send: "1.00",
            receive: "0.00"
        },
        USDT: {
            send: "100.00",
            receive: "0.00"
        }
    }
};

const Timer = ({ copyReferalUrlToClipboard, referalLink }) => {

    const searchParams = useSearchParams()
    const refaddr = searchParams.get('refaddr')

    const { account } = useContext(AppContext);
    const { open } = useWeb3Modal();
    const [paymentMehod, setPaymentMehod] = useState("BNB");
    const [amount, setAmount] = useState("");
    const [willGetTokens, setWillGetTokens] = useState(0)
    const [callFunction, setCallFunction] = useState(true);
    const [currentStage, setcurrentStage] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [tokenPerUSDT, settokenPerUSDT] = useState(0);
    const [tokenPerETH, settokenPerETH] = useState(0);
    const [tokenPrice, settokenPrice] = useState(0);
    const [totalRaisedAmount, settotalRaisedAmount] = useState(0);
    const [progressBar, setprogressBar] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);
    const [ethBAlance, setethBAlance] = useState(0);
    const [totalSoldTokens, settotalSoldTokens] = useState(0);
    const [userPurchasedTokens, setuserPurchasedTokens] = useState(0);
    const [userClaimedTokens, setuserClaimedTokens] = useState(0);
    const [claimEnabled, setclaimEnabled] = useState(false);
    const [nextPrice, setNextPrice] = useState(0)
    const [showPurchaseSuccessfullModal, setShowPurchaseSuccessfullModal] = useState(false)
    const [referralCount, setRreferalCount] = useState(0)
    const [referralEarningsCount, setreferralEarningsCount] = useState(0)

    const { token } = useSelector((state) => state.token);

    const [loading, setloading] = useState(false)

    const toLocalFormat = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const initVoidSigner = async () => {

        try {
            let presalestatus = await preSaleReadFunction("presaleStatus");

            if (presalestatus) {
                let dec = await tokenReadFunction("decimals");
                let totalsupl = await tokenReadFunction("totalSupply");
                let sellingtoken = +formatUnits(totalsupl?.toString(), +dec?.toString()) * 60 / 100;
                setTotalSupply(sellingtoken);
                let claim = await preSaleReadFunction("isPresaleEnded");
                setclaimEnabled(claim);
                let stage = await preSaleReadFunction("activePhaseInd");
                setcurrentStage(+stage?.toString());
                let usdtToToken = await preSaleReadFunction("usdtToToken", [
                    "1000000000000000000",
                    stage?.toString(),
                ]);
                let nextprice = await preSaleReadFunction("usdtToToken", [
                    "1000000000000000000",
                    (stage + 1n)?.toString(),
                ]);
                setNextPrice(+formatUnits(nextprice?.toString(), +dec?.toString()));
                settokenPerUSDT(+formatUnits(usdtToToken?.toString(), +dec?.toString()));
                let ethToToken = await preSaleReadFunction("nativeToToken", [
                    "1000000000000000000",
                    stage?.toString(),
                ]);
                settokenPerETH(+formatUnits(ethToToken?.toString(), +dec?.toString()));
                let presaleData = await preSaleReadFunction("phases", [
                    +stage?.toString(),
                ]);
                settokenPrice(+formatUnits(presaleData[3]?.toString(), +dec?.toString()));
    
                let amoutRaisedNew = 0;
                let totalSoldTokenNew = 0;
    
                for (let i = 0; i < 3; i++) {
                    const amountContract = await preSaleReadFunction("phases", [i]);
                    amoutRaisedNew +=
                        +formatUnits(amountContract[2]?.toString(), +dec?.toString()) /
                        +formatUnits(amountContract[3]?.toString(), +dec?.toString());
                    totalSoldTokenNew += +formatUnits(
                        amountContract[2]?.toString(),
                        +dec?.toString()
                    );
                }
    
                for (let i = 3; i < 6; i++) {
                    const amountContract = await preSaleReadFunction("phases", [i]);
                    amoutRaisedNew +=
                        +formatUnits(amountContract[2]?.toString(), +dec?.toString()) /
                        +formatUnits(amountContract[3]?.toString(), +dec?.toString());
                    totalSoldTokenNew += +formatUnits(
                        amountContract[2]?.toString(),
                        +dec?.toString()
                    );
                }
    
                amoutRaisedNew = parseFloat(amoutRaisedNew)?.toFixed(0);
                settotalRaisedAmount(toLocalFormat(amoutRaisedNew));
                totalSoldTokenNew = parseFloat(totalSoldTokenNew)?.toFixed(0);
                settotalSoldTokens(toLocalFormat(totalSoldTokenNew));
                let progForAll = (+totalSoldTokenNew / timerData.tokenSold.total) * 100;
                setprogressBar(+progForAll);
                setCallFunction(false);
                setIsSaleActive(true)
            } else {
                setIsSaleActive(false);
            }

        } catch (error) {
            setCallFunction(false);
            console.log(error, "ERROR VoidSigner Data");
        }
    };

    const [isSaleActive, setIsSaleActive] = useState(undefined)


    const eventDate = new Date(timerData.eventDate).getTime();

    const [eventPassed, setEventPassed] = useState(false);

    const [calculatedBNB, setCalculatedBNB] = useState(0.00)
    const [calculatedUSDT, setCalculatedUSDT] = useState(0.00)

    const [inputBNB, setInputBNB] = useState()
    const [inputUSDT, setInputUSDT] = useState()


    useEffect(() => {
        initVoidSigner();
    }, [callFunction]);
    useEffect(() => {
        if (account) {
            (async () => {
                try {
                    let balUSDT = await usdtReadFunction("balanceOf", [account]);
                    //console.log("USDT: ",parseFloat(formatUnits(balUSDT?.toString(), 6)).toFixed(2));
                    setusdtBalance(+parseFloat(formatUnits(balUSDT?.toString(), 18)).toFixed(2));
                    let ethBal = await checkBalanceFunction(account);
                    //console.log("ETH: ",parseFloat(formatUnits(ethBal?.value?.toString(), 18)).toFixed(6));
                    setethBAlance(+parseFloat(formatUnits(ethBal?.value?.toString(), 18)).toFixed(6));
                    const userExsitOne = await preSaleReadFunction("isExist", [account]);
                    let dec = await tokenReadFunction("decimals");
                    let userTokenContract = 0;
                    let referalcountContract = 0;
                    let referalearningscountContract = 0;
                    let claimedTokenContract = 0;
                    if (userExsitOne) {
                        let userData = await preSaleReadFunction("users", [account]);
                        userTokenContract += +formatUnits(
                            userData[2]?.toString(),
                            +dec?.toString()
                        );
                        referalcountContract = userData[4]?.toString();
                        referalearningscountContract += +formatUnits(
                            userData[5]?.toString(),
                            +dec?.toString()
                        );

                        claimedTokenContract += +formatUnits(
                            userData[3]?.toString(),
                            +dec?.toString()
                        );


                    }
                    setuserPurchasedTokens(userTokenContract);
                    setRreferalCount(referalcountContract);
                    setreferralEarningsCount(referalearningscountContract);
                    setuserClaimedTokens(claimedTokenContract);
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [account]);

    useEffect(() => {
        if (+amount > 0) {
            (async () => {
                if (paymentMehod === "BNB") {
                    let tokenETH = +tokenPerETH * +amount;
                    setWillGetTokens(tokenETH.toFixed(6));
                } else if (paymentMehod === "USDT") {
                    let tokenUSDT = +tokenPerUSDT * +amount;
                    setWillGetTokens(tokenUSDT.toFixed(6));
                }
            })();
        }
    }, [amount, paymentMehod]);


    const buyHandler = async () => {
        console.log("~~~~~~buyHandler")
        if (!account) {
            return toast.error("Please connect your wallet first", {
                style: {
                    maxWidth: 500
                }
            });
        }

        if (!amount || +amount <= 0) {
            return toast.error("Please enter the amount you want to buy", {
                style: {
                    maxWidth: 500
                }
            });
        }
        if ((amount > ethBAlance && paymentMehod == "BNB") || (amount > usdtBalance && paymentMehod == "USDT")) {
            return toast.error(`Insufficient ${paymentMehod} Funds`);
        }
        try {
            setloading(true);
            if (paymentMehod === "USDT") {
                let allowance = await usdtReadFunction("allowance", [
                    account,
                    preSaleAddress,
                ]);
                if (+formatUnits(allowance.toString(), 18) > 0) {
                    await usdtWriteFunction("approve", [preSaleAddress, "0"]);
                }
                await usdtWriteFunction("approve", [
                    preSaleAddress,
                    parseUnits(amount.toString(), 18).toString(),
                ]);
                await preSaleWriteFunction("buyTokenUSDT", [
                    parseUnits(amount.toString(), 18).toString(),
                ]);
                setShowPurchaseSuccessfullModal(true)
            } else {
                await preSaleWriteFunction(
                    "buyToken",
                    [],
                    parseUnits(amount.toString(), 18).toString()
                );
                setShowPurchaseSuccessfullModal(true)
            }
            setAmount("");
            setWillGetTokens(0);
            setCallFunction(true);
            setloading(false);
        } catch (error) {
            setloading(false);
            // console.log(error);
            toast.error(error?.shortMessage);
        }
    };

    const buyHandlerByReferal = async () => {
        console.log("~~~~~~buyHandlerByReferal")
        if (!account) {
            return toast.error("Please connect your wallet first", {
                style: {
                    maxWidth: 500
                }
            });
        }

        if (!amount || +amount <= 0) {
            return toast.error("Please enter the amount you want to buy", {
                style: {
                    maxWidth: 500
                }
            });
        }
        if ((amount > ethBAlance && paymentMehod == "BNB") || (amount > usdtBalance && paymentMehod == "USDT")) {
            return toast.error(`Insufficient ${paymentMehod} Funds`);
        }
        try {
            setloading(true);
            if (paymentMehod === "USDT") {
                let allowance = await usdtReadFunction("allowance", [
                    account,
                    preSaleAddress,
                ]);
                if (+formatUnits(allowance.toString(), 18) > 0) {
                    await usdtWriteFunction("approve", [preSaleAddress, "0"]);
                }
                await usdtWriteFunction("approve", [
                    preSaleAddress,
                    parseUnits(amount.toString(), 18).toString(),
                ]);
                await preSaleWriteFunction("buyTokenUSDTReferral", [
                    refaddr, parseUnits(amount.toString(), 18).toString(),
                ]);
                setShowPurchaseSuccessfullModal(true)
            } else {
                await preSaleWriteFunction(
                    "buyTokenReferral",
                    [refaddr],
                    parseUnits(amount.toString(), 18).toString()
                );
                setShowPurchaseSuccessfullModal(true)
            }
            setAmount("");
            setWillGetTokens(0);
            setCallFunction(true);
            setloading(false);
        } catch (error) {
            setloading(false);
            // console.log(error);
            toast.error(error?.shortMessage);
        }
    };
    const claimHandler = async () => {
        if (account) {
            try {
                setloading(true);
                let dec = await tokenReadFunction("decimals");
                const userExsitOne = await preSaleReadFunction("isExist", [account]);
                if (userExsitOne) {
                    await preSaleWriteFunction("claimTokens");
                }
                setloading(false);
                toast.success("Success! Token Claim Confirmed");

            } catch (error) {
                setloading(false);
                toast.error(error?.shortMessage);
            }
        } else {
            toast.error("Error! Please connect your wallet.");
        }
    };

    function formatToCompactNumber(value) {
        // Ensure value is a number
        value = parseFloat(value);
        if (isNaN(value)) {
          throw new TypeError("Invalid number input");
        }
      
        const suffixes = ["", "k", "M", "B", "T"]; // Thousand, Million, Billion, Trillion
        let suffixIndex = 0;
      
        while (Math.abs(value) >= 1000 && suffixIndex < suffixes.length - 1) {
          value /= 1000;
          suffixIndex++;
        }
      
        return `${parseFloat(value.toFixed(2))}${suffixes[suffixIndex]}`;
      }


    if (isSaleActive === undefined) {
        return <Loader />
    }

    return (
        isSaleActive ? (
            <>
                <PurchaseSuccessfullModal referalLink={referalLink} setShowModal={setShowPurchaseSuccessfullModal} showModal={showPurchaseSuccessfullModal} copyReferalUrlToClipboard={copyReferalUrlToClipboard} />
                {
                    loading && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 z-[9999999999]">
                            <FaSpinner className="animate-spin text-5xl text-main-100" />
                        </div>
                    )
                }
                {
                    claimEnabled ?
                        <>
                            <section
                                className={`h-full w-[20.438rem] md:w-[27rem] lg:w-[33.7rem] bg-white border relative z-40 rounded-3xl mx-auto -top-2 8 mt-3 md:mt-10 lg:mt-1 px-4 lg:px-7 py-5 pb-[1.5rem] lg:py-6 lg:pb-[2rem]`}
                                style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}
                            >
                                <div className='w-fit lg:w-[30rem]'>
                                    <h3 className="uppercase text-center text-[20px] lg:text-[24px] font-manrope font-bold text-mainGray">
                                        Claim <span className="text-main-200"> RVM</span> Token
                                    </h3>
                                    <p className="uppercase text-center text-[14px] lg:text-[14px] font-manrope text-[#3B444E] mb-3.5 mt-0">
                                        $RVMT Claim is now <span className="text-[#F13C14] font-manrope-bold"> LIVE! </span>
                                    </p>
                                    <div className='border rounded-2xl' >
                                        <div className="font-manrope text-black h-fit flex py-1 px-5 lg:px-7 my-3 items-center">
                                            <div className='w-fit border-r pr-3 md:pr-6'>
                                                <img src="./other/logo2.png" className='size-[45px] lg:size-[64px] object-cover' alt="" />
                                            </div>
                                            <div className='flex flex-col justify-center items-center ml-10 font-manrope-bold'>
                                                <div className='flex flex-col gap-y-0.5'>
                                                    <div className="text-[18px] lg:text-[30px] font-extrabold">
                                                        ${totalRaisedAmount}
                                                    </div>
                                                    <div className="text-[12px] lg:text-[16px] uppercase font-manrope text-mainGray/80">
                                                        $USD RAISED
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bg-[#D9F2F0] text-[14px] lg:text-[16px] w-full font-manrope-bold text-main-100 text-center py-1'>
                                            <span className='text-black text-[14px] lg:text-[16px] uppercase'>TOTAL CLAIMED TOKENS</span><br />{account ? (userClaimedTokens) : "- -"} RVMT
                                        </div>
                                        <div className='text-center font-manrope-bold space-y-0.5 lg:space-y-1 my-5'>
                                            <div className='text-black text-[14px] lg:text-[16px] uppercase'>
                                                TOKENS AVAILABLE TO CLAIM
                                            </div>
                                            <div className='text-main-100 text-[18px] lg:text-[24px]'>
                                                {account ? (userPurchasedTokens - userClaimedTokens) : "- -"} RVMT
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-[#636363] font-manrope text-[14px] space-y-4 my-3'>
                                        <p>
                                            You can now claim your RVMT tokens into your wallet. Please ensure you are using the wallet you used to participate in the RVM Token Presale.
                                        </p>
                                        <p>
                                            Once claimed, you can check your token balance by adding token into your wallet with the network BSC and token contract address.
                                        </p>
                                    </div>
                                    {/* login / signup buttons */}
                                    <div className="mt-5 lg:mt-5">
                                        {
                                            account && claimEnabled ? (<>

                                               {(userPurchasedTokens - userClaimedTokens) > 0 &&                                                 
                                               <button
                                                    onClick={claimHandler}
                                                    className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                    CLAIM NOW
                                                </button>}

                                            </>) : account ? (
                                                <>
                                                    <button
                                                        onClick={refaddr ? buyHandlerByReferal : buyHandler}
                                                        className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                        BUY NOW
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => open()}
                                                        className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                        CONNECT WALLET
                                                    </button>
                                                </>
                                            )
                                        }
                                        {!account ? (
                                            <>
                                                <div className="text-center my-[0.200rem] text-mainGray">OR</div>
                                                <div className="flex">
                                                    <Link href={"https://app.rvmtoken.io"} className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-mainGray font-manrope py-2 lg:py-2.5 rounded text-center">
                                                        LOGIN / SIGNUP
                                                    </Link>
                                                </div>
                                            </>
                                        ) : null
                                        }
                                    </div>
                                </div>
                            </section>
                        </> : (
                            <section
                                className={`h-full w-[19.438rem] md:w-[24rem] lg:w-[27rem] bg-white border relative z-40 rounded-3xl mx-auto -top-2 8 mt-3 md:mt-10 lg:mt-1 px-4 lg:px-7 py-5 pb-[1.5rem] lg:py-6`}
                                style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}
                            >
                                <h3 className="uppercase text-center text-[20px] lg:text-[18px] font-manrope font-bold text-mainGray">
                                    {timerData.header[0]} <span className="text-main-200">{timerData.header[1]} </span> {timerData.header[2]}
                                </h3>
                                <p className="uppercase text-center text-[14px] lg:text-[14px] font-manrope text-[#3B444E] mb-3">
                                    {timerData.subHeader[0]} <span className="text-[#F13C14] font-manrope-bold">{timerData.subHeader[1]}</span>
                                </p>
                                <CountDown eventDate={eventDate} setEventPassed={setEventPassed} />
                                <div className="flex justify-between items-center text-[#212121] font-manrope">
                                    <div className="h-[5.5rem] w-[8.2rem] md:w-[9.8rem] lg:w-[10.8rem] lg:h-[4.5rem] bg-[#fafafa] border rounded flex flex-col justify-between py-1 px-4">
                                        <div className="text-[14px] lg:text-[15px] font-extrabold">
                                            {totalSoldTokens}
                                        </div>
                                        <div className="text-[10px] lg:text-[12px]">{toLocalFormat(totalSupply)}</div>
                                        <div className="text-[10px] lg:text-[12px] uppercase">
                                            Token Sold
                                        </div>
                                    </div>
                                    <div className="h-[5.5rem] w-[8.2rem] md:w-[9.8rem] lg:w-[10.8rem] lg:h-[4.5rem] bg-[#fafafa] border rounded flex flex-col justify-between py-1 px-4">
                                        <div className="text-[14px] lg:text-[15px] font-extrabold">
                                            {/* ${formatNumberWithCommas(totalFundsRaisedUSD)} */}
                                            ${totalRaisedAmount}
                                        </div>
                                        <div className="text-[10px] lg:text-[12px] uppercase">
                                            $USD RAISED
                                        </div>
                                    </div>
                                </div>

                                <div className='text-mainGray font-manrope-bold text-[10px] lg:text-sm flex items-center justify-between mt-2.5 -mb-3.5 pb-0.5 pt-1'>
                                    <div>{(1 / tokenPerUSDT).toFixed(2)} USDT = 1 RVMT</div>
                                    <div>Next Batch: {(1 / nextPrice).toFixed(2)} USDT</div>
                                </div>

                                {/* progress bar */}
                                <div className='relative w-full '>
                                    <div className={`rounded-3xl h-[23.5px] lg:h-[1.5rem] min-w-fit text-center bg-main-100 text-[12px] lg:text-[14px] text-white my-3 mt-6 shadow-md font-medium`}
                                        style={progressBar <= 100 ? { width: `${100 - progressBar.toFixed(2)}%` } : null}
                                    >

                                    </div>
                                    <div className={`absolute -top-0 text-center ml-3 text-[16px] font-manrope-bold ${parseFloat(progressBar).toFixed(0) >= 55 ? "text-mainGray" : "text-white"}`}><span className='font-manrope'>Remaining</span> {100 - parseFloat(progressBar).toFixed(0)}%</div>

                                </div>

                                <div className='flex flex-row gap-x-2.5 text-mainGray text-[10px] lg:text-[12px] h-[4.3rem] font-manrope-bold text-center mt-5 mb-3'>
                                    <div className='border-[1.5px] border-[#a6a6a6] w-full rounded flex flex-col justify-around p-1'>
                                        <div className='leading-3 opacity-80'>Coin Balance</div>
                                        <div className='text-[12px] lg:text-[14px]'>
                                            {
                                                account ? formatToCompactNumber(userPurchasedTokens) : "--"
                                            }
                                        </div>
                                    </div>
                                    <div className='border-[1.5px] border-[#a6a6a6] w-full rounded flex flex-col justify-around py-1'>
                                        <div className='leading-3 opacity-80'>Your Referrals</div>
                                        <div className='text-[12px] lg:text-[14px]'>
                                            {
                                                account ? referralCount : "--"
                                            }
                                        </div>
                                    </div>
                                    <div className='border-[1.5px] border-[#a6a6a6] w-full rounded flex flex-col justify-around py-1'>
                                        <div className='leading-3 opacity-80'>Your Referral Earnings</div>
                                        <div className='text-[12px] lg:text-[14px]'>
                                            {
                                                account ? formatToCompactNumber(referralEarningsCount) : "--"
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="uppercase text-center my-2.5 text-[14px] font-bold text-mainGray">
                                    BUY WITH
                                </div>
                                <div className="flex">
                                    <div onClick={() => setPaymentMehod("BNB")} className={`cursor-pointer border lg:border-2 rounded-l w-full py-2 lg:py-1 text-center font-extrabold text-[14px] lg:text-[14px] duration-150 ease-linear  ${paymentMehod === "BNB" ? "border-main-100 text-main-100" : "border-[#4D4D4D]/50 text-[#4D4D4D]/50 lg:border-r-0"}`}>
                                        {timerData.buyWith[0]}
                                    </div>
                                    <div onClick={() => setPaymentMehod("USDT")} className={`cursor-pointer border lg:border-2 lg:border-l-0 w-full py-2 lg:py-1 text-center font-extrabold text-[14px] lg:text-[14px] duration-150 ease-linear  ${paymentMehod === "USDT" ? "border-main-100 text-main-100 lg:border-l-2" : "border-[#4D4D4D]/50 text-[#4D4D4D]/50 lg:border-l-0"}`}>
                                        {timerData.buyWith[1]}
                                    </div>
                                </div>

                                <div key={1} className="text-[9.3px] md:text-[11px] lg:text-[13px] text-[#4D4D4D] flex items-center justify-between gap-x-1 lg:gap-x-4 font-manrope mt-4 mb-2">
                                    <span>BALANCE</span>
                                    <span className="font-extrabold font-manrope-bold w-10 lg:w-12 whitespace-nowrap relative right-2.5 lg:right-4">{account ? paymentMehod === "BNB" ? ethBAlance : usdtBalance : '- -'} {paymentMehod === "BNB" ? "BNB" : "USDT"}</span>
                                    <span className='flex items-center gap-x-0.5 lg:gap-x-0.5 relative -right-[0.700rem] lg:-right-[1.100rem]'><GoDotFill className="text-[#4D4D4D]/50" />CLAIM YOUR RVMT</span>
                                    <span className="font-extrabold font-manrope-bold">{timerData.claimDate}</span>
                                </div>

                                <div className="flex justify-between items-center text-[#212121] font-manrope">
                                    <div className="mt-3 lg:mt-0 w-[8.2rem] h-[4rem] md:w-[9.8rem] lg:w-[10.8rem] lg:h-[3.5rem] bg-[#fafafa] border rounded flex flex-col justify-between py-2 px-2 lg:py-1 lg:p-3 lg:px-4 border-main-100">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-y-0.5 lg:gap-y-0">
                                                <input
                                                    key={11}
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="text-[14px] font-extrabold mt-1 w-full outline-none placeholder:text-mainGray bg-[#FAFAFA]"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => {
                                                        setAmount(e.target.value)
                                                    }
                                                    }
                                                />
                                                <div className="text-[12px] uppercase">
                                                    You Send
                                                </div>
                                            </div>
                                            {
                                                paymentMehod === "BNB" ? (
                                                    <img
                                                        src="./other/bnb-logo.png"
                                                        className="size-[30px] relative -top-2 lg:top-0 lg:size-[32px]"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <img
                                                        src="./other/usdt-logo.png"
                                                        className="size-[30px] relative -top-2 lg:top-0 lg:size-[32px]"
                                                        alt=""
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-3 lg:mt-0 w-[8.2rem] h-[4rem] md:w-[9.8rem] lg:w-[10.8rem] lg:h-[3.5rem] bg-[#fafafa] border rounded flex flex-col justify-between py-2 px-2 lg:py-1 lg:p-3 lg:px-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-y-0.5 lg:gap-y-0 text-mainGray">
                                                <div className="text-[14px] font-extrabold mt-1">
                                                    {willGetTokens}
                                                </div>
                                                <div className="text-[12px] uppercase">
                                                    YOU RECEIVE
                                                </div>
                                            </div>
                                            <img
                                                src="./other/logo2.png"
                                                className="size-[30px] relative -top-2 lg:top-0 lg:size-[32px]"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* login / signup buttons */}
                                <div className="mt-5 lg:mt-5">
                                    {
                                        account && claimEnabled ? (<>

                                            <button
                                                onClick={claimHandler}
                                                className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                CLAIM NOW
                                            </button>

                                        </>) : account ? (
                                            <>
                                                <button
                                                    onClick={refaddr ? buyHandlerByReferal : buyHandler}
                                                    className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                    BUY NOW
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => open()}
                                                    className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-main-100 font-manrope py-2 lg:py-2.5 rounded">
                                                    CONNECT WALLET
                                                </button>
                                            </>
                                        )
                                    }
                                    {!account ? (
                                        <>
                                            <div className="text-center my-[0.200rem] text-mainGray">OR</div>
                                            <div className="flex">
                                                <Link href={"https://app.rvmtoken.io"} className="text-[14px] lg:text-[14px] font-medium text-white w-full bg-mainGray font-manrope py-2 lg:py-2.5 rounded text-center">
                                                    LOGIN / SIGNUP
                                                </Link>
                                            </div>
                                        </>
                                    ) : null
                                    }
                                </div>
                            </section>
                        )
                }

            </>) : (
            <section
                className={`h-full w-[19.438rem] md:w-[24rem] lg:w-[27rem] bg-white border relative z-40 rounded-3xl mx-auto -top-2 8 mt-3 md:mt-10 lg:mt-1 px-4 lg:px-7 py-5 pb-[1.5rem] lg:py-6`}
                style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}
            >
                <div className='text-mainGray text-xl h-[31.5rem] flex flex-col justify-center items-center gap-y-8'>
                    <img src="./other/logo2.png" className='size-16' alt="" />
                    <h3 className='font-manrope-bold'>PRESALE BEGINS IN</h3>
                    <div className='w-full'>
                        <CountDown eventDate={eventDate} setEventPassed={setEventPassed} />
                    </div>
                </div>
            </section>
        )
    )
}

export default Timer;


function CountDown({ eventDate, setEventPassed }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setEventPassed(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [eventDate]);


    return (
        <div className="flex items-center justify-between mx-2 my-0 lg:-my-2 pb-2.5">
            <div>
                <div className="border lg:border-2 border-[#31BAB0] w-12 h-8 lg:h-[2.5rem] lg:w-[3.8rem] rounded text-base lg:text-[16px] font-semibold text-[#31BAB0] flex items-center justify-center">
                    {timeLeft.days}
                </div>
                <div className="uppercase text-[10px] lg:text-[12px] text-[#212121]/70 text-center mt-1">
                    Days
                </div>
            </div>
            <div className="text-[40px] font-extrabold font-manrope text-[#31BAB0] mb-8">
                :
            </div>
            <div>
                <div className="border lg:border-2 border-[#31BAB0] w-12 h-8 lg:h-[2.5rem] lg:w-[3.8rem] rounded text-base lg:text-[16px] font-semibold text-[#31BAB0] flex items-center justify-center">
                    {timeLeft.hours}
                </div>
                <div className="uppercase text-[10px] lg:text-[12px] text-[#212121]/70 text-center mt-1">
                    Hours
                </div>
            </div>
            <div className="text-[40px] font-extrabold font-manrope text-[#31BAB0] mb-8">
                :
            </div>
            <div>
                <div className="border lg:border-2 border-[#31BAB0] w-12 h-8 lg:h-[2.5rem] lg:w-[3.8rem] rounded text-base lg:text-[16px] font-semibold text-[#31BAB0] flex items-center justify-center">
                    {timeLeft.minutes}
                </div>
                <div className="uppercase text-[10px] lg:text-[12px] text-[#212121]/70 text-center mt-1">
                    Mins
                </div>
            </div>
            <div className="text-[40px] font-extrabold font-manrope text-[#31BAB0] mb-8">
                :
            </div>
            <div>
                <div className="border lg:border-2 border-[#31BAB0] w-12 h-8 lg:h-[2.5rem] lg:w-[3.8rem] rounded text-base lg:text-[16px] font-semibold text-[#31BAB0] flex items-center justify-center">
                    {timeLeft.seconds}
                </div>
                <div className="uppercase text-[10px] lg:text-[12px] text-[#212121]/70 text-center mt-1">
                    Secs
                </div>
            </div>
        </div>
    )
}



function Loader() {
    return (
        <section
            className={`h-[37.5rem] w-[19.438rem] md:w-[24rem] lg:w-[27rem] bg-white border relative z-40 rounded-3xl mx-auto -top-2 8 mt-3 lg:mt-1 px-4 lg:px-7 py-3 lg:h-[38.5rem] md:mt-10 text-mainGray flex justify-center items-center`}
            style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}>
            <FaSpinner className="animate-spin text-4xl text-main-100" />
        </section>
    )
}