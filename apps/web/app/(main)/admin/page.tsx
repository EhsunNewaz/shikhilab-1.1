import { Suspense } from 'react'
import AdminPanel from './AdminPanel'

interface AdminPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Admin Panel - Enrollment Management
              </h1>
              
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading admin panel...</span>
                </div>
              }>
                <AdminPanel />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Admin Panel - Shikhi Lab IELTS',
  description: 'Manage student enrollments and course capacity'
}