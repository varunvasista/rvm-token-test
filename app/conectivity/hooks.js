import tokenAbi from "./tokenAbi.json";
import preSaleAbi from "./preSaleAbi.json";
import usdtAbi from "./usdtAbi.json";
import { config } from "@/utils/config"
import {
    tokenAddress,
    preSaleAddress,
    usdtAddress,
} from "./environment";

import { readContract, writeContract } from "wagmi/actions";
import { waitForTransactionReceipt,getBalance} from "@wagmi/core";

export const tokenReadFunction = async (functionName, args) => {
    const data = await readContract(config, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName,
        args,
    });
    return data;
};

export const preSaleReadFunction = async (functionName, args) => {
    const data = await readContract(config,{
        address: preSaleAddress,
        abi: preSaleAbi,
        functionName,
        args,
    });
    return data;
};

export const usdtReadFunction = async (functionName, args) => {
    const data = await readContract(config,{
        address: usdtAddress,
        abi: usdtAbi,
        functionName,
        args,
    });
    return data;
};

/// write functions
export const tokenWriteFunction = async (functionName, args) => {
    const hash  = await writeContract(config,{
        address: tokenAddress,
        abi: tokenAbi,
        functionName,
        args,
    });
    const receipt = await waitForTransactionReceipt(config,{ hash });
    return receipt;
};

export const preSaleWriteFunction = async (functionName, args, value) => {
    const hash = await writeContract(config,{
        address: preSaleAddress,
        abi: preSaleAbi,
        functionName,
        args,
        value,
    });
    const receipt = await waitForTransactionReceipt(config,{ hash });
    return receipt;
};

export const usdtWriteFunction = async (functionName, args) => {
    const hash = await writeContract(config,{
        address: usdtAddress,
        abi: usdtAbi,
        functionName,
        args,
    });
    const receipt = await waitForTransactionReceipt(config,{ hash });
    return receipt;
};

export const checkBalanceFunction = async (address) => {
    const data = await getBalance(config, {
        address: address,
      });
    return data;
};