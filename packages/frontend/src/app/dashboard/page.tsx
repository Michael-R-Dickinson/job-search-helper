'use client'
import UploadFileInput from '@/components/UploadFileInput'
import { useRouter } from 'next/navigation'
import React from 'react'

const TEST_RESUME_URL =
  'https://us-east.storage.cloudconvert.com/tasks/9ff1bb85-be05-4d23-933c-13829bf04785/output.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20250517%2Fva%2Fs3%2Faws4_request&X-Amz-Date=20250517T045450Z&X-Amz-Expires=86400&X-Amz-Signature=ab70291aea981868ee6017c3816d1fbd3d68d43e4d58874e9f8ceae6a31b10d3&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22output.pdf%22&response-content-type=application%2Fpdf&x-id=GetObject'
const Dashboard = () => {
  const router = useRouter()
  return (
    <main className="grow mt-16">
      <div className="min-h-screen p-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            <div className="text-gray-600">No recent activity</div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() =>
                  router.push(`/resumeViewer?resumeUrl=${encodeURIComponent(TEST_RESUME_URL)}`)
                }
                className="hover:bg-blue-600 w-full px-4 py-2 text-white bg-blue-500 rounded"
              >
                Display Resume
              </button>
              <button className="hover:bg-gray-200 w-full px-4 py-2 text-gray-700 bg-gray-100 rounded">
                View All Projects
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-3xl p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Upload</h2>
          <UploadFileInput />
        </div>
      </div>
    </main>
  )
}

export default Dashboard
