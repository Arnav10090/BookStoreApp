import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const Contact = () => {
  const { authUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      setSubmitStatus({
        success: false,
        message: "Please login first to send a query message."
      });
      toast.error("Please login first to send a query message.");
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("http://localhost:4000/contact/submit", {
        fullName: formData.name,
        emailAddress: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      console.log(response.data);
      setSubmitStatus({
        success: true,
        message: response.data.message
      });
      toast.success(response.data.message);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        setSubmitStatus({
          success: false,
          message: error.response.data.message || 'There was an error sending your message. Please try again later.'
        });
        toast.error(error.response.data.message || 'Failed to send message.');
      } else {
        setSubmitStatus({
          success: false,
          message: 'There was an error sending your message. Please try again later.'
        });
        toast.error('Failed to send message.');
      }
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
              <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
                Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Contact Form */}
                <div className="p-8 lg:p-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
                  
                  {submitStatus && (
                    <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Tell us more about how we can help you..."
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-600 text-white p-8 lg:p-12">
                  <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-500 rounded-full p-3">
                        <FaMapMarkerAlt className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Our Location</h3>
                        <p className="text-blue-100">123 Book Street<br />New York, NY 10001<br />United States</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-500 rounded-full p-3">
                        <FaPhone className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Phone Number</h3>
                        <p className="text-blue-100">+1 (555) 123-4567</p>
                        <p className="text-blue-100">+1 (555) 987-6543</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-500 rounded-full p-3">
                        <FaEnvelope className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Email Address</h3>
                        <p className="text-blue-100">info@bookstore.com</p>
                        <p className="text-blue-100">support@bookstore.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                        <span className="sr-only">Facebook</span>
                        <FaFacebook className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                        <span className="sr-only">Twitter</span>
                        <FaTwitter className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                        <span className="sr-only">Instagram</span>
                        <FaInstagram className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                        <span className="sr-only">LinkedIn</span>
                        <FaLinkedin className="h-6 w-6" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-blue-100 text-sm">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
