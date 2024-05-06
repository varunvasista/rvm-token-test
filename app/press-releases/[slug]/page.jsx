"use client"

import Loading from '@/app/loading';
import { fetchPressReleaseDetailsById } from '@/redux/slices/pressReleaseDetailsSlice';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { IoMdArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {

    const router = useRouter()
    const params = useParams();
    const dispatch = useDispatch();
    const { details, loading } = useSelector((state) => state.PressReleaseDetails);

    useEffect(() => {
        dispatch(fetchPressReleaseDetailsById(params.slug));
    }, [params.slug, dispatch]);

    return (
        <>
            <button className='xl:hidden fixed top-0 left-0 m-4 p-2 border-2 border-main-100 bg-[#E5F6F5] text-main-100 text-xl rounded-full' type="button" onClick={() => router.back()}>
                <IoMdArrowBack />
            </button>
            {
                loading ? (<Loading />) : (
                    details && (
                        <section className='mx-5 lg:mx-64 space-y-10 min-h-screen py-20'>
                            <span>{details.date}</span>
                            <h1 className='text-main-100 font-semibold text-[24px]'>
                                {details.title}
                            </h1>
                            {details?.img && <img src={details.img} className='w-fit max-h-full md:w-[40rem] mx-auto' alt="" />}
                            <div className='space-y-5 text-[20px]'>
                                {details.paragraphs.map((paragraph, index) => (
                                    <p key={index}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    )
                )
            }
        </>
    )
}

export default page