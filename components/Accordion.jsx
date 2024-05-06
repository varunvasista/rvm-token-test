"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="max-w-[1161px] mx-auto">
            <button
                className="border-main-200 rounded-[4px] border-l-4 md:border-l-8 w-full py-4 px-6 text-left text-black bg-white focus:outline-none font-semibold flex justify-between text-[12px] md:text-[18px]"
                onClick={toggleOpen}
            >
                <div>
                    {title}
                </div>
                <div>
                    {!isOpen ? <FaPlus /> : <FaMinus />}
                </div>
            </button>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
            >
                <div className="text-[12px] md:text-[18px] p-6 bg-[#c8eae7] text-black rounded-b-[20px] px-10 font-manrope">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default Accordion;
