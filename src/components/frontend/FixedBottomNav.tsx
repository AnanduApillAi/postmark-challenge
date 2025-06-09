import React, { useState, useEffect } from 'react';

export default function FixedBottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copiedItem, setCopiedItem] = useState('');

  const email = "testimonials@anandu.dev";
  const templateContent = `Using this service has been a game-changer for my workflow. The [specific feature] in particular has saved me countless hours, and the overall simplicity is just fantastic. I honestly can't recommend it enough!`;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    }
  }, [isModalOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-900 rounded-full px-6 py-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-6">
            {/* Edit Pencil Icon */}
            <button
              className="text-white hover:scale-110 transition-scale duration-200 cursor-pointer"
              title="Write your story"
              onClick={openModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path fill="white" d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
              </svg>
            </button>

            {/* GitHub Icon */}
            <button
              className="text-white hover:scale-110 transition-scale duration-200 cursor-pointer"
              title="View on GitHub"
              onClick={() => window.open('https://github.com/AnanduApillAi/postmark-challenge', '_blank')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
              }`}
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-out transform ${isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            style={{
              transformOrigin: '50% 100%'
            }}
          >
            {/* Header with Close button */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Share Your Story</h2>
                <p className="text-gray-600 text-sm mt-1">We&rsquo;d love to hear from you. Here&rsquo;s how to get started.</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 -mt-1 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200 mx-6"></div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Email Section */}
              <div className="relative">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg text-gray-900 font-mono text-sm">
                  {email}
                  <button
                    onClick={() => copyToClipboard(email, 'email')}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedItem === 'email' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Template Section */}
              <div className="relative">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                  {templateContent}
                  <button
                    onClick={() => copyToClipboard(templateContent, 'template')}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedItem === 'template' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">1. Send Your Testimonial</p>
                      <p className="text-sm text-gray-600">
                        Simply copy the email address and send us your story from your favorite mail client.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a2.83 2.83 0 0 0-2 5 2.83 2.83 0 0 0-5 2 2.83 2.83 0 0 0-2 5 2.83 2.83 0 0 0 2 5 2.83 2.83 0 0 0 5 2 2.83 2.83 0 0 0 2-5 2.83 2.83 0 0 0 5-2 2.83 2.83 0 0 0 2-5 2.83 2.83 0 0 0-2-5 2.83 2.83 0 0 0-5-2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">2. AI-Powered Curation</p>
                      <p className="text-sm text-gray-600">
                        Our AI assistant will read and analyze your email to ensure it&rsquo;s a genuine testimonial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 