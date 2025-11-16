// pages/TermsConditions.tsx
import React from 'react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Parties and Scope</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This Agreement is between the user ("Investor") and PesaPrime Capital Ltd ("Company"). 
              The Company provides cryptocurrency trading and custodial services to Investors pursuant 
              to the terms below.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By registering an account and using our platform, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>

          {/* Services Provided */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Company will trade cryptocurrencies on behalf of Investors using professional traders 
              and algorithmic strategies. Services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Spot trading across major cryptocurrency exchanges</li>
              <li>Derivatives trading and risk management</li>
              <li>Liquidity provision and market making</li>
              <li>Secure custody of digital assets</li>
              <li>Portfolio management and performance reporting</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The Company will use commercially reasonable efforts to execute trades and manage risk 
              per each plan's stated objectives. However, past performance is not indicative of future 
              results, and cryptocurrency investments carry inherent risks.
            </p>
          </div>

          {/* Profit Sharing & Fees */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Profit Sharing & Fees</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Trading profits (net of fees and costs) are calculated for each investor pool and 
              distributed according to the Investor's selected plan. Our fee structure includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Management fees based on assets under management</li>
              <li>Performance fees calculated on profitable trading periods</li>
              <li>Administrative and operational costs</li>
              <li>Withdrawal processing fees where applicable</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              All fees are transparently disclosed in the investor agreement and regular statements. 
              Investors receive detailed breakdowns of all charges and profit distributions.
            </p>
          </div>

          {/* Withdrawals */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Withdrawals</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Withdrawal requests must be made through the official platform using the registered 
              phone number and account credentials. Key withdrawal terms include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Phone number verification is mandatory for all withdrawal requests</li>
              <li>Withdrawals are processed within 1-3 business days</li>
              <li>Minimum and maximum withdrawal limits apply based on account status</li>
              <li>Additional verification may be required for large withdrawals</li>
              <li>Withdrawal fees are clearly disclosed before confirmation</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The Company reserves the right to suspend withdrawal requests pending verification 
              or in cases of suspected fraudulent activity.
            </p>
          </div>

          {/* Account Security */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Account Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Investors are responsible for maintaining the security of their account credentials 
              and registered phone number. Important security terms:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Keep login credentials confidential and secure</li>
              <li>Immediately report any unauthorized account access</li>
              <li>Use strong, unique passwords for your account</li>
              <li>Enable two-factor authentication when available</li>
              <li>Keep registered phone number and email address current</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The Company implements robust security measures but cannot be held liable for losses 
              resulting from compromised account credentials.
            </p>
          </div>

          {/* Risk Disclosure */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Risk Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cryptocurrency investments carry significant risks, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Market volatility and price fluctuations</li>
              <li>Regulatory changes and legal uncertainties</li>
              <li>Technology risks including cybersecurity threats</li>
              <li>Liquidity risks in certain market conditions</li>
              <li>Potential loss of principal investment</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Investors should only invest funds they are willing to lose and should consider their 
              risk tolerance and investment objectives carefully.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This Agreement is governed by the laws of the jurisdiction where the Company is 
              registered. Any disputes shall be resolved through arbitration in accordance with 
              the rules of the relevant arbitration body.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The Company maintains proper registration and complies with all applicable regulations 
              in its operating jurisdiction.
            </p>
          </div>

          {/* Amendments */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Amendments</h2>
            <p className="text-gray-700 leading-relaxed">
              The Company reserves the right to modify these Terms & Conditions at any time. 
              Investors will be notified of material changes via email or platform notifications. 
              Continued use of the platform constitutes acceptance of the modified terms.
            </p>
          </div>

          {/* Contact & Documents */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact & Documents</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Company's registration documents, compliance reports and full Terms & Conditions 
              are available for download below. By using the platform, Investors agree to these 
              Terms & Conditions.
            </p>

            {/* Legal Documents */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Documents</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">Certificate of Incorporation</h4>
                    <p className="text-sm text-gray-600">Company registration document</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">CBK Compliance Certificate</h4>
                    <p className="text-sm text-gray-600">Regulatory compliance document</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-center font-semibold">
              By using PesaPrime Capital's platform and services, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;