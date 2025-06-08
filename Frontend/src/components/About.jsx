import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const teamMembers = [
  {
    id: 1,
    name: 'Arnav Tiwari',
    role: 'Founder & CEO',
    bio: 'Passionate about education and technology, Arnav founded BookStore to make learning accessible to everyone.',
    image: '/images/me.jpg'
  },
  {
    id: 2,
    name: 'Arnav Tiwari',
    role: 'Head of Content',
    bio: 'With over 10 years in publishing, Arnav ensures our content meets the highest educational standards.',
    image: '/images/me2.jpg'
  },
  {
    id: 3,
    name: 'Arnav Tiwari',
    role: 'Tech Lead',
    bio: 'Arnav leads our technical team in creating seamless learning experiences across all devices.',
    image: '/images/me3.jpg'
  }
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-slate-800 dark:to-slate-900 py-28 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-5 leading-tight lg:text-5xl">
              About BookStore
            </h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto mb-7 lg:text-xl">
              Empowering learners worldwide with accessible, high-quality educational resources since 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-7 leading-tight">
              Our Story & Mission
            </h2>
            <div className="mt-5 text-gray-700 dark:text-gray-300 space-y-5 max-w-4xl mx-auto text-base leading-relaxed">
              <p>
                BookStore was born from a simple idea: education should be accessible to everyone, everywhere. 
                What started as a small collection of free books has grown into a comprehensive learning 
                platform serving millions of students and professionals worldwide.
              </p>
              <p>
                Our mission is to break down barriers to education by providing high-quality, affordable 
                learning resources that empower individuals to achieve their personal and professional goals.
                We believe in fostering a community of lifelong learners and providing the tools they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-base-200 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 sm:text-4xl">
              Meet Our Amazing Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out group"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110" 
                      src={member.image} 
                      alt={member.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-7 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-pink-600 font-medium text-base mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-normal">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-700 dark:bg-pink-800">
        <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:py-18 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <span className="block">Ready to start learning?</span>
            <span className="block text-pink-200">Explore our books today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow-lg">
              <Link
                to="/books"
                className="inline-flex items-center justify-center px-7 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-white hover:bg-pink-100 transition-colors duration-300 transform hover:scale-105"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
