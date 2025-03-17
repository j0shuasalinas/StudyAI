// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBfRGfe8pzXWtWngoh2-M_otdBN-f3i5kI',
  authDomain: 'planit-afc74.firebaseapp.com',
  projectId: 'planit-afc74',
  storageBucket: 'planit-afc74.firebasestorage.app',
  messagingSenderId: '924919525257',
  appId: '1:924919525257:web:927d2ceb6e3c62ab9ffb58',
  measurementId: 'G-3XQ3FM3K2C',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Export Firebase services for use in other files
export { auth, db };

// Add Assignment Function (for saving an assignment)
export const addAssignment = async (assignmentData) => {
  if (!auth.currentUser) {
    console.error('User is not logged in!');
    return;
  }

  const userId = auth.currentUser.uid;
  const assignmentsRef = collection(db, 'users', userId, 'assignments');

  // Convert DueDate to a Firebase Timestamp
  const { DueDate, ...otherData } = assignmentData;
  const dueDateTimestamp = Timestamp.fromDate(new Date(DueDate)); // Convert to Firebase Timestamp

  try {
    await addDoc(assignmentsRef, { ...otherData, DueDate: dueDateTimestamp });
    console.log('Assignment added successfully!');
  } catch (error) {
    console.error('Error adding assignment:', error);
  }
};

// Get Assignments Function (for fetching all assignments)
export const getAssignments = async () => {
  if (!auth.currentUser) {
    console.error('User is not logged in!');
    return;
  }

  const userId = auth.currentUser.uid;
  const assignmentsRef = collection(db, 'users', userId, 'assignments');

  try {
    const querySnapshot = await getDocs(assignmentsRef);
    const assignments = [];
    querySnapshot.forEach((doc) => {
      assignments.push({ id: doc.id, ...doc.data() });
    });
    return assignments; // Return all assignments
  } catch (error) {
    console.error('Error getting assignments:', error);
  }
};
