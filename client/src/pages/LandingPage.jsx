import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Empathy AI — <span className="text-blue-600">mental health support</span> that truly listens
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Experience compassionate AI conversations, guided meditations, and connect with licensed therapists — all in one supportive, confidential space designed for your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => nav('/signup')}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-blue-600 text-white font-semibold text-base sm:text-lg shadow-lg hover:bg-blue-700 transition-colors"
              >
                Start Your Journey
              </button>
              <button
                onClick={() => nav('/login')}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-blue-600 text-blue-600 font-semibold text-base sm:text-lg bg-white hover:bg-blue-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Empathetic AI Chat</h3>
                <p className="text-gray-700 mb-4">Share your feelings and receive supportive, understanding responses powered by advanced AI.</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">You: I'm feeling overwhelmed today...</div>
                  <div className="p-3 rounded-md bg-blue-100 text-blue-800 text-sm">
                    EmpathyAI: I hear you. It's completely normal to feel overwhelmed sometimes. Would you like to talk about what's on your mind?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Mental Health Support</h2>
            <p className="text-lg md:text-xl text-gray-600">Everything you need for your mental wellness journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Conversations</h3>
              <p className="text-gray-600">24/7 empathetic chat support with advanced language models that understand and validate your feelings.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🧘</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Guided Meditations</h3>
              <p className="text-gray-600">Access a library of calming meditations designed to reduce stress and promote mindfulness.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Therapy</h3>
              <p className="text-gray-600">Connect with licensed therapists for personalized sessions and ongoing support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg md:text-xl text-gray-600">Real experiences from people finding support</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anonymous User</h4>
                  <p className="text-gray-600">Patient</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"The AI chat feature has been incredibly helpful during difficult times. It feels like talking to a caring friend who really understands."</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dr. Sarah M.</h4>
                  <p className="text-gray-600">Licensed Therapist</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"This platform makes it easier to provide consistent care and track patient progress. The meditation resources are a great addition."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Empathy AI</h3>
              <p className="text-gray-400">Supporting mental health through technology and compassion.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Chat Support</li>
                <li>Guided Meditations</li>
                <li>Therapy Sessions</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <p className="text-gray-400 text-sm">
                If you're in crisis, please contact emergency services or call the National Suicide Prevention Lifeline at 988.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Empathy AI. All rights reserved. This is not a substitute for professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
