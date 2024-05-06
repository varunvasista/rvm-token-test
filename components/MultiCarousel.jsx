"use client"

import React from 'react'
import Carousel from 'react-multi-carousel'

const MultiCarousel = ({ children, desktopItems = 4, className, showDots }) => {
    // Carousel responsive properties
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: desktopItems,
        },
        tablet: {
            breakpoint: { max: 1023, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 767, min: 0 },
            items: 1,
        }
    };

    const CustomDot = ({ onClick, active }) => {
        return (
            <li
                className='relative md:right-[68px]'
                style={{
                    background: active ? '#00A99D' : '#E0E0E0',
                    padding: 0,
                    borderRadius: '50%',
                    display: 'inline-block',
                    margin: '0 4px',
                    cursor: 'pointer',
                    height: "13px",
                    width: "13px",
                }} onClick={() => onClick()}>
            </li>
        );
    };

    return (
        <Carousel
            customDot={<CustomDot />}
            showDots={showDots}
            responsive={responsive}
            className={className}
            children={{ width: "250px" }}
            itemClass='w-50'
            arrows={false}
        >
            {children}
        </Carousel>
    )
}

export default MultiCarousel