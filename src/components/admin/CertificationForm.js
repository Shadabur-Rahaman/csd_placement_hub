import React, { useState } from 'react';
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/client';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const CertificationForm = ({ certification = null, onSuccess = () => {} }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    studentName: certification?.studentName || '',
    certType: certification?.certType || 'NPTEL',
    description: certification?.description || '',
    driveLink: certification?.driveLink || '',
    imageBase64: certification?.imageBase64 || '',
    date: certification?.date ? new Date(certification.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        setFormData((prev) => ({
          ...prev,
          imageBase64: reader.result,
        }));
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Error processing image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.studentName || !formData.driveLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const certificationData = {
        ...formData,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (certification?.id) {
        // Update existing certification
        const certRef = doc(db, 'certifications', certification.id);
        await updateDoc(certRef, certificationData);
        toast.success('Certification updated successfully!');
      } else {
        // Add new certification
        await addDoc(collection(db, 'certifications'), certificationData);
        toast.success('Certification added successfully!');
        
        // Reset form
        setFormData({
          title: '',
          studentName: '',
          certType: 'NPTEL',
          description: '',
          driveLink: '',
          imageBase64: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error('Error saving certification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {certification ? 'Edit Certification' : 'Add New Certification'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Certificate Title *
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
            <label className="block text-gray-700 font-medium mb-2" htmlFor="certType">
              Certification Type *
            </label>
            <select
              id="certType"
              name="certType"
              value={formData.certType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="NPTEL">NPTEL</option>
              <option value="UDEMY">UDEMY</option>
              <option value="SPRINGBOOT">SPRINGBOOT</option>
              <option value="OTHER">Other</option>
            </select>
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
            <label className="block text-gray-700 font-medium mb-2" htmlFor="driveLink">
              Google Drive PDF Link *
            </label>
            <input
              type="url"
              id="driveLink"
              name="driveLink"
              value={formData.driveLink}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://drive.google.com/file/d/..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Please provide a public Google Drive link to the PDF file.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
              Certificate Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload an image of the certificate (optional). Max size: 500KB.
            </p>
          </div>
          
          {formData.imageBase64 && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Preview</label>
              <img
                src={formData.imageBase64}
                alt="Certificate preview"
                className="max-h-48 rounded-lg border"
              />
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => onSuccess()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : certification ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificationForm; 