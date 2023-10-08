'use client';
import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db,auth} from '@/app/authentication/firebase';

interface ChatBoxProps {
  onClose: () => void;
}

interface Message {
  message: string;
  timestamp: string;
  userId: string;
}

interface User {
  userId: string;
}



// ... (imports and interfaces remain the same)

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = auth.currentUser?.uid; // Updated to use auth.currentUser?.uid

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;

      if (user) {
        const userData: User = {
          userId: user.uid
        };
        setCurrentUser(userData);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser || !userId) return;
  
    const chatCollection = collection(db, 'chat');
    const adminChatCollection = collection(db, 'admin_chat');
  
    const unsubscribeChat = onSnapshot(chatCollection, (snapshot) => {
      console.log('Chat Collection Snapshot:', snapshot);
      setMessages((prevMessages) => [
        ...prevMessages,
        ...snapshot.docs
          .filter((doc) => doc.data().userId === userId)
          .map((doc) => ({ ...doc.data(), changeType: 'added' } as unknown as Message)),
      ]);
    });
  
    const unsubscribeAdminChat = onSnapshot(adminChatCollection, (snapshot) => {
      console.log('Admin Chat Collection Snapshot:', snapshot);
      setMessages((prevMessages) => [
        ...prevMessages,
        ...snapshot.docs
          .filter((doc) => doc.data().userId === userId)
          .map((doc) => ({ ...doc.data(), changeType: 'added' } as unknown as Message)),
      ]);
    });
  
    return () => {
      console.log('Unsubscribing from chat and admin_chat');
      unsubscribeChat();
      unsubscribeAdminChat();
    };
  }, [currentUser, userId]);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser) return;

    try {
      const chatCollection = collection(db, 'chat');
      await addDoc(chatCollection, {
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        userId: currentUser.userId,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };





  return (
    <div className="fixed bottom-0 right-0 bg-white border-l border-t border-gray-300 p-4 w-80 h-96 overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h2>Chat</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 text-white p-2 rounded-lg ${
              message.userId === currentUser?.userId ? 'bg-blue-500 ml-2 self-end' : 'bg-green-500 mr-2'
            }`}
          >
            {message.userId === currentUser?.userId ? (
              <>
                <strong>You:</strong> {message.message}
              </>
            ) : (
              <>
                {message.userId === 'admin' && <strong>Admin:</strong>} {message.message}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="border rounded p-2 w-3/4"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
