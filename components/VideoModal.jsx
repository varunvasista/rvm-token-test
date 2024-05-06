"use client";

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function VideoModal({ showModal, setShowModal, videoId, title }) {

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [showModal]);

    return (
        showModal && (
            <motion.div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999999] text-black"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ margin: 0, padding: 0 }}
            >
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-lg"
                    variants={modalVariants}
                >
                    <h2 className="font-bold text-lg mb-4">{title}</h2>
                    <div>
                    <YouTubeVideo videoId={videoId} />
                    </div>
                    <button
                        className="mt-4 px-4 py-2 bg-main-100 text-white rounded hover:bg-main-100/80 transition"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        )
    );
}

function YouTubeVideo({ videoId }) {
    return (
        <iframe
            className=' md:h-[315px] md:w-[560px]'
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    );
};
