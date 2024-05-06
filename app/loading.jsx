import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-[9999999999]">
            <FaSpinner className="animate-spin text-4xl text-main-100" />
        </div>
    );
};

export default Loading;