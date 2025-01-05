import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import { Footer } from "@/components/footer"
import { ToastProvider } from "@/components/ui/toast"
import "@/styles/globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexusBank',
  description: 'Your trusted banking partner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <Providers>
          <ToastProvider>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ToastProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

