'use client'

import { useState, useEffect } from 'react'
import { EnrollmentForm } from '../components/EnrollmentForm'

export default function HomePage() {
  const [showEnrollment, setShowEnrollment] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            IELTS Learning Platform
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master IELTS with Confidence
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our comprehensive IELTS preparation course and achieve your target score with expert guidance and proven strategies.
          </p>
          
          {!isOnline && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md mx-auto">
              <p className="font-medium">Internet connection required</p>
              <p className="text-sm">Please connect to the internet to apply for the course.</p>
            </div>
          )}

          <button
            onClick={() => setShowEnrollment(!showEnrollment)}
            disabled={!isOnline}
            className={`
              px-8 py-4 text-xl font-semibold rounded-lg transition-all duration-300
              ${isOnline 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            {showEnrollment ? 'Hide Application' : 'Enroll Now'}
          </button>
        </div>

        {/* Course Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Comprehensive Curriculum</h3>
            <p className="text-gray-600">
              Complete coverage of all IELTS modules: Listening, Reading, Writing, and Speaking with expert-designed materials.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from certified IELTS trainers with years of experience and proven track records of student success.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized Approach</h3>
            <p className="text-gray-600">
              Tailored study plans and one-on-one feedback sessions to address your specific strengths and weaknesses.
            </p>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">What You&apos;ll Get</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">📖 Study Materials</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Latest IELTS practice tests and exercises</li>
                <li>• Comprehensive vocabulary and grammar guides</li>
                <li>• Sample answers and model responses</li>
                <li>• Digital resources and mobile app access</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">🎓 Learning Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Weekly progress assessments</li>
                <li>• Individual feedback on writing tasks</li>
                <li>• Speaking practice sessions</li>
                <li>• 24/7 online support community</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 md:p-12 text-white text-center mb-16">
          <h3 className="text-3xl font-bold mb-6">Course Information</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-2">Duration</h4>
              <p className="text-blue-100">8 weeks intensive program</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Schedule</h4>
              <p className="text-blue-100">Flexible weekday & weekend options</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Batch Size</h4>
              <p className="text-blue-100">Limited seats for personalized attention</p>
            </div>
          </div>
        </div>

        {/* Enrollment Form */}
        {showEnrollment && (
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Apply Now</h3>
            <EnrollmentForm />
          </div>
        )}
      </section>
    </div>
  )
}