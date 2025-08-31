import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    education: '',
    specialization: '',
    experience: '',
    department: '',
    quote: '',
    imageBase64: '',
  });

  // Fetch faculty on component mount
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      // Use dynamic imports to ensure Firebase is properly initialized
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      
      // Get the db instance with a fresh import if needed
      let firestoreDb = db;
      if (!firestoreDb) {
        const { db: importedDb } = await import('../../firebase/client');
        firestoreDb = importedDb;
        if (!firestoreDb) {
          throw new Error('Firestore not initialized');
        }
      }
      
      // Create a query with ordering
      const facultyQuery = query(
        collection(firestoreDb, 'faculty'),
        orderBy('name', 'asc')
      );
      
      // Execute the query
      const facultySnapshot = await getDocs(facultyQuery);
      
      // Process the results
      const facultyData = [];
      facultySnapshot.forEach((doc) => {
        facultyData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setFaculty(facultyData);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageBase64: reader.result
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editFaculty) {
        // Update existing faculty
        const facultyRef = doc(db, 'faculty', editFaculty.id);
        await updateDoc(facultyRef, formData);
        toast.success('Faculty updated successfully');
      } else {
        // Add new faculty
        await addDoc(collection(db, 'faculty'), formData);
        toast.success('Faculty added successfully');
      }
      
      setShowForm(false);
      setEditFaculty(null);
      setFormData({
        name: '',
        position: '',
        email: '',
        phone: '',
        education: '',
        specialization: '',
        experience: '',
        department: '',
        quote: '',
        imageBase64: '',
      });
      fetchFaculty();
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error('Failed to save faculty');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'faculty', id));
      toast.success('Faculty deleted successfully');
      fetchFaculty();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  // Filter faculty based on search term
  const filteredFaculty = faculty.filter(f => 
    !searchTerm || 
    (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.department && f.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (f.specialization && f.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Faculty</h1>
        <button
          onClick={() => {
            setEditFaculty(null);
            setFormData({
              name: '',
              position: '',
              email: '',
              phone: '',
              education: '',
              specialization: '',
              experience: '',
              department: '',
              quote: '',
              imageBase64: '',
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Faculty
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {showForm ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editFaculty ? 'Edit Faculty' : 'Add New Faculty'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="position">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                required
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="education">
                Education
              </label>
              <input
                type="text"
                id="education"
                name="education"
                required
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="specialization">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="experience">
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="quote">
                Quote
              </label>
              <textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.imageBase64 && (
                <img
                  src={formData.imageBase64}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditFaculty(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {editFaculty ? 'Update Faculty' : 'Add Faculty'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                {member.imageBase64 ? (
                  <img
                    src={member.imageBase64}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.position}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  {member.email && (
                    <p>
                      <span className="font-medium">Email:</span> {member.email}
                    </p>
                  )}
                  {member.phone && (
                    <p>
                      <span className="font-medium">Phone:</span> {member.phone}
                    </p>
                  )}
                  {member.department && (
                    <p>
                      <span className="font-medium">Department:</span> {member.department}
                    </p>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditFaculty(member);
                      setFormData(member);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredFaculty.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Faculty Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminFaculty; 