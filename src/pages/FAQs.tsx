// pages/FAQs.tsx
import React, { useState } from 'react';

const FAQs = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Account & Registration",
      questions: [
        {
          question: "How do I create an account with PesaPrime Capital?",
          answer: "To create an account, click on the 'Sign Up' button on our homepage. You'll need to provide your email address, create a password, and verify your phone number. Once verified, you can complete your profile and start investing."
        },
        {
          question: "What documents do I need for registration?",
          answer: "You'll need a valid government-issued ID (passport, national ID, or driver's license) and proof of address. For larger investments, we may require additional verification documents to comply with regulatory requirements."
        },
        {
          question: "Is there a minimum age requirement?",
          answer: "Yes, you must be at least 18 years old to create an account and invest with PesaPrime Capital."
        }
      ]
    },
    {
      title: "Investments & Plans",
      questions: [
        {
          question: "What investment plans do you offer?",
          answer: "We offer multiple investment plans tailored to different risk profiles and investment goals. These include short-term trading plans, medium-term growth plans, and long-term wealth accumulation strategies. Each plan has different risk-return profiles and investment periods."
        },
        {
          question: "What is the minimum investment amount?",
          answer: "The minimum investment amount varies by plan, starting from as low as $50 for our basic plans. Specific minimum amounts are clearly displayed when you select an investment plan."
        },
        {
          question: "How are profits calculated and distributed?",
          answer: "Profits are calculated based on the performance of our trading activities and are distributed according to your chosen investment plan. We provide regular performance reports and profit distributions are typically made weekly or monthly, depending on the plan."
        },
        {
          question: "Can I change my investment plan?",
          answer: "Yes, you can upgrade your investment plan at any time. However, downgrading may be subject to the terms of your current plan. Contact our support team for assistance with plan changes."
        }
      ]
    },
    {
      title: "Withdrawals & Funds",
      questions: [
        {
          question: "How do I withdraw my funds?",
          answer: "You can request withdrawals through your account dashboard. Navigate to the 'Withdraw' section, enter the amount you wish to withdraw, and confirm your phone number. Withdrawals are processed within 1-3 business days."
        },
        {
          question: "Are there any withdrawal fees?",
          answer: "Withdrawal fees vary depending on the payment method and amount. Standard processing fees apply, which are clearly displayed before you confirm your withdrawal request. There are no hidden fees."
        },
        {
          question: "How long do withdrawals take to process?",
          answer: "Withdrawals are typically processed within 1-3 business days. The exact timing may depend on your payment method and banking institution. You'll receive a confirmation email once your withdrawal is processed."
        },
        {
          question: "Why is phone number verification required for withdrawals?",
          answer: "Phone number verification is a security measure to protect your account from unauthorized access. It ensures that only you can initiate withdrawals from your account, adding an extra layer of security."
        }
      ]
    },
    {
      title: "Security & Safety",
      questions: [
        {
          question: "How is my investment secured?",
          answer: "We employ multiple security layers including SSL encryption, cold storage for digital assets, multi-signature wallets, and regular security audits. Your funds are protected by institutional-grade security measures."
        },
        {
          question: "Is PesaPrime Capital regulated?",
          answer: "Yes, PesaPrime Capital operates under the regulatory framework of our jurisdiction. We maintain full compliance with financial regulations and our registration documents are available for review in the Legal Documents section."
        },
        {
          question: "What happens if PesaPrime Capital faces financial difficulties?",
          answer: "We maintain adequate capital reserves and follow strict risk management protocols. Client funds are held in segregated accounts separate from company operational funds, providing an additional layer of protection."
        }
      ]
    },
    {
      title: "Trading & Strategy",
      questions: [
        {
          question: "Who manages the trading activities?",
          answer: "Our trading activities are managed by a team of professional traders with extensive experience in cryptocurrency markets. We use a combination of algorithmic trading strategies and manual oversight to optimize returns."
        },
        {
          question: "What trading strategies do you employ?",
          answer: "We utilize diversified strategies including spot trading, derivatives trading, arbitrage opportunities, and liquidity provision across multiple cryptocurrency exchanges. This diversification helps manage risk while seeking optimal returns."
        },
        {
          question: "How transparent is your trading performance?",
          answer: "We provide regular performance reports showing trading activities, returns, and fees. Investors can track their portfolio performance in real-time through their dashboard and receive detailed monthly statements."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about investing with PesaPrime Capital
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400 ml-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full py-4 px-2 text-gray-700 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{category.title}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 10 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <div key={itemIndex} className="border-b border-gray-200 last:border-b-0">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition duration-200"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
              Contact Support
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;