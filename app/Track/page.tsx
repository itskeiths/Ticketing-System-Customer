"use client";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot,where } from 'firebase/firestore';
import { auth, db } from '@/app/authentication/firebase';
import { useRouter } from 'next/navigation';
import { BiMessageAlt } from 'react-icons/bi';
import ChatBox from '../dashboard/Chat';

export default function Orders () {
  const [sortByPriority, setSortByPriority] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<string>(" ");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const [track, setTrack] = useState<{ id: string; status: string; team: string, description: string,Issue:string }[]>([]);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log("User Id", userId);

        const q = query(collection(db, "Form"), where("userId", "==", userId));

        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          setTrack(
            querySnapshot.docs.map((doc) => ({ id: doc.id, status: doc.data().status, team: doc.data().team, description: doc.data().description,Issue:doc.data().Issue }))
          );
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribeAuth();

  }, []);

  return (
    <div className='bg-gray-100 min-h-screen flex justify-center items-center'>
      <div className='w-full max-w-3xl h-fit p-4 border rounded-lg bg-white overflow-y-auto'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Ticket Status</h1>

        {track.map((order) => (
          <div key={order.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h2 className='text-lg font-semibold mb-2'>Ticket ID: {order.id}</h2>
            <p className='text-gray-600 mb-2'>
              <span className='font-semibold'>Order Status:</span> {order.status}
            </p>
             <p className='text-gray-600 mb-2'>
              <span className='font-semibold'>Submitted Time :</span> {order.time}
            </p>
             <p className='text-gray-600 mb-2'>
              <span className='font-semibold'>Processed Time:</span> {order?.ProcessTime}
            </p>
            <p className='text-gray-600 mb-2'>
              <span className='font-semibold'>Issue:</span> {order.Issue}
            </p>
            <p className='text-gray-600 mb-2'>
              <span className='font-semibold'>Description:</span> {order.description}
            </p>
  
          </div>
        ))}

      </div>
    </div>
  );
};


