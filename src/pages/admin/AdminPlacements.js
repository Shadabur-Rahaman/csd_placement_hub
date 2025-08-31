import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';

const AdminPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPlacement, setEditPlacement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    studentName: '',
    company: '',
    position: '',
    package: '',
    year: new Date().getFullYear().toString(),
    imageBase64: '',
  });

  // Fetch placements on component mount
  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const placementsCollection = collection(db, 'placements');
      const placementsSnapshot = await getDocs(placementsCollection);
      const placementsData = placementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by year (newest first)
      placementsData.sort((a, b) => {
        return (b.year || 0) - (a.year || 0);
      });
      
      setPlacements(placementsData);
    } catch (error) {
      console.error('Error fetching placements:', error);
      toast.error('Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement record?')) {
      try {
        await deleteDoc(doc(db, 'placements', id));
        setPlacements(placements.filter(placement => placement.id !== id));
        toast.success('Placement record deleted successfully');
      } catch (error) {
        console.error('Error deleting placement record:', error);
        toast.error('Failed to delete placement record');
      }
    }
  };

  const handleEdit = (placement) => {
    setEditPlacement(placement);
    setFormData({
      studentName: placement.studentName || '',
      company: placement.company || '',
      position: placement.position || '',
      package: placement.package || '',
      year: placement.year || new Date().getFullYear().toString(),
      imageBase64: placement.imageBase64 || '',
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
    
    if (!formData.studentName || !formData.company) {
      toast.error('Student name and company are required');
      return;
    }

    try {
      const placementData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (editPlacement?.id) {
        // Update existing placement
        const placementRef = doc(db, 'placements', editPlacement.id);
        await updateDoc(placementRef, placementData);
        toast.success('Placement record updated successfully!');
      } else {
        // Add new placement
        placementData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'placements'), placementData);
        toast.success('Placement record added successfully!');
      }
      
      setShowForm(false);
      setEditPlacement(null);
      setFormData({
        studentName: '',
        company: '',
        position: '',
        package: '',
        year: new Date().getFullYear().toString(),
        imageBase64: '',
      });
      fetchPlacements();
    } catch (error) {
      console.error('Error saving placement record:', error);
      toast.error('Error saving placement record. Please try again.');
    }
  };

  // Filter placements based on search term
  const filteredPlacements = placements.filter(placement => {
    return !searchTerm || 
      (placement.studentName && placement.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (placement.company && placement.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (placement.position && placement.position.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Placements</h1>
        <button
          onClick={() => {
            setEditPlacement(null);
            setFormData({
              studentName: '',
              company: '',
              position: '',
              package: '',
              year: new Date().getFullYear().toString(),
              imageBase64: '',
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Placement
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editPlacement ? 'Edit Placement Record' : 'Add New Placement Record'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="studentName">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="company">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
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
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="package">
                  Package (LPA)
                </label>
                <input
                  type="text"
                  id="package"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="year">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2000"
                  max="2100"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                  Student Image
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
                    alt="Student preview"
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
                {editPlacement ? 'Update' : 'Save'}
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
                placeholder="Search placements by student name, company, or position"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredPlacements.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500">No placement records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlacements.map((placement) => (
                    <tr key={placement.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{placement.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.position || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.package ? `${placement.package} LPA` : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placement.year || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(placement)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(placement.id)}
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

export default AdminPlacements; 