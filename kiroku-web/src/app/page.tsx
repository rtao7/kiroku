import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kiroku
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Save links for later, access them anywhere
          </p>
          
          <div className="space-y-4">
            <a
              href="/api/auth/signin"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Sign In with Google
            </a>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to sync your saved links across all devices
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• Chrome extension integration</li>
            <li>• Cross-device synchronization</li>
            <li>• Search and organize links</li>
            <li>• Export your data anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
