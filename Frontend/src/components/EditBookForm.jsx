import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function EditBookForm({ book, onBookUpdated, onBookDeleted, onCancel }) {
  const { isAuthenticated, authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    image: null,
    buyingLink: '',
    remoteImageUrl: '',
    customCategory: (book.category && book.category !== 'Fiction' && book.category !== 'Non-fiction' && book.category !== 'Science Fiction' && book.category !== 'Fantasy' && book.category !== 'Mystery' && book.category !== 'Thriller' && book.category !== 'Romance' && book.category !== 'Biography' && book.category !== 'History' && book.category !== 'Self-help' && book.category !== 'Education' && book.category !== 'Classic') ? book.category : ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        category: book.category || '',
        image: null,
        buyingLink: book.buyingLink || '',
        remoteImageUrl: (book.image && (book.image.startsWith("http://") || book.image.startsWith("https://"))) ? book.image : '',
        customCategory: (book.category && book.category !== 'Fiction' && book.category !== 'Non-fiction' && book.category !== 'Science Fiction' && book.category !== 'Fantasy' && book.category !== 'Mystery' && book.category !== 'Thriller' && book.category !== 'Romance' && book.category !== 'Biography' && book.category !== 'History' && book.category !== 'Self-help' && book.category !== 'Education' && book.category !== 'Classic') ? book.category : ''
      });
      setImagePreview(book.image || null);
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && value !== 'Other' && { customCategory: '' })
    }));
    if (name === 'remoteImageUrl') {
      if (value) {
        setImagePreview(value);
        setFormData(prev => ({ ...prev, image: null }));
      } else {
        if (!prev.image) {
          setImagePreview((book.image && (book.image.startsWith("http://") || book.image.startsWith("https://"))) ? book.image : null);
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
      toast.error("You need to be logged in to edit a book.");
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('author', formData.author);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category === 'Other' ? formData.customCategory : formData.category);
    submitData.append('buyingLink', formData.buyingLink);

    if (formData.remoteImageUrl) {
      submitData.append('remoteImageUrl', formData.remoteImageUrl);
    } else if (formData.image instanceof File) {
      submitData.append('image', formData.image);
    } else if (book.image && !(book.image.startsWith("/uploads/"))) {
      if (!formData.remoteImageUrl && !formData.image) {
        submitData.append('image', '');
      }
    }
    
    try {
      const response = await axiosInstance.put(`/book/${book.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authUser.token}`
        },
      });
      toast.success('Book updated successfully!');
      onBookUpdated(response.data);
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error(error.response?.data?.message || "Failed to update book.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    setLoading(true);

    if (!authUser) {
      toast.error("You need to be logged in to delete a book.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.delete(`/book/${book.id}`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`
        }
      });
      toast.success('Book deleted successfully!');
      onBookDeleted(book.id); // Notify parent component about deletion
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(error.response?.data?.message || "Failed to delete book.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-white text-xl">Please login to edit books.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-lg mx-auto overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Book</h2>
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
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookForm; 