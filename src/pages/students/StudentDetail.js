import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { motion } from 'framer-motion';
import PDFViewer from '../../components/ui/PDFViewer';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertification, setSelectedCertification] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        // Fetch student details
        const studentRef = doc(db, 'students', id);
        const studentSnap = await getDoc(studentRef);
        
        if (studentSnap.exists()) {
          setStudent({
            id: studentSnap.id,
            ...studentSnap.data()
          });
          
          // Fetch student certifications
          const certificationsQuery = query(
            collection(db, 'certifications'),
            where('studentName', '==', studentSnap.data().name)
          );
          const certificationsSnapshot = await getDocs(certificationsQuery);
          const certificationsData = certificationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCertifications(certificationsData);
          
          // Fetch student achievements
          const achievementsQuery = query(
            collection(db, 'achievements'),
            where('studentName', '==', studentSnap.data().name)
          );
          const achievementsSnapshot = await getDocs(achievementsQuery);
          const achievementsData = achievementsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAchievements(achievementsData);
        } else {
          console.error('No student found with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Student Not Found</h1>
          <p className="mt-4 text-xl text-gray-500">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-8">
            <Link
              to="/students"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Students
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/students"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Students
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {student.imageBase64 ? (
                <img
                  src={student.imageBase64}
                  alt={student.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">
                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <p className="mt-1 text-lg text-gray-500">{student.batch}</p>
              {student.email && (
                <p className="mt-1 text-gray-600">
                  <span className="font-medium">Email:</span> {student.email}
                </p>
              )}
              {student.phone && (
                <p className="mt-1 text-gray-600">
                  <span className="font-medium">Phone:</span> {student.phone}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {student.about && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">About</h2>
                <p className="mt-1 text-gray-600">{student.about}</p>
              </div>
            )}
            
            {student.interests && student.interests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Interests</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {student.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {student.skills && student.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Certifications Section */}
          {certifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {cert.imageBase64 && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={cert.imageBase64}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-900">{cert.title}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {cert.certType}
                        </span>
                      </div>
                      {cert.date && (
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(cert.date).toLocaleDateString()}
                        </p>
                      )}
                      <button
                        onClick={() => setSelectedCertification(cert)}
                        className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    {achievement.date && (
                      <p className="text-sm text-gray-500">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                    {achievement.description && (
                      <p className="mt-2 text-sm text-gray-600">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedCertification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedCertification.title}
                    </h3>
                    <div className="mt-4 h-[600px]">
                      <PDFViewer driveLink={selectedCertification.driveLink} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedCertification(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail; 