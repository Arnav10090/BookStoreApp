import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Introduction</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Welcome to BookStore's Privacy Policy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regard to your personal information, please contact us at info@bookstore.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">What Information Do We Collect?</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-4 space-y-2">
            <li><strong>Full Name:</strong> To personalize your experience and for account management.</li>
            <li><strong>Email Address:</strong> For account creation, communication, and notifications.</li>
            <li><strong>Password:</strong> To secure your account. Passwords are hashed and stored securely.</li>
            <li><strong>Usage Data:</strong> Information about how you access and use the Website (e.g., pages visited, time spent).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">How Do We Use Your Information?</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-4 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To fulfill and manage your orders.</li>
            <li>To post testimonials with your consent.</li>
            <li>To protect our Services.</li>
            <li>To respond to user inquiries and offer support to users.</li>
            <li>To enable user-to-user communications.</li>
            <li>To deliver targeted advertising to you.</li>
            <li>To manage user accounts.</li>
            <li>For other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, marketing and your experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Will Your Information Be Shared With Anyone?</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-4 space-y-2">
            <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
            <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
            <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
            <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            If you have questions or comments about this policy, you may email us at info@bookstore.com or contact us by post at:
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            BookStore <br />
            [Your Company Address Here] <br />
            [Your City, Postal Code] <br />
            [Your Country]
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy; 