'use client';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../firebaseConfig.js';
import styles from './Dashboard.module.css';
import { auth } from '@/app/authentication/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import { toast ,ToastContainer} from 'react-toastify'

let user = auth.currentUser;
let uid = user?.uid;
let email_id = user?.email;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    email_id = user.email;
  }
})

const Dashboard = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState(email_id);
  const [priority, setPriority] = useState('1');
  const [Issue, setIssue] = useState('1');
  const [description, setDescription] = useState('');

  async function addData(name: string, email: string, subject: string, description: string, priority: string, Issue: string) {
    try {
      const docRef = await addDoc(collection(db, 'Form'), {
        name: name,
        email: email_id,
        subject: subject,
        description: description,
        priority: priority,
        Issue: Issue,
        time: new Date().toLocaleString(),
        status: 'New',
        userId: user?.uid
      });

     

    } catch {
     
      console.error('Error');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addData(name, email_id ? email_id : "", subject, description, priority, Issue);
      toast.success("Sucessfully Submitted!")
      setName('');
      setEmail(email_id ? email_id : ' ')
      setSubject('');
      setPriority('');
      setIssue('');
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
              value={email_id?email_id:" "}
              onChange={(e) => setEmail(email_id?email_id:' ')}
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
              name="Issue"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value={3}>Low</option>
              <option value={2}>Medium</option>
              <option value={1}>High</option>

            </select>
          </div>
          <div className={styles.formField}>
            <label htmlFor="Issue">Issue</label>
            <select
              id="Issue"
              name="Issue"
              value={Issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            >
              <option value="1">Issue 1</option>
              <option value="2">Issue 2</option>
              <option value="3">Issue 3</option>
  
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
      </div>
    

    </div>
  );
};

export default Dashboard;
