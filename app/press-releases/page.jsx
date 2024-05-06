"use client"

import PressReleasesCard from '@/components/PressReleasesCard';
import { fetchPressReleasesContent } from '@/redux/slices/pressReleasesContentSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowBack } from "react-icons/io";

const page = () => {

    const router = useRouter()

    const dispatch = useDispatch();

    const { data, status, error } = useSelector((state) => state.pressReleasesContent);

    useEffect(() => {
        dispatch(fetchPressReleasesContent());
    }, [])


    return (
        <>
            <button className='xl:hidden fixed top-0 left-0 m-4 p-2 border-2 border-main-100 bg-[#E5F6F5] text-main-100 text-xl rounded-full' type="button" onClick={() => router.back()}>
                <IoMdArrowBack />
            </button>
            <section className='min-h-screen md:my-20' >
                <h1 className="text-[28px] md:text-[40px] text-main-100 text-center my-10 md:mb-16">Press Releases</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center xl:mx-32 2xl:mx-72 gap-y-10'>
                    {
                        data?.map((item, index) => (
                            <PressReleasesCard
                                key={index}
                                date={item.date}
                                paragraph1={item.paragraph1}
                                paragraph2={item.paragraph2}
                                id={item.id}
                            />
                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default page