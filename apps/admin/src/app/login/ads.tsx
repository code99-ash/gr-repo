import React from 'react'

export default function Ads() {
  return (
    <div className="w-0 overflow-hidden md:w-[45%] bg-[#0A5231] h-full relative">
        <img 
            src="/images/bent-arrow.svg" 
            alt=""
            className='absolute top-0 right-2'
        />
        <img 
            src="/images/bent-arrow-bottom.svg" 
            alt=""
            className='absolute bottom-0 left-2'
        />
    </div>
  )
}
