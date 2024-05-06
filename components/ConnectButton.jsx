import { useWeb3Modal } from '@web3modal/wagmi/react'
import { AppContext } from '@/utils/utils'
import { preSaleReadFunction, tokenReadFunction } from '@/app/conectivity/hooks'
import { formatUnits } from 'viem'
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/slices/setTokenSlice';

export default function ConnectButton() {

    const dispatch = useDispatch();

    const [userPurchasedTokens, setuserPurchasedTokens] = useState(0);

    const { account } = useContext(AppContext);
    //const { address } = useAccount()

    const toLocalFormat = (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const { open } = useWeb3Modal()

    useEffect(() => {
        if (account) {
            (async () => {
                try {
                    let dec = await tokenReadFunction("decimals");
                    //console.log("🚀 ~ dec:", dec)
                    dec = +dec?.toString();

                    let firstAmt = 0;

                    const userExsitOne = await preSaleReadFunction("isExist", [account]);

                    if (userExsitOne) {
                        let userData = await preSaleReadFunction("users", [account]);
                        firstAmt += +parseFloat(
                            +formatUnits(userData[2]?.toString(), dec)
                        )?.toFixed(2);
                    }
                    //console.log("🚀 ~ userPurchasedTokens:", firstAmt)
                    setuserPurchasedTokens(toLocalFormat(firstAmt));
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, [account]);

    useEffect(() => {
        if (account) {
            dispatch(setToken(userPurchasedTokens))
        }
    }, [userPurchasedTokens, account])


    return (
        <>
            {
                account ? (
                    <button onClick={() => open({ view: 'Account' })} className="text-[12px] lg:text-[14px] uppercase bg-white text-main-100 py-1.5 px-2.5 lg:px-14 rounded font-semibold lg:ml-3" type="button">
                        <div className='flex gap-x-3 items-center'>
                            <img src="./other/logo2.png" alt="" className='size-5' />
                            <span className='text-lg'>{userPurchasedTokens}</span>
                        </div>
                    </button>
                ) : (
                    <button onClick={() => open()} className="text-[12px] lg:text-[14px] uppercase bg-white text-main-100 py-2 px-2.5 lg:px-4 rounded font-semibold lg:ml-3" type="button">Connect Wallet</button>
                )
            }
        </>
    )
}