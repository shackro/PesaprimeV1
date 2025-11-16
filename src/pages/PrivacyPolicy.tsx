// pages/PrivacyPolicy.tsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PesaPrime Capital Ltd ("we," "our," or "us") is committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our platform 
              and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing our platform and using our services, you consent to the data practices 
              described in this policy. If you do not agree with the terms of this Privacy Policy, 
              please do not access the platform.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Register for an account</li>
              <li>Complete verification procedures</li>
              <li>Make investments or withdrawals</li>
              <li>Contact our support team</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Types of Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Full name, date of birth, and contact details</li>
              <li>Government-issued identification documents</li>
              <li>Proof of address and source of funds documentation</li>
              <li>Financial information and transaction history</li>
              <li>Phone number and email address</li>
              <li>IP address and device information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically collect certain information when you visit our platform, including 
              IP address, browser type, operating system, access times, and pages viewed.
            </p>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing your account</li>
              <li>Verifying your identity and complying with regulatory requirements</li>
              <li>Communicating with you about your account and our services</li>
              <li>Improving our platform and user experience</li>
              <li>Detecting and preventing fraud and unauthorized activities</li>
              <li>Sending important updates and security notifications</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. However, 
              we may share information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share information with trusted third-party service providers who assist us in 
              operating our platform, conducting our business, or servicing you, such as:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Payment processors and banking partners</li>
              <li>Identity verification services</li>
              <li>Cloud storage and hosting providers</li>
              <li>Customer support platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information when required by law or in response to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Court orders, subpoenas, or legal processes</li>
              <li>Government and regulatory requests</li>
              <li>Investigations of potential violations</li>
              <li>Protection of our rights, property, or safety</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed">
              In the event of a merger, acquisition, or sale of all or a portion of our assets, 
              your information may be transferred to the new entity.
            </p>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect 
              your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers with restricted access</li>
              <li>Regular security assessments and audits</li>
              <li>Multi-factor authentication systems</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              While we strive to use commercially acceptable means to protect your personal 
              information, no method of transmission over the Internet or electronic storage 
              is 100% secure.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, unless a longer retention period is required or 
              permitted by law. Specific retention periods include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Account information: 7 years after account closure</li>
              <li>Transaction records: 7 years from transaction date</li>
              <li>Verification documents: 7 years after account closure</li>
              <li>Communication records: 3 years from last contact</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the following rights regarding your 
              personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Right to access and receive copies of your information</li>
              <li>Right to rectify inaccurate or incomplete information</li>
              <li>Right to erasure of your personal information</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, please contact us using the information provided in the 
              "Contact Us" section.
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our platform 
              and hold certain information. Cookies are files with a small amount of data that 
              may include an anonymous unique identifier.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie 
              is being sent. However, if you do not accept cookies, you may not be able to use 
              some portions of our platform.
            </p>
          </div>

          {/* International Transfers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to — and maintained on — computers located 
              outside of your state, province, country, or other governmental jurisdiction where 
              the data protection laws may differ from those of your jurisdiction. We ensure 
              appropriate safeguards are in place for such transfers in accordance with applicable 
              data protection laws.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for individuals under the age of 18. We do not 
              knowingly collect personal information from children under 18. If you become aware 
              that a child has provided us with personal information, please contact us. If we 
              become aware that we have collected personal information from a child under 18, we 
              will take steps to delete such information.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes 
              to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email: privacy@pesaprimecapital.com
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address: Nairobi, Kenya
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone: +254 700 000000
                </li>
              </ul>
            </div>
          </div>

          {/* Acceptance */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-center font-semibold">
              By using PesaPrime Capital's platform and services, you acknowledge that you have 
              read and understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;