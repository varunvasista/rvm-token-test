import Link from 'next/link'
import React from 'react'

const PressReleasesCard = ({ date, paragraph1, paragraph2, id }) => {
    return (
        <div
            className="h-[280px] w-[289px] mx-0 rounded-tl-[80px] rounded-br-[80px] border border-black flex flex-col gap-y-2 py-10 px-5"
            style={{ boxShadow: "0px 0px 6px 6px rgb(229 229 229)" }}
        >
            <div className="flex items-center gap-x-2">
                <img src="./other/logo2.png" className="h-8 w-8 " alt="" />
                <img src="./other/logo-name2.png" className="h-3 max-w-max" alt="" />
            </div>
            <span className="text-[10px]">{date}</span>
            <div className="text-main-200 text-[10px] font-manrope">
                {paragraph1}
            </div>
            <div className="text-[9px] font-manrope">
                {paragraph2}
            </div>
            <Link href={`/press-releases/${id}`} className="text-[14px] text-main-100 underline">
                Know More
            </Link>
        </div>
    )
}

export default PressReleasesCard