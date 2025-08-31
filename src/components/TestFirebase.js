import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/client';

const TestFirebase = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Firebase connection...');
        const querySnapshot = await getDocs(collection(db, 'faculty'));
        const facultyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(facultyData);
        console.log('Fetched data:', facultyData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Loading test data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre' }}>
      <h2>Firebase Test Results</h2>
      <h3>Found {data?.length || 0} faculty members</h3>
      {data?.map((faculty, index) => (
        <div key={faculty.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
          <div>Name: {faculty.name}</div>
          <div>Position: {faculty.position || faculty.designation}</div>
          <div>Image URL: {faculty.imageUrl || 'No image'}</div>
          {faculty.imageUrl && (
            <img 
              src={faculty.imageUrl} 
              alt={faculty.name}
              style={{ maxWidth: '200px', marginTop: '10px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/faculty/default-profile.svg';
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TestFirebase;
