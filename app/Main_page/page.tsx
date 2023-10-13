'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ChatBox from '../dashboard/Chat';
import { BiMessageAlt } from 'react-icons/bi';
import styles from './Main.module.css'

const Main = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
   const router = useRouter()
  function handleRaiseTicketClick() {
    router.push('/dashboard')
    console.log('Raise Ticket clicked');
  };

  function handleTrackTicketClick() {
    router.push('/Track')
    console.log('Track Ticket clicked');
  };

  return (
    <div>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Helphub</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="max-w-md bg-white rounded-xl overflow-hidden shadow-md p-4 cursor-pointer"
          onClick={handleRaiseTicketClick}
        >
          <div className="mb-4">
            <Image
              src="https://img.freepik.com/premium-vector/contact-us-customer-service-illustration_2175-309.jpg"
              alt="Customer"
              width={300}
              height={500}
            />
          </div>
          <div className="text-center">Raise Ticket</div>
        </div>

        <div
          className="max-w-md bg-white rounded-xl overflow-hidden shadow-md p-4 cursor-pointer"
         onClick={handleTrackTicketClick}
        >
          <div className="mb-4">
          <Image
        src="https://img.freepik.com/free-vector/hand-drawn-flat-design-omnichannel-illustration_23-2149360245.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696636800&semt=ais"
        alt="Omnichannel illustration"
        width={300}
        height={300}
      />
          </div>
          <div className="text-center">Track Ticket</div>
        </div>
      </div>
      <button
          className='fixed right-4 bottom-4 p-4 bg-white rounded-full shadow-md'
          onClick={() => setIsChatOpen(true)}
        >
          <BiMessageAlt size={50} color='blue' />
        </button>
    </div>
    <div>
    
    </div>
    
        {isChatOpen && <ChatBox  onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Main;
