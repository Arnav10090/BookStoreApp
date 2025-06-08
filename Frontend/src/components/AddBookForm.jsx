import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function AddBookForm({ onBookAdded, handleCancel }) {
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    image: null,
    buyingLink: '',
    remoteImageUrl: '',
    customCategory: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'remoteImageUrl') {
      if (value) {
        setImagePreview(value);
        setFormData(prev => ({ ...prev, image: null }));
      } else {
        if (!prev.image) {
          setImagePreview(null);
        }
      }
    } else if (name === 'category' && value !== 'Other') {
      setFormData(prev => ({ ...prev, customCategory: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file, remoteImageUrl: '' }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!authUser) {
      toast.error('You need to be logged in to add a book.');
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('author', formData.author);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('buyingLink', formData.buyingLink);

    // Log formData values for debugging
    console.log('formData.image:', formData.image);
    console.log('formData.remoteImageUrl:', formData.remoteImageUrl);

    if (formData.remoteImageUrl) {
      submitData.append('remoteImageUrl', formData.remoteImageUrl);
    } else if (formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    try {
      const response = await axiosInstance.post('/book', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authUser.token}`
        },
      });
      toast.success('Book added successfully!');
      onBookAdded(response.data);
      setFormData({
        title: '',
        author: '',
        price: '',
        category: '',
        image: null,
        buyingLink: '',
        remoteImageUrl: '',
        customCategory: ''
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error.response?.data?.message || 'Failed to add book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8 overflow-y-auto max-h-[80vh]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-fiction">Non-fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-help">Self-help</option>
              <option value="Education">Education</option>
              <option value="Classic">Classic</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {formData.category === 'Other' && (
            <div>
              <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Category</label>
              <input
                type="text"
                id="customCategory"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Programming"
              />
            </div>
          )}
          <div>
            <label htmlFor="buyingLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buying Link (Optional)</label>
            <input
              type="url"
              id="buyingLink"
              name="buyingLink"
              value={formData.buyingLink}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., https://example.com/buy-this-book"
            />
          </div>
          <div>
            <label htmlFor="remoteImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL (Optional)</label>
            <input
              type="url"
              id="remoteImageUrl"
              name="remoteImageUrl"
              value={formData.remoteImageUrl}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., https://example.com/book-cover.jpg"
            />
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 my-4">OR</div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Book Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-white dark:hover:file:bg-gray-500"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Image Preview" className="max-w-xs h-auto rounded-md shadow" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBookForm; 