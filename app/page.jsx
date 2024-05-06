"use client"

import { RiWhatsappFill } from "react-icons/ri";
import ConnectButton from "@/components/ConnectButton";
import Link from "next/link";
import "react-multi-carousel/lib/styles.css";
import { CiMail } from "react-icons/ci";
import { RxInstagramLogo } from "react-icons/rx";
import { CiTwitter } from "react-icons/ci";
import { PiYoutubeLogo } from "react-icons/pi";
import Accordion from "@/components/Accordion";
import { IoLogoWhatsapp, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuShield } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import Timer from "@/components/Timer";
import { animate } from 'framer-motion';
import { fetchHomeContent } from "@/redux/slices/homeContentSlice";
import VideoModal from "@/components/VideoModal";
import { submitContactForm } from "@/redux/slices/contactFormSlice";
import toast from "react-hot-toast";
import Loading from "./loading";
import { FaLinkedin, FaSpinner, FaTwitter } from "react-icons/fa";
import { fetchPressReleasesContent } from "@/redux/slices/pressReleasesContentSlice";
import { PiTelegramLogo } from "react-icons/pi";
import { ImSpinner8 } from "react-icons/im";
import {
  tokenAddress, bsclink
} from "./conectivity/environment";
import { useSearchParams } from "next/navigation";
import { AppContext } from "@/utils/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { EmailShareButton, FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";


export default function Home() {

  const { open } = useWeb3Modal();

  const { account } = useContext(AppContext);

  const [url, setUrl] = useState('');

  useEffect(() => {
    // Ensure window is accessible (i.e., code is running on the client side)
    if (typeof window !== 'undefined') {
      setUrl(window.location.href); // Gets the full URL
    }
  }, []);

  function removePathFromUrl(url) {
    try {
      // Assuming 'http://localhost' as the default base if URL is relative
      const urlObject = new URL(url, 'http://localhost');
      return `${urlObject.protocol}//${urlObject.host}`;
    } catch (error) {
      console.error("Invalid URL provided:", error);
      return null; // or handle the error as appropriate
    }
  }

  const finalUrl = removePathFromUrl(url);

  const referalLink = `${finalUrl}?refaddr=${account}`


  const divRefs = useRef([]);

  var q1Count = 0;

  const dispatch = useDispatch();

  const [showWhyRVMVideoModal, setShowWhyRVMVideoModal] = useState(false);
  const [showEvmWalletModal, setShowEvmWalletModal] = useState(false);
  const [showRvmtSystemModal, setShowRvmtSystemModal] = useState(false);
  const [hideLoginSignUp, setHideLoginSignUp] = useState(false);
  const [subscribeEmailInput, setSubscribeEmailInput] = useState("");


  const [targetY, setTargetY] = useState(null);
  const [activeFeaturedOn, setActiveFeaturedOn] = useState("COINTELEGRAPH")

  const { content, loading } = useSelector((state) => state.homeContent);
  const { data, status, error } = useSelector((state) => state.pressReleasesContent);

  const [token, setToken] = useState(tokenAddress);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    } catch (err) {
      console.log(err)
      // toast.error("Failed to copy token: " + err.message);
    }
  };

  const copyReferalUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referalLink);
      toast.success("Referal Link copied");
    } catch (err) {
      console.log(err)
      // toast.error("Failed to copy token: " + err.message);
    }
  };

  const [activeRoadmap, setActiveRoadmap] = useState();
  const [currentActiveIndex, setCurrentActiveIndex] = useState()
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState()

  const getActiveRoadmapTitle = (data) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentQuarter = Math.floor((currentDate.getMonth() + 3) / 3);

    let activeTitle = "No active roadmap";

    data.forEach((item) => {
      if (item.year.startsWith(currentYear.toString())) {
        // If the current year matches and the item is not for a specific quarter
        if (!item.year.includes('Q') && currentYear !== 2024) {
          activeTitle = item.title;
        }
        // If the current year is 2024, check for quarters
        if (currentYear === 2024 && item.year.includes(`Q${currentQuarter}`)) {
          activeTitle = item.title;
        }
      }
    });
    return activeTitle;
  };


  useEffect(() => {
    if (content?.roadmapSection?.data) {
      setActiveRoadmap(getActiveRoadmapTitle(content?.roadmapSection?.data));
    }
  }, [content?.roadmapSection?.data]);

  const aboutRVMSection = useRef(null);
  const tokenDistributionSection = useRef(null);
  const roadmapSection = useRef(null);
  const teamSection = useRef(null);
  const whitepaperSection = useRef(null);
  const whyChooseRVMSection = useRef(null);


  const scrollToSection = (ref) => {
    setTargetY(null); // Reset the targetY state
    setTimeout(() => {
      setTargetY(ref.current.offsetTop);
    }, 0);
  };

  useEffect(() => {
    dispatch(fetchHomeContent());
    dispatch(fetchPressReleasesContent());
  }, []);

  useEffect(() => {
    if (targetY !== null) {
      const controls = animate(window.scrollY, targetY, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        onUpdate: (value) => {
          window.scrollTo(0, value);
        },
      });

      return () => controls.stop();
    }
  }, [targetY]);


  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    message: ''
  });

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({
      ...contactFormData,
      [name]: value
    });
  };

  const handleSubmitContactForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const telegram = formData.get('telegram');
    const message = formData.get('message');
    dispatch(submitContactForm({ name, email, telegram, message }));
    setContactFormData({
      name: '',
      email: '',
      telegram: '',
      message: ''
    });
  }

  const { response } = useSelector((state) => state.contactFrom);

  useEffect(() => {
    if (response?.success) {
      toast.success("Message sent successfully");
    }
    if (response?.success === false) {
      toast.error("Failed to send message");
    }
  }, [response]);

  const connectWalletHandler = () => {
    console.log("connectWalletHandler")
    setHideLoginSignUp(true)
  }

  let activeRoadmapData

  if (activeRoadmap) {
    activeRoadmapData = content.roadmapSection.data?.find((e) => e.title === activeRoadmap);
  }

  const activeFeaturedOnData = content.featuredOnSection.data?.find((e) => e.title === activeFeaturedOn);

  const scrollContainerRef = useRef(null);
  // Scroll the active div into view for roadmap mobile screen
  const [hasScrolled, setHasScrolled] = useState(false); // Add this line

  useEffect(() => {
    if (!hasScrolled) {
      const activeIndex = content.roadmapSection.data.findIndex(e => e.title === activeRoadmap);
      if (divRefs.current[activeIndex]) {
        setTimeout(() => {
          // Calculate the scroll position
          const scrollContainer = scrollContainerRef.current; // Use the ref here
          const activeElement = divRefs.current[activeIndex];
          if (scrollContainer && activeElement) {
            const scrollPosition = activeElement.offsetLeft + (activeElement.offsetWidth / 2) - (scrollContainer.offsetWidth / 2);

            // Scroll horizontally without affecting the vertical scroll position
            scrollContainer.scrollLeft = scrollPosition;
            setHasScrolled(true); // Set hasScrolled to true after the scroll
          }
        }, 0); // Delay execution to the next event loop
      }
    }
  }, [content.roadmapSection.data, activeRoadmap]); // Add activeRoadmap as a dependency

  function findIndexByTitle(data, title) {
    return data.findIndex(item => item.title === title);
  }

  useEffect(() => {
    if (content.roadmapSection.data.length > 0 && activeRoadmap) {
      const data = content.roadmapSection.data;
      const currentRoadmapIndex = findIndexByTitle(data, activeRoadmap);
      setCurrentActiveIndex(currentRoadmapIndex);
      setSelectedRoadmapIndex(currentRoadmapIndex);
    }
  }, [content.roadmapSection.data, currentActiveIndex])


  const subscribeEmailFormHandler = (e) => {
    e.preventDefault();
    console.log("subscribeEmailInput");
  }

  return (
    <>
      <header className="relative m-6 lg:mx-10 xl:mx-36 lg:my-7 z-[999] flex justify-between items-center text-white">
        <div className="flex justify-center items-center gap-2 lg:gap-x-2 xl:gap-x-4">
          <img
            src="./other/logo.png"
            className="h-[29.64px] w-[29.64px] lg:h-[31.95px] lg:w-[31.95px] xl:h-[51.95px] xl:w-[51.95px]"
            alt=""
          />
          <img
            src="./other/logo-name.png"
            className="h-[12.92px] lg:h-[16.76px] xl:h-[22.76px] max-w-max"
            alt=""
          />
        </div>
        <nav className="flex justify-center items-center gap-x-2 lg:gap-x-5 text-[14px]">
          <Link href="" className="text-xs lg:text-xl uppercase font-manrope-bold hidden lg:block">
            PreSale
            <span
              style={{
                background: "#F13C14",
                padding: "3px 10px 3px 10px",
                color: "#F9F9F9",
                borderRadius: "12px",
                marginLeft: "7px",
                fontSize: "12px",
                position: "relative",
                top: "-4.5px",
              }}
            >
              LIVE
            </span>
          </Link>
          <Link href="#" onClick={() => scrollToSection(aboutRVMSection)} className="text-xs lg:text-xl uppercase font-manrope-bold hidden lg:block">
            About Us
          </Link>
          <Link href="#" onClick={() => scrollToSection(roadmapSection)} className="text-xs lg:text-xl uppercase font-manrope-bold hidden lg:block">
            Roadmap
          </Link>
          <Link href="#" onClick={() => scrollToSection(teamSection)} className="text-xs lg:text-xl uppercase font-manrope-bold hidden lg:block">
            Team
          </Link>
        </nav>
        <div>
          <ConnectButton />
        </div>
      </header>
      <main className="mx-auto font-quinn">

        {/* mobile wave  */}
        <div className="block lg:hidden relative -top-24 h-[50vh]">
          <img src="./other/wave3.png" className="absolute w-screen" alt="" />
          <img src="./other/wave2.png" className="absolute w-screen" alt="" />
          <img src="./other/wave1.png" className="absolute w-screen top-3" alt="" />
        </div>

        <div className="mx-auto absolute lg:relative -top-[12.300rem] text-white">
          {/* desktop wave  */}
          <img
            src="./other/wave4.png"
            className="hidden lg:block absolute h-[110%] w-[110%] xl:h-fit xl:w-full object-cover object-center overflow-visible "
            alt=""
          />
          {/* desktop wave  */}
          <img
            src="./other/wave5.png"
            className="hidden lg:block absolute h-[110%] w-[110%] xl:h-fit xl:w-full object-cover object-center overflow-visible "
            alt=""
          />
          {/* desktop wave  */}
          <img
            src="./other/wave6.png"
            className="hidden lg:block absolute h-[110%] w-[110%] xl:h-fit xl:w-full object-cover object-center overflow-visible "
            alt=""
          />
          <div className="flex flex-col lg:flex-row lg:items-start justify-center lg:gap-x-10 lg:mt-24 lg:mx-32">
            <div className="relative mt-20 z-50 text-center lg:text-start pt-56 lg:mt-0 top-0 lg:w-[32.25rem] 2xl:w-[42.25rem]">
              <h1 className="text-[28px] leading-tight lg:leading-none font-medium lg:text-[40px] lg:mt-5 lg:font-semibold">
                {content.heroSection.title}
              </h1>
              <h2 className="text-[18px] mx-16 leading-tight lg:mx-0 lg:leading-none mt-2 lg:mt-4 lg:text-[26px] lg:font-medium">
                {content.heroSection.subTitle}
              </h2>
              <div className="flex items-center gap-y-1.5 lg:gap-y-3 gap-x-3 my-5 justify-center lg:justify-normal ">
                <Link href={"https://www.forbes.com/advisor/in/investing/cryptocurrency/what-is-cryptocurrency-and-how-does-it-work/"} style={{pointerEvents: "none"}} target="_blank" className="text-[12px] font-manrope flex items-center gap-x-1 border text-[#212121] border-[#212121] py-1.5 px-3 rounded bg-white">
                  <IoMdCheckmarkCircleOutline className="text-xl" />
                  Audited
                </Link>
                <Link href={"https://www.forbes.com/advisor/in/investing/cryptocurrency/what-is-cryptocurrency-and-how-does-it-work/"} style={{pointerEvents: "none"}} target="_blank" className="text-[12px] font-manrope flex items-center gap-x-1 border text-white border-white py-1.5 px-3 rounded bg-main-100">
                  <LuShield className="text-xl" />
                  Verified
                </Link>
              </div>
              <p className="leading-tight lg:leading-snug text-[12px] lg:text-[16px] font-manrope mx-8 lg:mx-0">
                {content.heroSection.paragraph}
              </p>
              <div className="flex flex-col items-center lg:items-start lg:flex-row gap-y-4 lg:gap-y-0 lg:space-x-5 my-5">
                <button
                  onClick={() => scrollToSection(whitepaperSection)}
                  className="text-[12px] lg:text-[14px] bg-mainGray py-3.5 w-[182px] rounded"
                >
                  WHITE PAPER
                </button>
                <button
                  onClick={() => setShowWhyRVMVideoModal(true)}
                  className="text-[12px] lg:text-[14px] bg-white text-black py-3.5 w-[182px] rounded"
                  
                >
                  WHY RVM?
                </button>
                <VideoModal key={1} showModal={showWhyRVMVideoModal} videoId={content.heroSection.whyChooseRVMVideoId} title={content.heroSection.whyChooseRVMVideoTitle} setShowModal={setShowWhyRVMVideoModal} />
              </div>
            </div>
            {/*  timer  */}
            <div className="relative lg:top-[8rem] 2xl:top-[10rem]">
              <Timer referalLink={referalLink} hideLoginSignUp={hideLoginSignUp} token={token} copyReferalUrlToClipboard={copyReferalUrlToClipboard} />
            </div>
          </div>
        </div>

        {/* desktop */}
        <div
          className="hidden lg:flex lg:w-[55rem] xl:w-[69.625rem] py-5 items-center text-mainGray border font-manrope justify-between px-10 rounded my-5 mx-auto mt-11 lg:mt-0 mb-20 xl:mt-20 1xl:mt-32 1.5xl:mt-44 2xl:mt-28 3xl:mt-52 4xl:mt-56 5xl:mt-64 6xl:mt-80 7xl:mt-96 bg-white relative z-[9999]"
          style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}
        >
          <div className="flex items-center gap-x-3">
            <img src="./other/logo2.png" className="size-[50px]" alt="" />
            <div className="flex flex-col">
              <div className="text-[16px] font-extrabold">
                {token}
              </div>
              <div className="text-[12px]">
                {content.copyTokenSection.text}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-5">
            <div className="border border-mainGray/50 p-2 rounded cursor-pointer" onClick={copyToClipboard}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16C21 16.2652 20.8946 16.5196 20.7071 16.7071C20.5196 16.8946 20.2652 17 20 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15H20C20.2652 15 20.5196 15.1054 20.7071 15.2929C20.8946 15.4804 21 15.7348 21 16ZM20 19H12C11.7348 19 11.4804 19.1054 11.2929 19.2929C11.1054 19.4804 11 19.7348 11 20C11 20.2652 11.1054 20.5196 11.2929 20.7071C11.4804 20.8946 11.7348 21 12 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20C21 19.7348 20.8946 19.4804 20.7071 19.2929C20.5196 19.1054 20.2652 19 20 19ZM27 6V25C27 26.0609 26.5786 27.0783 25.8284 27.8284C25.0783 28.5786 24.0609 29 23 29H9C7.93913 29 6.92172 28.5786 6.17157 27.8284C5.42143 27.0783 5 26.0609 5 25V6C5 5.46957 5.21071 4.96086 5.58579 4.58579C5.96086 4.21071 6.46957 4 7 4H9V3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2C10.2652 2 10.5196 2.10536 10.7071 2.29289C10.8946 2.48043 11 2.73478 11 3V4H15V3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V4H21V3C21 2.73478 21.1054 2.48043 21.2929 2.29289C21.4804 2.10536 21.7348 2 22 2C22.2652 2 22.5196 2.10536 22.7071 2.29289C22.8946 2.48043 23 2.73478 23 3V4H25C25.5304 4 26.0391 4.21071 26.4142 4.58579C26.7893 4.96086 27 5.46957 27 6ZM25 6H23V7C23 7.26522 22.8946 7.51957 22.7071 7.70711C22.5196 7.89464 22.2652 8 22 8C21.7348 8 21.4804 7.89464 21.2929 7.70711C21.1054 7.51957 21 7.26522 21 7V6H17V7C17 7.26522 16.8946 7.51957 16.7071 7.70711C16.5196 7.89464 16.2652 8 16 8C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V6H11V7C11 7.26522 10.8946 7.51957 10.7071 7.70711C10.5196 7.89464 10.2652 8 10 8C9.73478 8 9.48043 7.89464 9.29289 7.70711C9.10536 7.51957 9 7.26522 9 7V6H7V25C7 25.5304 7.21071 26.0391 7.58579 26.4142C7.96086 26.7893 8.46957 27 9 27H23C23.5304 27 24.0391 26.7893 24.4142 26.4142C24.7893 26.0391 25 25.5304 25 25V6Z"
                  fill="#4D4D4D"
                />
              </svg>
            </div>
            <div className="bg-black w-[0.010rem] h-16" />
            <img src="./other/bnb-logo.png" className="size-[51px]" alt="" />
            <div className="flex flex-col">
              <div className="text-[14px] font-semibold">BSC BEP-20</div>
              <div className="text-[12px]">NETWORK</div>
            </div>
            <Link href={bsclink} target="_blank" className="border border-mainGray/50 p-2 rounded">
              <img src="./other/img3.png" className="size-[33px]" alt="" />
            </Link>
          </div>
        </div>

        {/* mobile  */}
        <div
          className="w-[311px] h-[160px] md:w-[550px] md:h-[170px] lg:hidden border bg-white border-mainGray/15 mx-auto p-5 rounded-2xl font-manrope text-mainGray mt-[55rem] mb-14 h-lg:mt-[53rem] h-xl:mt-[51rem] relative h-2xl:mt-[48rem] h-3xl:mt-[51rem] h-4xl:mt-[43rem] h-4.5xl:mt-[48rem] h-5xl:mt-[49rem] h-7xl:mt-[55rem]"
          style={{ boxShadow: "0px 0px 7px 7px rgb(163 163 163 / 22%)" }}
        >
          <div className="flex justify-between">
            <div className="flex items-end gap-x-2.5">
              <img src="./other/logo2.png" className="size-[36.84px]" alt="" />
              <img src="./other/bnb-logo.png" className="size-[26px]" alt="" />
            </div>
            <div className="flex items-end gap-x-2.5">
              <Link target="_blank" href={bsclink} className="w-fit border border-mainGray/50 p-1.5 lg:p-2 rounded">
                <img src="./other/img3.png" className="size-[21px]" alt="" />
              </Link>
              <div
                onClick={copyToClipboard}
                className="w-fit border border-mainGray/50 p-1.5 lg:p-2 rounded cursor-pointer">
                <svg
                  className="size-[21px] lg:size-[32px]"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 16C21 16.2652 20.8946 16.5196 20.7071 16.7071C20.5196 16.8946 20.2652 17 20 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15H20C20.2652 15 20.5196 15.1054 20.7071 15.2929C20.8946 15.4804 21 15.7348 21 16ZM20 19H12C11.7348 19 11.4804 19.1054 11.2929 19.2929C11.1054 19.4804 11 19.7348 11 20C11 20.2652 11.1054 20.5196 11.2929 20.7071C11.4804 20.8946 11.7348 21 12 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20C21 19.7348 20.8946 19.4804 20.7071 19.2929C20.5196 19.1054 20.2652 19 20 19ZM27 6V25C27 26.0609 26.5786 27.0783 25.8284 27.8284C25.0783 28.5786 24.0609 29 23 29H9C7.93913 29 6.92172 28.5786 6.17157 27.8284C5.42143 27.0783 5 26.0609 5 25V6C5 5.46957 5.21071 4.96086 5.58579 4.58579C5.96086 4.21071 6.46957 4 7 4H9V3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2C10.2652 2 10.5196 2.10536 10.7071 2.29289C10.8946 2.48043 11 2.73478 11 3V4H15V3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V4H21V3C21 2.73478 21.1054 2.48043 21.2929 2.29289C21.4804 2.10536 21.7348 2 22 2C22.2652 2 22.5196 2.10536 22.7071 2.29289C22.8946 2.48043 23 2.73478 23 3V4H25C25.5304 4 26.0391 4.21071 26.4142 4.58579C26.7893 4.96086 27 5.46957 27 6ZM25 6H23V7C23 7.26522 22.8946 7.51957 22.7071 7.70711C22.5196 7.89464 22.2652 8 22 8C21.7348 8 21.4804 7.89464 21.2929 7.70711C21.1054 7.51957 21 7.26522 21 7V6H17V7C17 7.26522 16.8946 7.51957 16.7071 7.70711C16.5196 7.89464 16.2652 8 16 8C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V6H11V7C11 7.26522 10.8946 7.51957 10.7071 7.70711C10.5196 7.89464 10.2652 8 10 8C9.73478 8 9.48043 7.89464 9.29289 7.70711C9.10536 7.51957 9 7.26522 9 7V6H7V25C7 25.5304 7.21071 26.0391 7.58579 26.4142C7.96086 26.7893 8.46957 27 9 27H23C23.5304 27 24.0391 26.7893 24.4142 26.4142C24.7893 26.0391 25 25.5304 25 25V6Z"
                    fill="#4D4D4D"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2 my-3">
            <div className="text-[10px] font-manrope-bold">
              {token}
            </div>
            <div className="text-[8px]">
              {content.copyTokenSection.text}
            </div>
          </div>
          <hr className="bg-mainGray" />
          <div className="mt-1 text-[10px] font-manrope-bold">BSC BEP-20</div>
          <div className="mt-0.5 text-[8px]">NETWORK</div>
        </div>


        <section className="flex flex-col lg:flex-row-reverse lg:justify-center lg:gap-x-10 xl:gap-x-20 bg-[#00A99D] py-16 mb-14 lg:mb-28" >
          <div className="text-white flex flex-col items-center justify-center -mt-14">
            <img src="./other/gif10.gif" className="h-[18.688rem] max-w-full" alt="" />
            <div>
              <h4 className="text-[24px] lg:text-[32px] font-quinn leading-8 text-center">
                Refer & Earn a 10% bonus <br /> from all referred investors!
              </h4>
              <p className="font-manrope text-[12px] lg:text-[20px] text-center mt-5">Refer your friends to our platform and you'll <br /> get a 10% bonus instantly on their successful purchase</p>
            </div>
          </div>
          <div
            className="mx-auto lg:mx-0 w-[21.25rem] md:w-[25.063rem] lg:w-[28.063rem] xl:w-[33.063rem] max-w-full  rounded-tl-[80px] rounded-br-[80px] lg:rounded-tl-[160px] lg:rounded-br-[160px] flex flex-col bg-white text-mainGray font-manrope px-10  gap-y-4 pt-16 pb-7 mt-8"
            style={{ boxShadow: "0px 0px 7px 7px #00000024" }}
          >
            <h4 className="text-main-100 text-[16px] lg:text-[24px] font-manrope-bold text-center leading-tight lg:mx-7">Earn more RVM Token by referring your friends and community!</h4>
            <p className=" text-center text-[12px] lg:text-[14px] leading-tight lg:mx-5">Share your unique link below and receive 10% of all transaction realised with your link instantly</p>
            <div className="flex border-[2.3px] border-dotted border-main-100 w-full p-1.5 rounded items-center justify-between mt-3">
              <div
                className="font-manrope-bold text-[14px] pl-2 overflow-scroll whitespace-nowrap"
                style={{
                  scrollbarWidth: 'none', /* For Firefox */
                  msOverflowStyle: 'none' /* For Internet Explorer and Edge */
                }}
              >{account ? referalLink : "Connect your wallet to copy"}</div>
              {/* copy btn */}
              <button onClick={account ? () => copyReferalUrlToClipboard() : () => open()} className="bg-main-100 p-1.5 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9V6.2C9 5.08 9 4.52 9.218 4.092C9.41 3.715 9.715 3.41 10.092 3.218C10.52 3 11.08 3 12.2 3H17.8C18.92 3 19.48 3 19.908 3.218C20.2843 3.40974 20.5903 3.71569 20.782 4.092C21 4.52 21 5.08 21 6.2V11.8C21 12.92 21 13.48 20.782 13.908C20.5901 14.2842 20.2842 14.5901 19.908 14.782C19.48 15 18.92 15 17.803 15H15M9 9H6.2C5.08 9 4.52 9 4.092 9.218C3.71565 9.40969 3.40969 9.71565 3.218 10.092C3 10.52 3 11.08 3 12.2V17.8C3 18.92 3 19.48 3.218 19.908C3.40974 20.2843 3.71569 20.5903 4.092 20.782C4.519 21 5.079 21 6.197 21H11.804C12.921 21 13.48 21 13.908 20.782C14.2843 20.5903 14.5903 20.2843 14.782 19.908C15 19.48 15 18.921 15 17.803V15M9 9H11.8C12.92 9 13.48 9 13.908 9.218C14.2843 9.40974 14.5903 9.71569 14.782 10.092C15 10.519 15 11.079 15 12.197V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
            <button onClick={account ? () => copyReferalUrlToClipboard() : () => open()} className="bg-main-100 text-white rounded py-3">{account ? "COPY REFERAL LINK" : "CONNECT WALLET"}</button>
            <div className="text-[12px] font-manrope-bold text-center">Share it directly on your social media</div>
            {
              account ? (
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
              ) : (
                <div className="flex flex-row justify-center items-center gap-x-2.5 -mt-1.5">
                  <button onClick={account ? null : () => open()} >
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
                  </button>
                  <button onClick={account ? null : () => open()} className="bg-[#1D9BF0] aspect-square rounded-full flex items-center justify-center size-[1.80rem]">
                    <FaTwitter className="text-white" />
                  </button>
                  <button onClick={account ? null : () => open()} >
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
                  </button>
                  <button onClick={account ? null : () => open()} >
                    <RiWhatsappFill className="text-[#5FD568] text-[2.15rem]" />
                  </button>
                  <button onClick={account ? null : () => open()} >
                    <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16.125" r="16" fill="#ABE1DD" />
                      <path d="M8.5 11.9587C8.5 11.5166 8.67559 11.0927 8.98816 10.7801C9.30072 10.4676 9.72464 10.292 10.1667 10.292H21.8333C22.2754 10.292 22.6993 10.4676 23.0118 10.7801C23.3244 11.0927 23.5 11.5166 23.5 11.9587V20.292C23.5 20.734 23.3244 21.1579 23.0118 21.4705C22.6993 21.7831 22.2754 21.9587 21.8333 21.9587H10.1667C9.72464 21.9587 9.30072 21.7831 8.98816 21.4705C8.67559 21.1579 8.5 20.734 8.5 20.292V11.9587Z" stroke="#00A99D" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.5 11.959L16 16.959L23.5 11.959" stroke="#00A99D" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              )
            }
          </div>
        </section>

        <section className="mx-7 text-mainGray px-0 flex flex-col lg:flex-row justify-evenly items-center lg:mx-auto">
          <div className="space-y-7 lg:w-[35rem]">
            <div className="flex items-center relative text-xl">
              <img
                src="./other/leaf.png"
                className="absolute -z-10 h-10 lg:h-20 max-w-max lg:max-h-max -left-3 xl:-left-[3.7rem] lg:-bottom-4"
                alt=""
              />
              <h1 className="text-[28px] lg:text-[40px] text-main-200">
                <span className="text-mainGray">{content.howToBuySection.title[0]}</span> {content.howToBuySection.title[1]}
              </h1>
            </div>
            <p className="font-manrope-bold text-[16px] lg:text-[20px]">
              {content.howToBuySection.data[0]?.subTitle}
            </p>
            <div className="font-manrope space-y-5">
              {
                content.howToBuySection.data[0]?.paragraph?.map((e, i) => (
                  <div key={i} className="flex items-center">
                    <img
                      src="./other/leaf2.png"
                      className="relative bottom-6 lg:bottom-3 mr-2"
                      alt=""
                    />
                    <p className="text-[16px]">
                      {e}
                    </p>
                  </div>
                ))
              }
              <p className="font-manrope-bold text-[16px] lg:text-[20px] pt-1">
                {content.howToBuySection.data[1]?.subTitle}
              </p>
              {
                content.howToBuySection.data[1]?.paragraph?.map((e, i) => (
                  <div key={i} className="flex items-center">
                    <img
                      src="./other/leaf2.png"
                      className="relative bottom-6 lg:bottom-3 mr-2"
                      alt=""
                    />
                    <p className="text-[16px]">
                      {e}
                    </p>
                  </div>
                ))
              }
              <h4 className="font-manrope-bold text-[14px] lg:text-[16px]">{content.howToBuySection.videoTitle}</h4>
              <div className="space-y-2 lg:space-x-7">
                <button
                  onClick={() => setShowEvmWalletModal(true)}
                  className="text-[14px] lg:text-[16px] font-medium text-white w-full lg:w-[192px] bg-main-100 font-manrope py-2 lg:py-3 rounded"
                  disabled
                >
                  EVM WALLET
                </button>
                <VideoModal key={2} showModal={showEvmWalletModal} videoId={content.howToBuySection.evmWalletVideoId} title={content.howToBuySection.evmWalletVideoTitle} setShowModal={setShowEvmWalletModal} />
                <button
                  className="text-[14px] lg:text-[16px] font-medium text-white w-full lg:w-[192px] bg-mainGray font-manrope py-2 lg:py-3 rounded"
                  onClick={() => setShowRvmtSystemModal(true)}
                  disabled
                >
                  RVMT SYSTEM
                </button>
                <VideoModal key={3} showModal={showRvmtSystemModal} videoId={content.howToBuySection.rvmtSystemVideoId} title={content.howToBuySection.rvmtSystemVideoTitle} setShowModal={setShowRvmtSystemModal} />
              </div>
            </div>
          </div>
          <img
            src="./other/gif1.gif"
            className="mt-7 lg:mt-0 size-[303px] lg:h-[350px] lg:w-[350px] xl:h-[450px] xl:w-[450px] object-cover object-center"
            alt=""
          />
        </section>

        <section className="mx-5 lg:mx-0 mt-20 relative xl:w-full flex items-end float-right xl:mr-12 3xl:mr-0 4xl:-mr-0 lg:pr-36 z-[999]">
          {/* <img
                  src="./other/leaf3.png"
                  className="absolute -bottom-10 -right-0 rotate-45 lg:rotate-0 lg:right-24 lg:bottom-5 -z-20 3xl:right-56 4xl:right-[18rem]"
                  alt=""
                /> */}
          <div className="relative xl:left-[40rem] 2xl:left-[45rem] md:h-[444.5px] md:w-[640px] flex justify-center items-center px-4 py-14 lg:py-0 md:px-14 bg-mainGray rounded-tl-[100px] rounded-br-[100px] lg:rounded-tl-[194px] lg:rounded-br-[194px] md:mx-12 lg:mx-0">
            {/* <img
                    src="/bg1.png"
                    className="lg:h-[508px] lg:w-[640px] absolute -z-10"
                    alt=""
                  /> */}
            <div className="space-y-5 lg:space-y-7">
              <h1 className="text-white text-[28px] lg:text-[40px]">
                {content.whatIsRVMTokenSection.title[0]} <span className="text-main-200"> {content.whatIsRVMTokenSection.title[1]}</span>
              </h1>
              {
                content.whatIsRVMTokenSection.paragraph?.map((e, i) => (
                  <p key={i} className="text-white text-[16px] font-manrope">
                    {e}
                  </p>
                ))
              }
            </div>
          </div>
        </section>

        <section className="relative top-24 h-fit mb-48 lg:mb-0 lg:h-[700px] xl:h-[548px] lg:w-[708px] flex justify-center items-center lg:-top-48 xl:-top-72 container lg:pl-14 2xl:pl-36 3xl:pl-80 4xl:pl-[35rem]">
          <img
            src="./other/gif2.gif"
            className="size-[235px] lg:h-[394px] lg:w-[394px] relative top-5 lg:top-0 object-cover overflow-auto lg:overflow-visible"
            alt=""
          />
          <img
            src="./other/bg2.png"
            className="h-[378px] w-[343px] md:w-[458px] lg:h-[548px] lg:w-[708px] absolute -z-10 mt-10"
            alt=""
          />
        </section>

        <section ref={whyChooseRVMSection} className="bg-[url('../public/other/bg6.png')] lg:bg-[url('../public/other/bg6.png')] h-[1200px] bg-cover bg-no-repeat bg-center lg:h-[520px] xl:h-[485px] w-full lg:-mt-52 text-white text-center px-7 lg:px-0 md:pt-20 lg:pt-0">
          <div className="py-14">
            <h1 className="text-[28px] leading-tight lg:leading-10 lg:text-[40px] lg:font-bold ">
              {content.whyChooseRVMSection.title}
            </h1>
            <p className="text-[14px] lg:text-[16px] font-manrope mt-5">
              {content.whyChooseRVMSection.subTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 place-items-center lg:mx-20 2xl:mx-40 gap-y-16">
            <div className="flex flex-col lg:flex-row text-center justify-center items-center gap-x-7 lg:w-[400px] xl:w-[520px] lg:text-start lg:px-0 md:mx-20 lg:mx-0">
              <div className="size-[70px] lg:size-[80px] aspect-square bg-white rounded-full p-2 lg:p-3 mb-4 lg:mb-0">
                <img src="./other/gif3.gif" alt="" />
              </div>
              <div className="flex flex-col justify-start lg:items-start">
                <h2 className="uppercase text-[16px] lg:font-bold">
                  {content.whyChooseRVMSection.contents[0]?.title}
                </h2>
                <p className="text-white font-manrope text-[14px] mt-2 lg:mt-0">
                  {content.whyChooseRVMSection.contents[0]?.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row text-center justify-center items-center gap-x-7 lg:w-[400px] xl:w-[520px] lg:text-start lg:px-0 md:mx-20 lg:mx-0">
              <div className="size-[70px] lg:size-[80px] aspect-square bg-white rounded-full p-2 lg:p-3 mb-4 lg:mb-0">
                <img src="./other/gif4.gif" alt="" />
              </div>
              <div className="flex flex-col justify-start lg:items-start">
                <h2 className="uppercase text-[16px] lg:font-bold">{content.whyChooseRVMSection.contents[1]?.title}</h2>
                <p className="text-white font-manrope text-[14px] mt-2 lg:mt-0">
                  {content.whyChooseRVMSection.contents[1]?.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row text-center justify-center items-center gap-x-7 lg:w-[400px] xl:w-[520px] lg:text-start lg:px-0 md:mx-20 lg:mx-0">
              <div className="size-[70px] lg:size-[80px] aspect-square bg-white rounded-full p-2 lg:p-3 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                <img src="./other/gif5.gif" alt="" />
              </div>
              <div className="flex flex-col justify-start lg:items-start">
                <h2 className="uppercase text-[16px] lg:font-bold">
                  {content.whyChooseRVMSection.contents[2]?.title}
                </h2>
                <p className="text-white font-manrope text-[14px] mt-2 lg:mt-0">
                  {content.whyChooseRVMSection.contents[2]?.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row text-center justify-center items-center gap-x-7 lg:w-[400px] xl:w-[520px] lg:text-start lg:px-0 md:mx-20 lg:mx-0">
              <div className="size-[70px] lg:size-[80px] aspect-square bg-white rounded-full p-2 lg:p-3 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                <img src="./other/gif6.gif" alt="" />
              </div>
              <div className="flex flex-col justify-start lg:items-start">
                <h2 className="uppercase text-[16px] lg:font-bold">
                  {content.whyChooseRVMSection.contents[3]?.title}
                </h2>
                <p className="text-white font-manrope text-[14px] mt-2 lg:mt-0">
                  {content.whyChooseRVMSection.contents[3]?.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={aboutRVMSection} className="relative -mt-5 lg:mt-20 h-[600px] md:h-[730px] lg:h-[720px] xl:h-[660px] 2xl:h-[675px]">
          <img src="./other/leaf4.png" className="h-28 lg:max-h-full absolute object-cover object-center" alt="" />
          <img
            src="./other/leaf5.png"
            className="w-28 lg:max-w-full absolute -mt-4 lg:mt-5"
            alt=""
          />

          <div className="absolute lg:mx-56 mt-28 lg:mt-14 mx-7">
            <h1 className="text-[28px] lg:text-[40px] text-main-200 text-start">
              <span className="text-mainGray">{content.aboutRVMSection.title[0]} </span>{content.aboutRVMSection.title[1]}
            </h1>
            <p className="text-[14px] lg:text-[16px] font-manrope text-black text-start">
              {content.aboutRVMSection.paragraph}
            </p>
            <img src="./other/gif7.gif" className="w-full mt-5 lg:h-96 lg:max-w-fit object-cover object-center mx-auto" alt="" />
          </div>
        </section>

        <section className="relative max-h-fit lg:h-[300px] w-full bg-[#00A99D]">
          <img
            src="./other/bg4.png"
            className="h-full lg:h-[300px] w-full absolute object-cover object-center"
            alt=""
          />
          <div className="py-10 lg:py-20 text-white text-center mx-2 lg:mx-40 z-50 relative">
            <h1 className="text-[28px] leading-tight lg:leading-none lg:text-[40px] lg:font-semibold">
              {content.rvmOverviewSection.title}
            </h1>
            <p className="text-[14px] lg:text-[20px] font-manrope mt-3 mx-7 lg:mx-0">
              {content.rvmOverviewSection.paragraph}
            </p>
          </div>
        </section>

        <section ref={tokenDistributionSection} className="bg-[#fafafa] pb-7 md:pb-20">
          <div className="pt-8 lg:pt-20 w-full">
            <h1 className="text-[28px] lg:text-[40px] text-main-200 text-center">
              <span className="text-mainGray">{content.tokenDistributionSection.title[0]} </span>{content.tokenDistributionSection.title[1]}
            </h1>
            <p className="mt-4 lg:mt-0 text-[12px] lg:text-[16px] font-manrope text-black text-center mx-7 lg:mx-0">
              {content.tokenDistributionSection.paragraph}
            </p>
          </div>

          <div className="mx-7 lg:mx-0 flex flex-col lg:flex-row justify-center items-center gap-x-7 xl:gap-x-20 mt-10 lg:mt-20 gap-y-14 lg:gap-y-0">
            <img
              src="./other/chart3.png"
              className="md:w-[516px] 2xl:w-[544] lg:max-h-max object-cover object-center"
              alt=""
            />
            <ul className="w-[300px] md:w-[384px] text-[14px] lg:text-[16px] px-5 lg:px-0">
              <li className="bg-[#049389] flex justify-between text-white py-3.5 px-5 lg:px-8 rounded-t-3xl">
                <div className="">{content.tokenDistributionSection.table[0]?.name}</div>
                <div>{content.tokenDistributionSection.table[0]?.value}</div>
              </li>
              {
                content.tokenDistributionSection.table?.slice(1).map((e, i) => (
                  <li key={i} className="flex justify-between text-mainGray py-3.5 px-5 lg:px-8 rounded-t-3xl border-b border-mainGray/50">
                    <div className="">{e.name}</div>
                    <div>{e.value}</div>
                  </li>
                ))
              }
            </ul>
          </div>
        </section>

        <section className="pb-20">
          <div className="mt-5 lg:pt-20 w-full">
            <h1 className="text-[28px] lg:text-[40px] text-main-200 text-center">
              <span className="text-mainGray">{content.fundAllocationSection.title[0]} </span>{content.fundAllocationSection.title[1]}
            </h1>
          </div>

          <div className="mx-7 lg:mx-0 flex flex-col lg:flex-row-reverse justify-center items-center gap-x-7 xl:gap-x-20 mt-10 lg:mt-20 gap-y-14 lg:gap-y-0">
            <img
              src="./other/chart4.png"
              className="md:w-[516px] 2xl:w-[544] lg:max-h-max object-cover object-center"
              alt=""
            />
            <ul className="w-[300px] md:w-[384px] text-[14px] lg:text-[16px] px-5 lg:px-0">
              <li className="bg-[#049389] flex justify-between text-white py-3.5 px-5 lg:px-8 rounded-t-3xl">
                <div className="">{content.fundAllocationSection.table[0]?.name}</div>
                <div>{content.fundAllocationSection.table[0]?.value}</div>
              </li>
              {
                content.fundAllocationSection.table?.slice(1).map((e, i) => (
                  <li key={i} className="flex justify-between text-mainGray py-3.5 px-5 lg:px-8 rounded-t-3xl border-b border-mainGray/50">
                    <div className="">{e.name}</div>
                    <div>{e.value}</div>
                  </li>
                ))
              }
            </ul>
          </div>
        </section>

        <section ref={roadmapSection} className="relative bg-[#fafafa] pt-12 lg:pt-20 pb-10">
          <img
            src="./other/leaf7.png"
            className="hidden lg:block h-20 lg:max-h-max absolute right-7 lg:right-11 -top-5 lg:-top-24"
            alt=""
          />
          <img
            src="./other/leaf6.png"
            className="hidden lg:block h-20 lg:max-h-max absolute right-0 -top-5 lg:-top-24"
            alt=""
          />
          <img
            src="./other/leaf15.png"
            className="absolute h-[70px] lg:h-[171.83px] max-w-full -top-3 lg:top-0 left-0"
            alt=""
          />
          <img
            src="./other/leaf16.png"
            className="absolute h-[50px] lg:h-[131.1px] left-0 -top-5 max-w-full"
            alt=""
          />

          <h1 className="text-[28px] lg:text-[40px] text-main-200 text-start lg:text-center px-6">
            {content.roadmapSection.title}
          </h1>

          {/* mobile */}
          <div className="lg:hidden text-mainGray">
            <p className="text-[11px] lg:text-[16px] font-manrope text-black px-6">
              {content.roadmapSection.paragraph}
            </p>

            <h3 className="text-end my-5 px-6 font-manrope uppercase font-bold text-black">{activeRoadmapData?.title}</h3>

            <div className="flex flex-col">
              <div ref={scrollContainerRef} className="scroll-container border-b flex justify-between text-[14px] text-mainGray/50 overflow-x-scroll gap-x-10 pb-1">
                {content.roadmapSection.data?.map((e, i) => {
                  let q1Count = 0;
                  if (e.year === "2024") {
                    ++q1Count;
                  }
                  return (
                    <div
                      key={i}
                      ref={(el) => (divRefs.current[i] = el)} // Assign ref to each div
                      onClick={() => {
                        if (e.title) {
                          setActiveRoadmap(e.title);
                        }
                      }}
                      className={`min-w-24 text-center ${activeRoadmap === e.title ? "border-b-4 border-main-100 text-main-100" : ""}`}
                    >
                      {e.year} {q1Count > 0 && e.year === "2024" ? <span>Q{q1Count}</span> : null}
                    </div>
                  );
                })}
              </div>
              <div className="px-6">
                <ul className="text-[11px] list-disc my-7 space-y-7 mx-4 font-manrope">
                  {
                    activeRoadmapData?.details?.map((e, i) => (
                      <li key={i}>
                        {e}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>

          {/* desktop */}
          <div className="hidden lg:flex justify-center items-center gap-x-20 mt-16 px-6">
            <div className="text-[#BBBBBB] font-manrope text-[16px] xl:text-[18px] uppercase space-y-4 w-[30rem]">
              {
                content.roadmapSection.data?.map((e, i) => (
                  <div
                    onClick={() => {
                      if (e.title) {
                        setActiveRoadmap(e.title)
                        setSelectedRoadmapIndex(i)
                      }
                    }}
                    key={i}
                    className="flex flex-col items-end leading-tight cursor-pointer hover:scale- 105 ease-linear duration-150"
                  >
                    <div className={`font-manrope-bold ${activeRoadmap === e.title ? "text-main-100" : ""}`}>{e.year}</div>
                    <div className={`${activeRoadmap === e.title ? "font-bold text- [30px] text-black" : ""}`}>{e.title}</div>
                  </div>
                ))
              }
            </div>

            <div className="font-manrope w-[38rem] space-y-5">
              <h3 className="text-main-100 text-[48px] font-bold -mb-5">
                <span className="text-black">{activeRoadmapData?.year?.substring(0, 2)}</span>
                {activeRoadmapData?.year?.substring(2)}
              </h3>
              <div className="flex items-center gap-x-3">
                {
                  selectedRoadmapIndex < currentActiveIndex ? (
                    <img src="./other/check.png" className="size-[27.5px]" alt="" />
                  ) : (
                    <div className='text-white bg-main-100 p-1 rounded-full text-xl'><ImSpinner8 className='animate-spin' /></div>
                  )
                }
                {/* <img src="./other/check.png" className="size-[40px]" alt="" /> */}
                {/* <div className='text-white bg-main-100 p-2 rounded-full text-2xl'><ImSpinner8 className='animate-spin' /></div> */}
                <h4 className="text-[24px] font-bold text-mainGray">
                  {activeRoadmap}
                </h4>
              </div>
              <ul className="text-[16px] text-black list-disc ml-7 space-y-5">
                {
                  activeRoadmapData?.details?.map((e, i) => (
                    <li key={i}>
                      {e}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex gap-x-2 mx-36 my-6">
              <img src="./other/leaf17.png" alt="" />
              <img src="./other/leaf18.png" alt="" />
            </div>
            <p className="font-manrope text-[18px] mx-52">
              {content.roadmapSection.endParagraph}
            </p>
          </div>
        </section>

        <section ref={teamSection} className="my-7 lg:my-16 mx-5 lg:mx-0">
          <h1 className="text-[28px] lg:text-[40px] text-main-200 text-center">
            <span className="text-mainGray">{content.ourTeamSection.title[0]} </span>{content.ourTeamSection.title[1]}
          </h1>
          <p className="text-[12px] lg:text-[16px] font-manrope text-black text-center md:mx-36 xl:mx-96">
            {content.ourTeamSection.paragraph}
          </p>

          <div className="grid place-items-center grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7 lg:mx-36 2xl:mx-56 my-7 lg:my-16 md:mt-10">
            {
              content.ourTeamSection.members?.map((e, i) => (
                <Link className="hover:scale-105 ease-linear duration-150" href={"#"} target="_blank" key={i}>
                  <img
                    src={e.img}
                    className="h-[135px] lg:h-[225px] max-w-full object-cover object-center rounded-b-[250px] rounded-tl-[250px]"
                    alt=""
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[14px] lg:text-[16px] text-main-100 font-manrope mt-3">
                        {e.name}
                      </div>
                      <div className="text-[12px] lg:text-[14px] text-mainGray font-manrope uppercase">
                        {e.role}
                      </div>
                    </div>
                    <div>
                      {/* <FaLinkedin className="text-2xl text-[#0062C7]" /> */}
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </section>

        <section className="relative mt-7 lg:mt-20 lg:mb-32">
          <img
            src="./other/leaf8.png"
            className="h-24 lg:h-32 lg:max-h-max absolute lg:top-7"
            alt=""
          />
          <img
            src="./other/leaf9.png"
            className="w-24 lg:w-32 lg:max-w-max absolute"
            alt=""
          />
          <div className="">
            <h1 className="text-[28px] lg:text-[40px] text-main-200 text-center pt-16 lg:pt-0">
              <span className="text-mainGray">{content.ourPartnersSection.title[0]} </span>{content.ourPartnersSection.title[1]}
            </h1>
            <p className="text-[12px] lg:text-[20px] font-manrope text-black text-center mx-7 lg:px-36 xl:px-60 2xl:mx-0">
              {content.ourPartnersSection.paragraph}
            </p>
          </div>

          {/* change (xl:grid-cols-4) if want 4 col */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 place-items-center gap-x-0 gap-y-4 lg:gap-y-14 mx-7 lg:mx-20 2xl:mx-48 my-16">
            {
              content.ourPartnersSection.partners?.map((e, i) => (
                <Link key={i} href={e.url} target="_blank" >
                  <div className="w-[125px] h-[70px] lg:w-[252px] lg:h-[141px] flex justify-center items-center rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[68px] lg:rounded-br-[68px] overflow-hidden border border-[#BBBBBB] hover:scale-105 ease-linear duration-150">
                    <img
                      src={e.img}
                      className="h-[55px] lg:h-[110px]"
                      alt={e.name}
                    />
                  </div>
                </Link>
              ))
            }
          </div>
        </section>

        <section className="px-5 lg:px-0 lg:h-[588px] bg-mainGray w-full py-7 lg:py-16">
          <h1 className="text-[28px] lg:text-[40px] text-white text-center">
            {content.featuredOnSection.title}
          </h1>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-x-40 mt-10 gap-y-14 lg:gap-y-0 lg:mx-10 xl:mx-28">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-x-14 lg:gap-x-28 gap-y-14">
              {
                content.featuredOnSection.data?.map((e, i) => (
                  <img
                    key={i}
                    src={e.logo}
                    className={`cursor-pointer ${activeFeaturedOn === e.title ? "" : "opacity-70"} h-[34.81px] w-[120px] lg:h-[48.53px] lg:w-[168px] object-contain object-center hover:scale-110 ease-linear duration-150`}
                    alt={e.title}
                    onClick={() => setActiveFeaturedOn(e.title)}
                  />
                ))
              }
            </div>
            <div className="py-9 lg:py-14 md:w-[607px] lg:h-[332px] bg-white rounded-tl-[70px] rounded-br-[70px] lg:rounded-tl-[140px] lg:rounded-br-[140px] flex flex-col items-center text-start justify-center px-4 lg:pl-14 gap-y-3">
              <h2 className="text-[16px] lg:text-[20px] lg:mr-32 font-semibold leading-tight">
                {activeFeaturedOnData?.details?.title}
              </h2>
              <p className="text-[12px] lg:text-[16px] mr-0 lg:mr-14">
                {activeFeaturedOnData?.details?.description}
              </p>
              <div className="w-full">
                <Link href={activeFeaturedOnData?.details?.url ? activeFeaturedOnData?.details?.url : ""} target="_blank" className="font-manrope font-semibold text-main-200 text-[14px] border border-main-200 py-2.5 px-5 relative rounded hover:scale-110 ease-linear duration-150 uppercase">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="bg-[#FAFAFA] py-7 lg:py-20">
          <h1 className="text-[28px] lg:text-[40px] text-main-100 text-center">
            {content.pressReleaseSection.title}
          </h1>
          <div className="grid xl:hidden place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7 gap-y-6">
            {
              data?.slice(0, 3).map((e, i) => (
                <div
                  key={i}
                  className="h-[280px] w-[289px] mx-0 rounded-tl-[80px] rounded-br-[80px] border border-black flex flex-col gap-y-2 py-10 px-5"
                  style={{ boxShadow: "0px 0px 6px 6px rgb(229 229 229)" }}
                >
                  <div className="flex items-center gap-x-2">
                    <img src="./other/logo2.png" className="h-8 w-8 " alt="" />
                    <img src="./other/logo-name2.png" className="h-3 max-w-max" alt="" />
                  </div>
                  <span className="text-[10px]">{e.date}</span>
                  <div className="text-main-200 text-[10px] font-manrope">
                    {e.paragraph1}
                  </div>
                  <div className="text-[9px] font-manrope">
                    {e.paragraph2}
                  </div>
                  <Link href={`/press-releases/${e.id}`} className="text-[14px] text-main-100 underline">
                    Know More
                  </Link>
                </div>
              ))}
          </div>

          <div className="hidden xl:flex justify-center items-center gap-x-4 my-10">
            <div
              className="h-[578px] w-[614px] border-black border rounded-br-[194px] rounded-tl-[194px] px-20 py-16 space-y-5"
              style={{ boxShadow: "0px 0px 6px 6px rgb(229 229 229)" }}
            >
              <div className="flex items-center gap-x-5 mb-10">
                <img src="./other/logo2.png" className="h-[50px] w-[50px]" alt="" />
                <img
                  src="./other/logo-name2.png"
                  className="h-[22px] max-w-max"
                  alt=""
                />
              </div>
              <span className="text-[14px]">{data[0]?.date}</span>
              <p className="text-main-100 text-[20px] font-manrope font-bold">
                {data[0]?.paragraph1}
              </p>
              <p className="text-[#9E9E9E] text-[16px] font-manrope">
                {data[0]?.paragraph2}
              </p>
              <div>
                <Link href={`/press-releases/${data[0]?.id}`} className="text-main-100 underline text-[16px]">
                  Know More
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div
                style={{ boxShadow: "0px 0px 6px 6px rgb(229 229 229)" }}
                className="overflow-hidden h-[283px] w-[482px] border border-black rounded-tr-[120px] rounded-bl-[120px] px-14 space-y-2 py-5"
              >
                <div className="text-center text-[14px]">
                  {data[1]?.date}
                </div>
                <p className="text-main-100 text-[20px] font-manrope font-bold">
                  {data[1]?.paragraph1}
                </p>
                <p className="text-[#9E9E9E] text-[16px] font-manrope">
                  {data[1]?.paragraph2}
                </p>
                <div>
                  <Link href={`/press-releases/${data[1]?.id}`} className="text-main-100 underline text-[16px]">
                    Know More
                  </Link>
                </div>
              </div>
              <div
                style={{ boxShadow: "0px 0px 6px 6px rgb(229 229 229)" }}
                className="overflow-hidden h-[283px] w-[482px] border border-black rounded-tl-[120px] rounded-br-[120px] px-14 space-y-2 py-5"
              >
                <div className="text-center text-[14px]">
                  {data[2]?.date}
                </div>
                <p className="text-main-100 text-[20px] font-manrope font-bold">
                  {data[2]?.paragraph1}
                </p>
                <p className="text-[#9E9E9E] text-[16px] font-manrope">
                  {data[2]?.paragraph2}
                </p>
                <div>
                  <Link href={`/press-releases/${data[2]?.id}`} className="text-main-100 underline text-[16px]">
                    Know More
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-7 lg:mt-16">
            <Link href="/press-releases" className="font-manrope text-main-200 text-[14px] lg:text-[14px] border border-main-200 p-2.5 relative rounded hover:scale-110 ease-linear duration-150 uppercase px-10">
              See All News
            </Link>
          </div>
        </section>  */}

        {/* blog */}
        {/* <section className="pt-7 lg:pt-10 font-manrope">
        <h1 className="text-[28px] lg:text-[40px] text-main-100 text-center">
          Blogs
        </h1>

        <div className="grid mt-10 place-items-center grid-cols-1 lg:grid-cols-3 lg:mx-14 2xl:mx-44 gap-y-7 lg:gap-y-0">
          <div className="rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] h-[26.625rem] lg:h-[28.625rem] w-[17.962rem] lg:w-[21.962rem] border border-[#BBBBBB] font-manrope">
            <img
              src="./other/BLOG1.jpeg"
              className="w-[21.962rem] h-[12.625rem] lg:h-[16.071rem] rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] object-cover object-center"
              alt=""
            />
            <div className="m-5 space-y-2 lg:space-y-3">
              <h3 className="text-[20px] text-main-200 font-semibold">
                Staggering Growth
              </h3>
              <p className="text-[14px]">
                As virtual reality redefines entertainment, seize the
                opportunity for substantial appreciation, propelling your
                investment to new heights.
              </p>
              <div className="pt-3">
                <Link
                  href={"/"}
                  className="text-[16px] underline text-main-100 font-bold"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] h-[26.625rem] lg:h-[28.625rem] w-[17.962rem] lg:w-[21.962rem] border border-[#BBBBBB] font-manrope">
            <img
              src="./other/BLOG1.jpeg"
              className="w-[21.962rem] h-[12.625rem] lg:h-[16.071rem] rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] object-cover object-center"
              alt=""
            />
            <div className="m-5 space-y-2 lg:space-y-3">
              <h3 className="text-[20px] text-main-200 font-semibold">
                Staggering Growth
              </h3>
              <p className="text-[14px]">
                As virtual reality redefines entertainment, seize the
                opportunity for substantial appreciation, propelling your
                investment to new heights.
              </p>
              <div className="pt-3">
                <Link
                  href={"/"}
                  className="text-[16px] underline text-main-100 font-bold"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] h-[26.625rem] lg:h-[28.625rem] w-[17.962rem] lg:w-[21.962rem] border border-[#BBBBBB] font-manrope">
            <img
              src="./other/BLOG1.jpeg"
              className="w-[21.962rem] h-[12.625rem] lg:h-[16.071rem] rounded-tl-[40px] rounded-br-[40px] lg:rounded-tl-[6.25rem] lg:rounded-br-[6.25rem] object-cover object-center"
              alt=""
            />
            <div className="m-5 space-y-2 lg:space-y-3">
              <h3 className="text-[20px] text-main-200 font-semibold">
                Staggering Growth
              </h3>
              <p className="text-[14px]">
                As virtual reality redefines entertainment, seize the
                opportunity for substantial appreciation, propelling your
                investment to new heights.
              </p>
              <div className="pt-3">
                <Link
                  href={"/"}
                  className="text-[16px] underline text-main-100 font-bold"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-7 lg:mt-16">
          <button className="font-manrope font-semibold text-main-200 text-[14px] border border-main-200 p-2.5 relative rounded hover:scale-110 ease-linear duration-150 uppercase px-20">
            View All
          </button>
        </div>
      </section> */}

        <section ref={whitepaperSection} className="bg-[#FFFBFF] py-10 lg:px-40 relative">
          <img
            src="./other/leaf11.png"
            className="absolute h-24 lg:h-[153.81px] -top-8 lg:-top-20 -right-0 lg:right-0"
            alt=""
          />
          <h1 className="text-[28px] lg:text-[40px] text-main-100 text-center lg:hidden">
            {content.whitepaperSection.title}
          </h1>
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <img
              className="size-[306px] lg:size-[400px]"
              src="./other/gif8.gif"
              alt=""
            />
            <div className="mx-7 lg:mx-12">
              <h1 className="hidden lg:block text-[28px] lg:text-[40px] text-main-100 text-start">
                {content.whitepaperSection.title}
              </h1>
              <p className="font-manrope text-[14px] lg:text-[16px]">
                {content.whitepaperSection.paragraph}
              </p>
              <div className="flex gap-x-5 justify-center lg:justify-start">
                <Link href="./Whitepaper-RVMToken.pdf" target="_blank" className="font-manrope font-medium text-white bg-main-200 text-[14px] border border-main-200 p-2.5 relative rounded hover:scale-110 ease-linear duration-150 uppercase w-[152px] lg:w-[192px] mt-5 lg:mt-10 flex justify-center">
                  View Whitepaper
                </Link>
                <Link href="./Whitepaper-RVMToken.pdf" target="_blank" className="font-manrope font-medium text-white bg-mainGray text-[14px] border border-mainbg-mainGray p-2.5 relative rounded hover:scale-110 ease-linear duration-150 uppercase w-[152px] lg:w-[192px] mt-5 lg:mt-10 flex justify-center">
                  One Pager
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-7 lg:px-20 xl:px-0 bg-[#fafafa] min-h-[600px] py-16 ">
          <h1 className="text-[28px] leading-tight lg:text-[40px] text-main-200 text-center">
            <span className="text-mainGray">{content.faqSection.title[0]} </span>{content.faqSection.title[1]}
          </h1>
          <p className="font-manrope text-[12px] lg:text-[20px] text-center my-6 lg:my-2">
            {content.faqSection.paragraph}
          </p>
          <div className="space-y-5 mt-14">
            {
              content.faqSection.items?.map((e, i) => (
                <Accordion key={i} title={e.question}>
                  {e.answer}
                </Accordion>
              ))
            }
          </div>
        </section>

        {/* mobile subscribe section  */}
        <section className="md:hidden bg-[#fafafa] pt-5 mb-20">
          <div className="bg-main-100 flex flex-col justify-center items-center py-7 rounded-xl mx-5 px-5 gap-y-5">
            <h3 className="font-barlow text-[24px] text-white text-center leading-tight">The latest news, events and stories delivered right to your inbox</h3>
            <img src="./other/gif9.gif" className="w-[15.125rem] max-h-max" alt="" />
            <form onSubmit={subscribeEmailFormHandler} className="space-y-5 flex flex-col item-center">
              <input value={subscribeEmailInput} onChange={(e) => setSubscribeEmailInput(e.target.value)} type="email" className="outline-none h-10 w-[15.5rem] px-4 font-manrope text-mainGray rounded placeholder:text-mainGray/70" placeholder="Type your email here" />
              <button
                type="submit"
                className="font-manrope text-white bg-mainGray text-[14px] p-2.5 px-12 relative rounded uppercase flex justify-center w-32 mx-auto"
              >Subscribe</button>
            </form>
          </div>
        </section>

        {/* desktop subscribe section  */}
        <section className="hidden md:flex bg-[#fafafa] justify-center items-center pb-24 pt-10 relative" >
          <div
            className=" md:w-[45.375rem] lg:w-[60.375rem] xl:w-[70.375rem] h-[15.063rem] bg-main-100 rounded-xl pl-10 lg:pr-10 xl:pr-24 flex justify-between relative"
          >
            <img className="hidden lg:block absolute max-h-max w-20 right-10" src="./other/leaf19.png" alt="" />
            <img className="hidden lg:block absolute max-h-max w-10 right-7 bottom-10 opacity-70" src="./other/leaf20.png" alt="" />
            <img className="hidden lg:block absolute max-h-max w-10 right-[26rem] bottom-24 opacity-70" src="./other/leaf20.png" alt="" />
            <img className="hidden lg:block absolute max-h-max w-10 right-[22rem] xl:right-[27rem] top-10 opacity-70" src="./other/leaf21.png" alt="" />
            <img className="hidden lg:block absolute max-h-max w-10 right-[28rem] bottom-7" src="./other/leaf20.png" alt="" />
            <div className="space-y-5 flex flex-col justify-center">
              <h3 className="text-[28px] lg:text-[32px]  text-white font-barlow font-medium leading-tight">The latest news, events and stories <br className="hidden lg:block" /> delivered right to your inbox</h3>
              <form
                className="flex bg-white w-fit items-center justify-between p-1 rounded relative z-50"
                onSubmit={subscribeEmailFormHandler}
              >
                <input value={subscribeEmailInput} onChange={(e) => setSubscribeEmailInput(e.target.value)} type="email" className="outline-none h-10 w-[14rem] lg:w-[19rem] px-4 font-manrope text-mainGray placeholder:text-mainGray/70" placeholder="Type your email here" />
                <button
                  type="submit"
                  className="font-manrope text-white bg-mainGray text-[14px] p-2.5 px-12 relative rounded uppercase flex justify-center "
                >
                  Subscribe
                </button>
              </form>
            </div>
            <img src="./other/gif9.gif" className="w-[18rem] max-h-max object-cover rounded-r-xl" alt="" />
          </div>
        </section>

        <section className="pt-7 lg:pt-0 lg:h-full w-full bg-main-100 px-7 lg:px-10 xl:px-40">
          <h1 className="text-[33px] lg:text-[50px] text-white text-center lg:text-start pt-0 lg:pt-10 lg:py-0 relative">
            {content.contactUsSection.title}
          </h1>
          <h3 className="text-white text-center lg:text-start text-[14px] lg:text-[20px] relative -bottom-2 font-manrope">
            {content.contactUsSection.subTitle}
          </h3>
          <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
            <div className="space-y-10 my-10 lg:my-0">
              <div className="space-y-2 text-white">
                <div className="flex items-center gap-x-3">
                  <div className="size-[32px] bg-white rounded-full flex justify-center items-center">
                    <CiMail className="text-black text-2xl" />
                  </div>
                  <Link target="_blank" href={`mailto:${content.contactUsSection.links.email}`} className="text-[16px] underline">
                    {content.contactUsSection.links.email}
                  </Link>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="size-[32px] bg-white rounded-full flex justify-center items-center">
                    <RxInstagramLogo className="text-black text-2xl" />
                  </div>
                  <Link target="_blank" href={content.contactUsSection.links.instagram} className="text-[16px]">
                    Instagram
                  </Link>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="size-[32px] bg-white rounded-full flex justify-center items-center">
                    <CiTwitter className="text-black text-2xl" />
                  </div>
                  <Link target="_blank" href={content.contactUsSection.links.twitter} className="text-[16px]">
                    Twitter
                  </Link>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="size-[32px] bg-white rounded-full flex justify-center items-center">
                    <PiYoutubeLogo className="text-black text-2xl" />
                  </div>
                  <Link target="_blank" href={content.contactUsSection.links.youTube} className="text-[16px]">
                    YouTube
                  </Link>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="size-[32px] bg-white rounded-full flex justify-center items-center">
                    <PiTelegramLogo className="text-black text-2xl" />
                  </div>
                  <Link target="_blank" href={content.contactUsSection.links.telegram} className="text-[16px]">
                    Telegram
                  </Link>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmitContactForm} className="w-[95%] mx-auto lg:mx-0 h-[292px] md:w-[504px] bg-white rounded-tl-[100px] rounded-br-[100px] lg:rounded-tl-[128px] lg:rounded-br-[128px] relative mt-10 lg:mt-0 lg:bottom-10">
              <img
                src="./other/leaf12.png"
                className="max-w-max h-[104.81px] absolute -right-8 -top-6"
                alt=""
              />
              <div className="flex flex-col mt-14 mx-10 lg:mx-16">
                <input
                  type="text"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactFormChange}
                  className="outline-none border-b-mainGray border-b py-2 mb-1.5 text-[12px] focus:border-b-main-100 focus:border-b-2"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactFormChange}
                  className="outline-none border-b-mainGray border-b py-2 mb-1.5 text-[12px] focus:border-b-main-100 focus:border-b-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="telegram"
                  value={contactFormData.telegram}
                  onChange={handleContactFormChange}
                  className="outline-none border-b-mainGray border-b py-2 mb-1.5 text-[12px] focus:border-b-main-100 focus:border-b-2"
                  placeholder="Telegram"
                />
                <input
                  type="text"
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactFormChange}
                  className="outline-none border-b-mainGray border-b py-2 mb-1.5 text-[12px] focus:border-b-main-100 focus:border-b-2"
                  placeholder="Message"
                />
              </div>
              <button className="font-manrope font-semibold text-white bg-mainGray text-[14px] border p-2.5 px-5 lg:px-10 relative rounded hover:scale-110 ease-linear duration-150 uppercase ml-10 lg:ml-16 mt-2">
                Send Message
              </button>
            </form>
          </div>
        </section>

      </main>

      <footer className="h-[480px] py-10 lg:py-0 lg:h-[506px] bg-mainGray text-white flex justify-between items-center flex-col lg:flex-row px-7 lg:px-24 relative">
        <div className="lg:w-[556px] space-y-7">
          <div className="flex items-center gap-x-5">
            <img
              src="./other/logo.png"
              className="h-10 w-10 lg:h-16 lg:w-16"
              alt=""
            />
            <img
              src="./other/logo-name.png"
              className="h-4 lg:h-7 max-w-max"
              alt=""
            />
          </div>
          <p className="font-manrope text-[12px] lg:text-[14px]">
            {content.footerSection.paragraph}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row mt-10 space-y-5 lg:space-y-0 lg:space-x-10">
          <Link href="./sample-pdf.pdf" target="_blank" className="font-manrope text-white text-[14px] lg:text-[16px] border border-white p-3 relative rounded hover:scale-110 ease-linear duration-150 uppercase px-10 text-center">
            Terms & Conditions
          </Link>
          <Link href="./sample-pdf.pdf" target="_blank" className="font-manrope text-white text-[14px] lg:text-[16px] border border-white p-3 relative rounded hover:scale-110 ease-linear duration-150 uppercase px-10 text-center">
            Privacy Policy
          </Link>
        </div>
        <span className="relative my-4 lg:my-0 lg:absolute lg:bottom-5 font-manrope text-[14px] text-[#FFFAFA] opacity-80 mb-3">
          {content.footerSection.rights}
        </span>
      </footer>
      {loading && <Loading />}
    </>
  );
}
