import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';
import CertificationForm from '../../components/admin/CertificationForm';

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCertification, setEditCertification] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  // Fetch certifications on component mount
  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const certificationsCollection = collection(db, 'certifications');
      const certificationsSnapshot = await getDocs(certificationsCollection);
      const certificationsData = certificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (newest first)
      certificationsData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setCertifications(certificationsData);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteDoc(doc(db, 'certifications', id));
        setCertifications(certifications.filter(cert => cert.id !== id));
        toast.success('Certification deleted successfully');
      } catch (error) {
        console.error('Error deleting certification:', error);
        toast.error('Failed to delete certification');
      }
    }
  };

  const handleEdit = (certification) => {
    setEditCertification(certification);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditCertification(null);
    fetchCertifications();
  };

  const filteredCertifications = filterType === 'ALL' 
    ? certifications 
    : certifications.filter(cert => cert.certType === filterType);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Certifications</h1>
        <button
          onClick={() => {
            setEditCertification(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Certification
        </button>
      </div>

      {showForm ? (
        <CertificationForm 
          certification={editCertification} 
          onSuccess={handleFormSuccess} 
        />
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="NPTEL">NPTEL</option>
              <option value="UDEMY">UDEMY</option>
              <option value="SPRINGBOOT">SPRINGBOOT</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCertifications.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500">No certifications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCertifications.map((cert) => (
                    <tr key={cert.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cert.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cert.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {cert.certType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {cert.date ? new Date(cert.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCertifications; 