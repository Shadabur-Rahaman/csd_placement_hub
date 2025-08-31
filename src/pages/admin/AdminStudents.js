import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: '',
    phone: '',
    about: '',
    interests: [],
    skills: [],
    imageBase64: '',
  });

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsCollection = collection(db, 'students');
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by name
      studentsData.sort((a, b) => {
        return (a.name || '').localeCompare(b.name || '');
      });
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteDoc(doc(db, 'students', id));
        setStudents(students.filter(student => student.id !== id));
        toast.success('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      batch: student.batch || '',
      phone: student.phone || '',
      about: student.about || '',
      interests: student.interests || [],
      skills: student.skills || [],
      imageBase64: student.imageBase64 || '',
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

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value;
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({
      ...formData,
      [field]: items,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress the image
      const options = {
        maxSizeMB: 0.5, // Max size in MB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageBase64: reader.result,
        });
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Error processing image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Student name is required');
      return;
    }

    try {
      const studentData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (editStudent?.id) {
        // Update existing student
        const studentRef = doc(db, 'students', editStudent.id);
        await updateDoc(studentRef, studentData);
        toast.success('Student updated successfully!');
      } else {
        // Add new student
        studentData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'students'), studentData);
        toast.success('Student added successfully!');
      }
      
      setShowForm(false);
      setEditStudent(null);
      setFormData({
        name: '',
        email: '',
        batch: '',
        phone: '',
        about: '',
        interests: [],
        skills: [],
        imageBase64: '',
      });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error saving student. Please try again.');
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    return !searchTerm || 
      (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.batch && student.batch.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
        <button
          onClick={() => {
            setEditStudent(null);
            setFormData({
              name: '',
              email: '',
              batch: '',
              phone: '',
              about: '',
              interests: [],
              skills: [],
              imageBase64: '',
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Student
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editStudent ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="batch">
                  Batch
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 2020-2024"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="about">
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="interests">
                  Interests
                </label>
                <input
                  type="text"
                  id="interests"
                  value={formData.interests.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'interests')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. AI, Machine Learning, Web Development"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate interests with commas
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="skills">
                  Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'skills')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. React, Python, Java"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate skills with commas
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a profile image (optional). Max size: 500KB.
                </p>
              </div>
              
              {formData.imageBase64 && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Preview</label>
                  <img
                    src={formData.imageBase64}
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover border"
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
                {editStudent ? 'Update' : 'Save'}
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
                placeholder="Search students by name, email, or batch"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {student.imageBase64 ? (
                              <img className="h-10 w-10 rounded-full" src={student.imageBase64} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-lg text-gray-600">
                                  {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            {student.phone && (
                              <div className="text-sm text-gray-500">{student.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.batch || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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

export default AdminStudents; 