"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const path=usePathname();
    useEffect(()=>{
        // console.log(path);
    },[])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <a href='/'>
      <Image src={'/logo.png'} width={160} height={100} alt='logo'/>
      </a>
      
      <ul className='hidden md:flex gap-6'>
        <a href='/'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer`}>Home</li>
        </a>
      <a href='/dashboard'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer`}>Dashboard</li>
        </a>
        <a href='/#working'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer`}>How It Works?</li>
        </a>
          <a href='https://ai-studio-project.vercel.app/supportus'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer`}>Support Us</li>
        </a>
          <a href='https://ai-studio-project.vercel.app/'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer`}>AI Studio</li>
        </a>
      </ul>
      <div className="w-12 h-12 flex items-center justify-center"> {/* Adjust the size here */}
                <UserButton />
            </div>
    </div>
  )
}

export default Header
