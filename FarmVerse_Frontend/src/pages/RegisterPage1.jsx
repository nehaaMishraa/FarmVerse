import React from 'react';
// The <Link> component was causing an error because it was being rendered outside of the main router context.
// I've replaced it with a standard <a> tag which will work everywhere.
// import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Farmer Account
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Ramesh Kumar"
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Rajasthan"
              />
            </div>
            <div>
              <label
                htmlFor="district"
                className="text-sm font-medium text-gray-700"
              >
                District / Panchayat
              </label>
              <input
                id="district"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Jaipur / Dahmi Kalan"
              />
            </div>
            <div>
              <label
                htmlFor="farmSize"
                className="text-sm font-medium text-gray-700"
              >
                Farm Size (in Acres)
              </label>
              <input
                id="farmSize"
                type="number"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 5"
              />
            </div>
          </div>

          {/* Full-width button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

