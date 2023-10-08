'use client';
import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { BsSortDown } from 'react-icons/bs';
import {collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import Description from '@/app/Description/page';
import { useRouter } from 'next/navigation';
import {IoMdArrowRoundBack} from 'react-icons/io';

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, 'Form'));
  const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log('Fetched data:', data);
  return data;
}

const Orders = () => {
  const [sortByPriority, setSortByPriority] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      // Renaming the local variable to avoid naming conflict
      const dataFromFirestore = await fetchDataFromFirestore();
      setUserData(dataFromFirestore);
    }

    fetchData();
  }, []);

  
  

  const data = userData.map((user) => ({
    name: user.name,
    priority: user.priority,
    subject: user.subject,
    addedTime: user.time,
    status : user.status,
    issues : user.team,
    description:user.description,
    id: user.id
  }));

  const handleCloseTicket = async (orderId) => {
    try {
      const orderRef = doc(db, 'Form', orderId);
      await updateDoc(orderRef, {
        status: 'Closed',
        time : new Date().toLocaleString()
      });
  
      // Update the local state to reflect the change
      setUserData((prevUserData) =>
        prevUserData.map((user) =>
          user.id === orderId ? { ...user, status: 'Closed' } : user
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  const sortedData = [...data].sort((a, b) => {
    const priorityA = parseInt(a.priority, 10); // Convert to integer
    const priorityB = parseInt(b.priority, 10);
  
    return sortByPriority
      ? priorityB - priorityA // Descending order
      : priorityA - priorityB; // Ascending order
  });
  
  const toggleSort = () => {
    setSortByPriority((prev) => !prev);
  };

  const handleOpenDescription = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDescription = () => {
    setSelectedOrder(null);
  };



  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4'>
        <h2>View tickets</h2>
        <h2
          className='cursor-pointer'
          onClick={toggleSort}
        >
          <span className='float-left pt-1'><IoMdArrowRoundBack/></span>Back
        </h2>
      </div>
      <div className='p-4'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
          <div className='my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'>
            <span>TICKETS</span>
            <span className='sm:text-left text-right'>Status</span>
            <span className='hidden md:grid'>Time</span>
            <span className='hidden sm:grid'>Issue</span>
          </div>
          <ul>
            {sortedData.map((order, id) => (
              <li
                key={id}
                className='bg-gray-50 hover-bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'
              >
                <div className='flex'>
                  <div className='bg-purple-100 p-3 rounded-lg'>
                    <FaShoppingBag className='text-purple-800' />
                  </div>
                  <div className='pl-4'>
                    <p className='text-gray-800 font-bold'>
                      {order.name}
                    </p>
                  </div>
                </div>
                <p className='text-gray-600 sm:text-left text-right'>
                  <span
                    className={
                      order.status === 'Processing'
                        ? 'bg-green-200 p-2 rounded-lg'
                        : order.status === 'Closed'
                        ? 'bg-blue-200 p-2 rounded-lg'
                        : 'bg-yellow-200 p-2 rounded-lg'
                    }
                  >
                    {order.status}
                  </span>
                </p>
                <p className='hidden md:flex'>{order.addedTime}</p>
                <div className='sm:flex hidden justify-between items-center'>
                  <p>{order.issues}</p>
  
                  <button className='border-solid 1px' onClick={() => handleOpenDescription(order)}>
                   Open
                    </button>
                </div>
              </li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Orders;