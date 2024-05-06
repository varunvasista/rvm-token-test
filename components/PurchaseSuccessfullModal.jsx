"use client";

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { RiWhatsappFill } from 'react-icons/ri';
import { IoMdCloseCircle } from "react-icons/io";
import { EmailShareButton, FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function PurchaseSuccessfullModal({ showModal, setShowModal, copyReferalUrlToClipboard, referalLink }) {

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showModal]);

  const handleClose = (event) => {
    if (event.target.id === 'backdrop') {
      setShowModal(false);
    }
  };

  return (
    showModal && (
      <motion.div
        id="backdrop"
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999999] text-black"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ margin: 0, padding: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white p-6 rounded-3xl shadow-lg w-[21.25rem] md:w-[25.063rem] lg:w-[27.063rem] xl:w-[28.125rem] lg:px-14 font-manrope text-mainGray flex flex-col justify-center items-center text-center gap-y-4 relative"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <IoMdCloseCircle className="absolute top-4 right-4 text-mainGray cursor-pointer text-5xl" onClick={() => setShowModal(false)} />
          <img src="./other/gif11.gif" className='size-[8.688rem]' alt="" />
          <h4 className='text-[18px] lg:text-[20px] leading-tight text-main-100 font-manrope-bold text-center'>Your Purchase Was Successful</h4>
          <p className='text-[12px] lg:text-[16px] font-manrope-bold'>Don't wait to claim your RVM tokens! They'll be available once the presale is over.</p>
          <p className='text-[12px] lg:text-[16px] '>
            Want to supercharge your earnings?  Refer your friends with your unique link and get an instant 10% bonus on every purchase they make. It's a win-win!
          </p>
          <button onClick={copyReferalUrlToClipboard} className="bg-main-100 text-white rounded py-2.5 w-full">COPY REFERAL LINK</button>
          <div className="text-[12px] font-manrope-bold text-center">Share it directly on your social media</div>
          <div className="flex flex-row justify-center items-center gap-x-2.5 -mt-1.5">
            <FacebookShareButton
              url={referalLink}
              title={`Hey, use my link to purchase RVM Token using this link`}
              quote={`Hey, use my link to purchase RVM Token using this link`}
              separator=": "
            >
              <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_919_23)">
                  <path d="M28 14.125C28 6.39306 21.7319 0.125 14 0.125C6.26806 0.125 0 6.39306 0 14.125C0 21.1127 5.11963 26.9047 11.8125 27.9549V18.1719H8.25781V14.125H11.8125V11.0406C11.8125 7.53187 13.9027 5.59375 17.1006 5.59375C18.6322 5.59375 20.2344 5.86719 20.2344 5.86719V9.3125H18.4691C16.7299 9.3125 16.1875 10.3917 16.1875 11.4989V14.125H20.0703L19.4496 18.1719H16.1875V27.9549C22.8804 26.9047 28 21.1129 28 14.125Z" fill="#1877F2" />
                  <path d="M19.4496 18.1719L20.0703 14.125H16.1875V11.4989C16.1875 10.3916 16.7299 9.3125 18.4691 9.3125H20.2344V5.86719C20.2344 5.86719 18.6322 5.59375 17.1005 5.59375C13.9027 5.59375 11.8125 7.53188 11.8125 11.0406V14.125H8.25781V18.1719H11.8125V27.9549C12.5361 28.0683 13.2675 28.1252 14 28.125C14.7325 28.1252 15.4639 28.0684 16.1875 27.9549V18.1719H19.4496Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_919_23">
                    <rect width="28" height="28" fill="white" transform="translate(0 0.125)" />
                  </clipPath>
                </defs>
              </svg>
            </FacebookShareButton>
            <TwitterShareButton
              url={referalLink}
              title={`Hey, use my link to purchase RVM Token using this link`}
              separator=": "
              style={{
                backgroundColor: '#1D9BF0', // bg-[#1D9BF0]
                width: '1.8rem', // size-[1.80rem] (using for both width and height)
                height: '1.8rem',
                display: 'flex', // flex
                alignItems: 'center', // items-center
                justifyContent: 'center', // justify-center
                borderRadius: '50%', // rounded-full
              }}
              className="bg-[#1D9BF0] aspect-square rounded-full flex items-center justify-center size-[1.80rem]">
              <FaTwitter className="text-white" />
            </TwitterShareButton>
            <TelegramShareButton
              url={referalLink}
              title={`Hey, use my link to purchase RVM Token using this link`}
              separator=": "
            >
              <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_919_32)">
                  <path d="M15 0.125C11.0227 0.125 7.20469 1.70633 4.39453 4.51836C1.58148 7.33151 0.000779226 11.1467 0 15.125C0 19.1016 1.58203 22.9196 4.39453 25.7316C7.20469 28.5437 11.0227 30.125 15 30.125C18.9773 30.125 22.7953 28.5437 25.6055 25.7316C28.418 22.9196 30 19.1016 30 15.125C30 11.1484 28.418 7.33039 25.6055 4.51836C22.7953 1.70633 18.9773 0.125 15 0.125Z" fill="url(#paint0_linear_919_32)" />
                  <path d="M6.78956 14.967C11.163 13.062 14.0786 11.806 15.5364 11.1992C19.7036 9.4665 20.5685 9.16556 21.1333 9.15536C21.2575 9.15337 21.5341 9.18407 21.7146 9.32997C21.8646 9.45302 21.9067 9.61942 21.9278 9.73626C21.9466 9.85298 21.9724 10.119 21.9513 10.3267C21.7263 12.6985 20.7489 18.4543 20.2521 21.1109C20.0435 22.235 19.6286 22.6119 19.2278 22.6487C18.356 22.7288 17.695 22.0731 16.8513 21.5202C15.5317 20.6546 14.7864 20.116 13.5044 19.2716C12.0232 18.2956 12.9841 17.7592 13.8278 16.8826C14.0482 16.6531 17.8872 13.1621 17.9599 12.8455C17.9692 12.8059 17.9786 12.6582 17.8896 12.5804C17.8028 12.5024 17.6739 12.5291 17.5802 12.5502C17.4466 12.5802 15.3396 13.9742 11.2521 16.7321C10.6544 17.1432 10.113 17.3436 9.6255 17.3331C9.09112 17.3216 8.05987 17.0302 7.29347 16.7813C6.35597 16.4759 5.60831 16.3145 5.67394 15.7958C5.70675 15.5258 6.0794 15.2495 6.78956 14.967Z" fill="white" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_919_32" x1="1500" y1="0.125" x2="1500" y2="3000.13" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2AABEE" />
                    <stop offset="1" stop-color="#229ED9" />
                  </linearGradient>
                  <clipPath id="clip0_919_32">
                    <rect width="30" height="30" fill="white" transform="translate(0 0.125)" />
                  </clipPath>
                </defs>
              </svg>
            </TelegramShareButton>
            <WhatsappShareButton
              url={referalLink}
              title={`Hey, use my link to purchase RVM Token using this link`}
              separator=": "
            >
              <RiWhatsappFill className="text-[#5FD568] text-[2.15rem]" />
            </WhatsappShareButton>
            <EmailShareButton
              url={referalLink}
              title={`Hey, use my link to purchase RVM Token using this link`}
              separator=": "
              subject="Exclusive Invitation: Purchase RVM Token Through My Referral Link!"
            >
              <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16.125" r="16" fill="#ABE1DD" />
                <path d="M8.5 11.9587C8.5 11.5166 8.67559 11.0927 8.98816 10.7801C9.30072 10.4676 9.72464 10.292 10.1667 10.292H21.8333C22.2754 10.292 22.6993 10.4676 23.0118 10.7801C23.3244 11.0927 23.5 11.5166 23.5 11.9587V20.292C23.5 20.734 23.3244 21.1579 23.0118 21.4705C22.6993 21.7831 22.2754 21.9587 21.8333 21.9587H10.1667C9.72464 21.9587 9.30072 21.7831 8.98816 21.4705C8.67559 21.1579 8.5 20.734 8.5 20.292V11.9587Z" stroke="#00A99D" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.5 11.959L16 16.959L23.5 11.959" stroke="#00A99D" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </EmailShareButton>
          </div>
        </motion.div>
      </motion.div>
    )
  );
}
