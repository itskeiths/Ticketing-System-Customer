// Description.tsx

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import {db} from '../firebaseConfig';

interface DescriptionProps {
  order: {
    id: string;
    name: string;
    priority: string;
    subject: string;
    addedTime: string;
    status: string;
    description:string,
    issues: string;
  };
  onClose: () => void;
}

const Description: React.FC<DescriptionProps> = ({ order, onClose }) => {
      

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="max-w-lg bg-white p-6 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">{order.name}</h2>
        <p className="text-gray-600 mb-2">{`Subject: ${order.subject}`}</p>
        <p className="text-gray-800 mb-2">{`Description: ${order.description}`}</p>
      </div>
    </div>
  );
};

export default Description;
