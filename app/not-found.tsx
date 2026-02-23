import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
        </div>

        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist. But we can help you find
          the mobile IV therapy providers you're searching for.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/providers"
            className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052cc] text-white font-semibold rounded-lg transition-colors text-center"
          >
            Browse Providers
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors text-center"
          >
            Back Home
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Having trouble finding what you need?{" "}
          <Link href="/#contact" className="text-[#0066FF] hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
