import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';

const AdminResearch = () => {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editResearch, setEditResearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    researchType: 'STUDENTS', // Default to STUDENTS
    studentName: '',
    facultyName: '',
    link: '',
    imageBase64: '',
  });

  // Fetch research on component mount
  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const researchCollection = collection(db, 'research');
      const researchSnapshot = await getDocs(researchCollection);
      const researchData = researchSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date (newest first)
      researchData.sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
      });
      
      setResearch(researchData);
    } catch (error) {
      console.error('Error fetching research:', error);
      toast.error('Failed to load research');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this research?')) {
      try {
        await deleteDoc(doc(db, 'research', id));
        setResearch(research.filter(item => item.id !== id));
        toast.success('Research deleted successfully');
      } catch (error) {
        console.error('Error deleting research:', error);
        toast.error('Failed to delete research');
      }
    }
  };

  const handleEdit = (item) => {
    setEditResearch(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      researchType: item.researchType || 'STUDENTS',
      studentName: item.studentName || '',
      facultyName: item.facultyName || '',
      link: item.link || '',
      imageBase64: item.imageBase64 || '',
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({
        ...formData,
        imageBase64: reader.result,
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    try {
      const researchData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (editResearch?.id) {
        // Update existing research
        const researchRef = doc(db, 'research', editResearch.id);
        await updateDoc(researchRef, researchData);
        toast.success('Research updated successfully!');
      } else {
        // Add new research
        researchData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'research'), researchData);
        toast.success('Research added successfully!');
      }
      
      setShowForm(false);
      setEditResearch(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        researchType: 'STUDENTS',
        studentName: '',
        facultyName: '',
        link: '',
        imageBase64: '',
      });
      fetchResearch();
    } catch (error) {
      console.error('Error saving research:', error);
      toast.error('Error saving research. Please try again.');
    }
  };

  // Filter research based on search term
  const filteredResearch = research.filter(item => {
    return !searchTerm || 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.studentName && item.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.facultyName && item.facultyName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Research</h1>
        <button
          onClick={() => {
            setEditResearch(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              researchType: 'STUDENTS',
              studentName: '',
              facultyName: '',
              link: '',
              imageBase64: '',
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Research
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editResearch ? 'Edit Research' : 'Add New Research'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="researchType">
                  Research Type
                </label>
                <select
                  id="researchType"
                  name="researchType"
                  value={formData.researchType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="STUDENTS">Students</option>
                  <option value="FACULTY">Faculty</option>
                </select>
              </div>
              
              {formData.researchType === 'STUDENTS' ? (
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="studentName">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="facultyName">
                    Faculty Name
                  </label>
                  <input
                    type="text"
                    id="facultyName"
                    name="facultyName"
                    value={formData.facultyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="link">
                  Research Link (if any)
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {formData.imageBase64 && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Preview</label>
                  <img
                    src={formData.imageBase64}
                    alt="Research preview"
                    className="h-40 object-contain"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {editResearch ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search research by title or name"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredResearch.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500">No research found</p>
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
                      Name
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
                  {filteredResearch.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.researchType === 'STUDENTS' ? item.studentName : item.facultyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.researchType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

export default AdminResearch; 