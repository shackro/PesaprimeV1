import React, { useState } from 'react';

interface Message {
  type: 'bot' | 'user';
  message: string;
  timestamp: Date;
}

interface ResponseMap {
  [key: string]: string | (() => void);
}

const FAQBot = () => {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [conversationPath, setConversationPath] = useState<string[]>([]);

  const toggleChat = () => {
    setOpen(!open);
    if (!open) {
      // Reset conversation when opening chat
      setConversation([
        {
          type: 'bot',
          message: "👋 Hello! Welcome to PesaPrime Capital. I'm here to help you with any questions about our investment services.",
          timestamp: new Date()
        }
      ]);
      setCurrentStep('welcome');
      setUserName('');
      setUserEmail('');
      setConversationPath(['welcome']);
      // Show initial options after a brief delay
      setTimeout(() => {
        showMainOptions();
      }, 500);
    }
  };

  const addMessage = (message: string, type: 'bot' | 'user' = 'bot') => {
    setConversation(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const addToPath = (step: string) => {
    setConversationPath(prev => [...prev, step]);
  };

  const goBack = () => {
    if (conversationPath.length > 1) {
      const newPath = conversationPath.slice(0, -1);
      setConversationPath(newPath);
      const previousStep = newPath[newPath.length - 1];
      setCurrentStep(previousStep);
      
      // Show appropriate options based on previous step
      switch (previousStep) {
        case 'welcome':
          showMainOptions();
          break;
        case 'investment_help':
          showInvestmentOptions();
          break;
        case 'account_help':
          showAccountOptions();
          break;
        case 'technical_help':
          showTechnicalOptions();
          break;
        default:
          showMainOptions();
      }
    }
  };

  const handleOptionSelect = (option: string) => {
    // Add user's selection to conversation
    addMessage(option, 'user');

    switch (currentStep) {
      case 'welcome':
        handleWelcomeResponse(option);
        break;
      case 'investment_help':
        handleInvestmentResponse(option);
        break;
      case 'account_help':
        handleAccountResponse(option);
        break;
      case 'technical_help':
        handleTechnicalResponse(option);
        break;
      case 'get_name':
        setUserName(option);
        addMessage(`Thanks, ${option}! What's your email address?`);
        setCurrentStep('get_email');
        addToPath('get_email');
        break;
      case 'get_email':
        setUserEmail(option);
        handleSupportRequest();
        break;
      case 'follow_up':
        handleFollowUpResponse(option);
        break;
      default:
        break;
    }
  };

  const handleWelcomeResponse = (option: string) => {
    switch (option) {
      case '💰 Investment Plans':
        addMessage("Great! Let me help you with our investment options:");
        showInvestmentOptions();
        setCurrentStep('investment_help');
        addToPath('investment_help');
        break;
      case '📊 Account & Trading':
        addMessage("I can help with account and trading questions:");
        showAccountOptions();
        setCurrentStep('account_help');
        addToPath('account_help');
        break;
      case '🔧 Technical Support':
        addMessage("Let me assist with technical issues:");
        showTechnicalOptions();
        setCurrentStep('technical_help');
        addToPath('technical_help');
        break;
      case '👥 Contact Support':
        addMessage("I'll connect you with our support team. What's your name?");
        setCurrentStep('get_name');
        addToPath('get_name');
        break;
      case '💬 Live Support':
        showLiveSupportOptions();
        break;
      default:
        break;
    }
  };

  const handleInvestmentResponse = (option: string) => {
    const responses: ResponseMap = {
      '📈 Investment Plans': "We offer multiple investment plans:\n\n• **Starter Plan**: $50 min, 5-7% monthly returns\n• **Growth Plan**: $500 min, 8-12% monthly returns\n• **Premium Plan**: $5,000 min, 12-18% monthly returns\n• **VIP Plan**: $25,000 min, custom returns\n\nAll plans include professional portfolio management and regular profit distributions.",
      '💸 Profit Calculation': "Profits are calculated based on:\n\n• Trading performance of our expert team\n• Market conditions and opportunities\n• Your chosen investment plan\n• Duration of investment\n\nYou'll receive detailed performance reports regularly.",
      '🔄 Withdrawal Process': "Withdrawals are simple:\n\n1. Login to your dashboard\n2. Go to 'Withdraw' section\n3. Enter amount (min $20)\n4. Verify with phone number\n5. Process within 1-3 business days\n\nPhone verification is required for security.",
      '📋 Investment Requirements': "To start investing:\n\n• Must be 18+ years old\n• Valid government ID\n• Proof of address\n• Minimum investment: $50\n• Verified phone number\n\nAll documents are securely stored.",
      '⬅️ Back': () => goBack(),
      '💬 Need Live Support?': () => showLiveSupportOptions()
    };

    const response = responses[option];
    if (typeof response === 'string') {
      addMessage(response);
      setTimeout(() => {
        addMessage("Would you like to know more about investments or should I connect you with our support team?");
        showInvestmentFollowUpOptions();
      }, 1000);
    } else if (typeof response === 'function') {
      response();
    }
  };

  const handleAccountResponse = (option: string) => {
    const responses: ResponseMap = {
      '🔐 Account Setup': "Setting up your account:\n\n1. Click 'Sign Up' on our homepage\n2. Provide email and create password\n3. Verify phone number\n4. Complete KYC verification\n5. Start investing!\n\nVerification usually takes 1-2 hours.",
      '📱 Mobile Access': "You can access PesaPrime Capital on:\n\n• **Web**: Full platform access\n• **Mobile**: Responsive design works on all devices\n• **Features**: Trading, withdrawals, portfolio tracking\n\nNo app download required!",
      '🛡️ Security': "Your security is our priority:\n\n• Bank-level SSL encryption\n• Two-factor authentication\n• Cold storage for assets\n• Regular security audits\n• Insurance coverage\n\nWe never share your data.",
      '📄 Documents Needed': "Required documents:\n\n• Government-issued ID\n• Proof of address (utility bill)\n• Source of funds (if large investment)\n• Bank account details\n\nAll documents are encrypted.",
      '⬅️ Back': () => goBack(),
      '💬 Need Live Support?': () => showLiveSupportOptions()
    };

    const response = responses[option];
    if (typeof response === 'string') {
      addMessage(response);
      setTimeout(() => {
        addMessage("Is there anything else about your account you'd like to know?");
        showAccountFollowUpOptions();
      }, 1000);
    } else if (typeof response === 'function') {
      response();
    }
  };

  const handleTechnicalResponse = (option: string) => {
    const responses: ResponseMap = {
      '🚫 Login Issues': "Having trouble logging in?\n\n• Reset password using 'Forgot Password'\n• Clear browser cache and cookies\n• Try different browser\n• Ensure phone number is verified\n• Contact support if issues persist",
      '💳 Payment Problems': "Payment issues?\n\n• Check payment method limits\n• Ensure sufficient funds\n• Verify account details\n• Wait 5-10 minutes for processing\n• Contact your bank if declined",
      '📊 Display Errors': "Seeing display issues?\n\n• Refresh the page\n• Clear browser cache\n• Update your browser\n• Check internet connection\n• Try incognito mode",
      '📱 Mobile Problems': "Mobile access issues?\n\n• Use latest browser version\n• Enable JavaScript\n• Allow cookies\n• Check data connection\n• Rotate screen orientation",
      '⬅️ Back': () => goBack(),
      '💬 Need Live Support?': () => showLiveSupportOptions()
    };

    const response = responses[option];
    if (typeof response === 'string') {
      addMessage(response);
      setTimeout(() => {
        addMessage("Did this solve your issue, or would you like to speak with our technical team?");
        showTechnicalFollowUpOptions();
      }, 1000);
    } else if (typeof response === 'function') {
      response();
    }
  };

  const handleFollowUpResponse = (option: string) => {
    switch (option) {
      case '💰 More Investment Info':
        showInvestmentOptions();
        setCurrentStep('investment_help');
        break;
      case '📊 More Account Info':
        showAccountOptions();
        setCurrentStep('account_help');
        break;
      case '🔧 More Technical Help':
        showTechnicalOptions();
        setCurrentStep('technical_help');
        break;
      case '👥 Contact Support':
        addMessage("I'll connect you with our support team. What's your name?");
        setCurrentStep('get_name');
        addToPath('get_name');
        break;
      case '💬 Live Support Now':
        showLiveSupportOptions();
        break;
      case '✅ I\'m all set!':
        addMessage("Great! Feel free to reach out if you need anything else. Happy investing! 🚀");
        setTimeout(() => {
          showReopenOptions();
        }, 1500);
        break;
      default:
        break;
    }
  };

  const handleSupportRequest = () => {
    addMessage(`Perfect ${userName}! Our support team will contact you at ${userEmail} within 24 hours.`);
    setTimeout(() => {
      addMessage("For immediate assistance, you can reach our team directly:");
      showLiveSupportOptions();
    }, 1000);
  };

  const showMainOptions = () => {
    setCurrentStep('welcome');
    const options = [
      '💰 Investment Plans',
      '📊 Account & Trading', 
      '🔧 Technical Support',
      '👥 Contact Support',
      '💬 Live Support'
    ];
    showOptions("What would you like to know about?", options);
  };

  const showInvestmentOptions = () => {
    const options = [
      '📈 Investment Plans',
      '💸 Profit Calculation', 
      '🔄 Withdrawal Process',
      '📋 Investment Requirements',
      '⬅️ Back',
      '💬 Need Live Support?'
    ];
    showOptions("Choose an investment topic:", options);
  };

  const showAccountOptions = () => {
    const options = [
      '🔐 Account Setup',
      '📱 Mobile Access',
      '🛡️ Security',
      '📄 Documents Needed', 
      '⬅️ Back',
      '💬 Need Live Support?'
    ];
    showOptions("What account help do you need?", options);
  };

  const showTechnicalOptions = () => {
    const options = [
      '🚫 Login Issues',
      '💳 Payment Problems',
      '📊 Display Errors',
      '📱 Mobile Problems',
      '⬅️ Back',
      '💬 Need Live Support?'
    ];
    showOptions("What technical issue are you facing?", options);
  };

  const showInvestmentFollowUpOptions = () => {
    const options = [
      '💰 More Investment Info',
      '📊 Account & Trading',
      '👥 Contact Support', 
      '💬 Live Support Now',
      '✅ I\'m all set!'
    ];
    showOptions("", options);
    setCurrentStep('follow_up');
  };

  const showAccountFollowUpOptions = () => {
    const options = [
      '📊 More Account Info',
      '💰 Investment Plans',
      '👥 Contact Support',
      '💬 Live Support Now',
      '✅ I\'m all set!'
    ];
    showOptions("", options);
    setCurrentStep('follow_up');
  };

  const showTechnicalFollowUpOptions = () => {
    const options = [
      '🔧 More Technical Help',
      '👥 Contact Support',
      '💬 Live Support Now',
      '✅ Issue resolved'
    ];
    showOptions("", options);
    setCurrentStep('follow_up');
  };

  const showLiveSupportOptions = () => {
    addMessage("Get instant help from our support team:");
  };

  const showReopenOptions = () => {
    const options = [
      '🔄 New Question',
      '💬 Live Support',
      '❌ Close Chat'
    ];
    showOptions("Need anything else?", options);
    setCurrentStep('reopen');
  };

  const showOptions = (question: string, options: string[]) => {
    if (question) {
      addMessage(question);
    }
    const optionsMessage = options.map(opt => `• ${opt}`).join('\n');
    addMessage(optionsMessage);
  };

  const formatMessage = (message: string) => {
    return message.split('\n').map((line, index) => {
      const lineString = String(line);
      if (lineString.startsWith('• ')) {
        return <div key={index} className="ml-4">{lineString}</div>;
      } else if (lineString.startsWith('**') && lineString.endsWith('**')) {
        return <strong key={index}>{lineString.replace(/\*\*/g, '')}</strong>;
      } else {
        return <div key={index}>{lineString}</div>;
      }
    });
  };

  // Get the last message for options display
  const lastMessage = conversation.length > 0 ? conversation[conversation.length - 1] : null;
  const lastMessageText = lastMessage?.message || '';

  return (
    <div className="chat-container fixed bottom-24 lg:bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <button 
        onClick={toggleChat} 
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 dark:bg-green-700 dark:hover:bg-green-600 hover:scale-110"
        aria-label="Open chat"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.771 9.771 0 01-4.205-.96l-3.794.947.97-3.762A7.98 7.98 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white shadow-2xl rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 font-bold rounded-t-lg flex justify-between items-center dark:from-green-700 dark:to-emerald-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>PesaPrime Assistant</span>
            </div>
            <button 
              onClick={toggleChat} 
              className="text-white text-xl hover:text-gray-200 transition"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 space-y-3 text-sm h-96 overflow-y-auto dark:text-gray-200">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.type === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {formatMessage(msg.message)}
                  </div>
                  <div className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Options - Always show for relevant steps */}
            {(currentStep === 'welcome' || currentStep.includes('help') || currentStep === 'follow_up' || currentStep === 'reopen') && (
              <div className="space-y-2 pt-2">
                {lastMessageText.split('\n')
                  .filter(line => typeof line === 'string' && line.startsWith('• '))
                  .map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option.replace('• ', ''))}
                      className="w-full text-left bg-white border border-gray-200 hover:bg-green-50 hover:border-green-200 text-gray-800 px-3 py-2 rounded-lg transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      {option.replace('• ', '')}
                    </button>
                  ))
                }
              </div>
            )}

            {/* Live Support Options */}
            {(lastMessageText.includes('Live Support') || lastMessageText.includes('instant help') || currentStep === 'get_email') && (
              <div className="space-y-3 pt-2">
                <a 
                  href="https://wa.me/254703412694" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 32 32"
                  >
                    <path d="M16 0C7.167 0 0 7.167 0 16c0 2.833 0.729 5.479 2.042 7.792L0 32l8.5-2.229A15.886 15.886 0 0016 32c8.833 0 16-7.167 16-16S24.833 0 16 0z"/>
                  </svg>
                  WhatsApp Support
                </a>
                
                <a 
                  href="https://t.me/shackro42" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.191c-.174.761-1.408 6.781-1.999 9.022-.191.722-.562.899-1.147.562-.319-.181-2.357-1.5-3.591-2.139-.599-.32-1.153-.64-1.153-.94 0-.219.279-.419.799-.64 3.191-1.5 5.312-2.481 5.912-2.681.299-.1.559-.019.679.219.24.461.181.641-.319 1.02z"/>
                  </svg>
                  Telegram Support
                </a>
                
                <p className="text-xs text-gray-500 text-center dark:text-gray-400">
                  Typically replies within 5 minutes
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQBot;