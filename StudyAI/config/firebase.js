import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, addDoc, getDocs, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBfRGfe8pzXWtWngoh2-M_otdBN-f3i5kI',
  authDomain: 'planit-afc74.firebaseapp.com',
  projectId: 'planit-afc74',
  storageBucket: 'planit-afc74.firebasestorage.app',
  messagingSenderId: '924919525257',
  appId: '1:924919525257:web:927d2ceb6e3c62ab9ffb58',
  measurementId: 'G-3XQ3FM3K2C',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };

/*export const deleteAllAssignments = async () => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;
  const assignmentsRef = collection(db, 'users', userId, 'assignments');

  try {
    const querySnapshot = await getDocs(assignmentsRef);
    const deletePromises = querySnapshot.docs.map((docSnapshot) => 
      deleteDoc(doc(db, 'users', userId, 'assignments', docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log('All assignments deleted.');
  } catch (error) {
    console.error('Error deleting assignments:', error);
  }
};*/

export const addAssignment = async (assignmentData) => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;
  const assignmentsRef = collection(db, 'users', userId, 'assignments');

  const { DueDate, ID, ...otherData } = assignmentData;
  let dueDateTimestamp = Timestamp.fromDate(new Date(DueDate));
  if (isNaN(dueDateTimestamp.seconds)) {
    dueDateTimestamp = Timestamp.fromDate(new Date());
  }

  try {
    const q = query(assignmentsRef, where('ID', '==', ID));
    const existingAssignments = await getDocs(q);

    if (!existingAssignments.empty) {
      const assignmentDoc = existingAssignments.docs[0].ref;
      await updateDoc(assignmentDoc, { ...otherData, DueDate: dueDateTimestamp });
    } else {
      const newID = Math.floor(Math.random() * 10000000);
      await addDoc(assignmentsRef, { ID: newID, ...otherData, DueDate: dueDateTimestamp });
    }
  } catch (error) {
    console.error('Error adding/updating assignment:', error);
  }
};


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
    for (const assignment of assignments) {
      if (assignment.ID==="1"||assignment.ID===undefined) {
        assignment.ID=(Math.floor(Math.random() * 10000000)).toString();
        await addAssignment(assignment);
      };
      if (assignment.DueDate) {
        assignment.DueDate = assignment.DueDate.toDate().toISOString().split('T')[0];
      } else {
        assignment.DueDate = new Date().toISOString().split('T')[0];
      }
      

    }
    return assignments;
  } catch (error) {
    console.error('Error getting assignments:', error);
  }
};
