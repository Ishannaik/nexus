import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">&copy; 2023 NexusBank. All rights reserved.</p>
          </div>
          <nav className="flex space-x-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

