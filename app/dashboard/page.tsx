'use client';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Use 'lite' version
import { AiOutlineMessage } from 'react-icons/ai';
import {db}  from '../firebaseConfig.js';
import styles from './Dashboard.module.css';
import ChatBox from '@/app/dashboard/Chat'
import {MdOutlineTrackChanges} from 'react-icons/md'
import Link from 'next/link.js';
import { auth } from '@/app/authentication/firebase'




const priorityMapping = {
  'low': '3',
  'medium': '2',
  'high': '1',
};


const Dashboard = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('low');
    const [team, setTeam] = useState('1');
    const [description, setDescription] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    
  const user = auth.currentUser;

    async function addData(name: string, email: string, subject: string, description: string, priority: string, team: string) {
      try {
        const docRef = await addDoc(collection(db, 'Form'), {
          name: name,
          email: email,
          subject: subject,
          description: description,
          priority: priority,
          team: team,
          time: new Date().toLocaleString(),
          status: 'New',
          userId : user?.uid
        }
        );
  
      } catch {
        console.error('Error');
      }
    }


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await addData(name, email, subject, description, priority, team);
        setName('');
        setEmail('');
        setSubject('');
        setPriority('low');
        setTeam('1');
        setDescription('');
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardRightColumn}>
        <div className={styles.rightColumnAppBar}>
          <h1>Raise Ticket</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.rightColumnContent}>
        <div className={styles.formField}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border rounded-lg px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
          </div>
          <div className={styles.formField}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value= "priority"
              onChange={(e) => setPriority(priorityMapping[e.target.value])}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label htmlFor="team">Team</label>
            <select
              id="team"
              name="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="1">Team 1</option>
              <option value="2">Team 2</option>
              <option value="3">Team 3</option>
              {/* Add more teams as needed */}
            </select>
          </div>
          <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full border rounded-lg px-4 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5} // Adjust the number of rows as needed
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Submit Ticket
        </button>
        </form>
        <button
          className={`${styles.sideButton} ${styles.floatChat}`}
          onClick={() => setIsChatOpen(true)}
        >
          <AiOutlineMessage />
        </button>
        <Link href='./Track'
          className={`${styles.sideButton} ${styles.floatTrack}`}
        >
          <MdOutlineTrackChanges />
        </Link>
        {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
      </div>
    

    </div>
  );
};

export default Dashboard;
