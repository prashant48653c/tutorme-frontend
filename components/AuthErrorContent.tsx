// components/AuthErrorContent.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You denied access to your Google account.";
      case "Verification":
        return "The verification token has expired or is invalid.";
      case "OAuthSignin":
        return "Error in constructing an authorization URL.";
      case "OAuthCallback":
        return "Error in handling the response from Google.";
      case "OAuthCreateAccount":
        return "Could not create user account with Google.";
      case "EmailCreateAccount":
        return "Could not create user account with email.";
      case "Callback":
        return "Error in the OAuth callback handler.";
      case "OAuthAccountNotLinked":
        return "Email already associated with another account.";
      case "EmailSignin":
        return "Sending the email with the verification token failed.";
      case "CredentialsSignin":
        return "The credentials provided are invalid.";
      case "SessionRequired":
        return "You must be signed in to access this page.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  const getErrorTitle = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Access Denied";
      case "OAuthAccountNotLinked":
        return "Account Already Exists";
      case "Configuration":
        return "Server Error";
      default:
        return "Authentication Error";
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{getErrorTitle(error)}</h1>

      <p className="text-gray-600 mb-8">{getErrorMessage(error)}</p>

      {error === "AccessDenied" && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">To continue:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Allow access to your Google account</li>
            <li>• Make sure you're using the correct Google account</li>
            <li>• Check your browser settings for blocked popups</li>
          </ul>
        </div>
      )}

      {error === "OAuthAccountNotLinked" && (
        <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-amber-900 mb-2">Account exists:</h3>
          <p className="text-sm text-amber-800">
            An account with this email already exists. Please sign in with your original method or contact support.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => router.push("/auth/signin")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}