import UploadFileInput from '@/components/UploadFileInput'
import React from 'react'

const Dashboard = () => {
  return (
    <main className="grow mt-16">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
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

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-gray-600">No recent activity</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                New Project
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                View All Projects
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Upload</h2>
          <UploadFileInput />
        </div>
      </div>
    </main>
  )
}

export default Dashboard
