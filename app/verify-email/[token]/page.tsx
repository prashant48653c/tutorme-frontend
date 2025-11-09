"use client"
import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
const EmailVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending'); 
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const param =useParams();
  const [verificationToken] = useState(param.token);

  useEffect(() => {
    let timer:any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (verificationToken) {
      handleVerifyEmail();
    }
  }, [verificationToken]);

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth/verify-email/' + verificationToken, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const scenarios = ['success', 'expired', 'invalid'];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      if (randomScenario === 'success') {
        setVerificationStatus('success');
        setMessage('Your email has been successfully verified! You can now access your account.');
      } else if (randomScenario === 'expired') {
        setVerificationStatus('expired');
        setMessage('This verification link has expired. Please request a new verification email.');
        setShowEmailInput(true);
      } else {
        setVerificationStatus('error');
        setMessage('Invalid or expired verification token. Please try again or request a new verification email.');
        setShowEmailInput(true);
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('An error occurred while verifying your email. Please try again.');
      setShowEmailInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setMessage('');

    try {
      const response = await fetch('/auth/resend-verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage('A new verification email has been sent to your email address. Please check your inbox and spam folder.');
      setCountdown(60); 
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Mail className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
      case 'expired':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`bg-white rounded-lg shadow-lg border-2 ${getStatusColor()} p-8 text-center`}>
          <div className="mb-6">
            {getStatusIcon()}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {verificationStatus === 'success' ? 'Email Verified!' : 'Verify Your Email'}
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
              <span className="text-gray-600">Verifying your email...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {verificationStatus === 'pending' && 'Please wait while we verify your email address.'}
                {verificationStatus === 'success' && 'Your email address has been successfully verified.'}
                {(verificationStatus === 'error' || verificationStatus === 'expired') && 
                  'We couldn\'t verify your email address. The link may be expired or invalid.'}
              </p>

              {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                  verificationStatus === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {message}
                </div>
              )}
            </>
          )}

          {showEmailInput && (
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {email && verificationStatus === 'success' && (
            <div className="bg-gray-100 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600 mb-1">Verified Email:</p>
              <p className="font-medium text-gray-800">{email}</p>
            </div>
          )}

          <div className="space-y-3">
            {verificationStatus === 'success' ? (
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Continue to Dashboard
              </button>
            ) : (
              <>
                {(verificationStatus === 'error' || verificationStatus === 'expired') && (
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending || countdown > 0 || !email}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleVerifyEmail}
                  disabled={isLoading}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setShowEmailInput(true)}
                className="text-blue-600 hover:underline"
              >
                enter your email address
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;