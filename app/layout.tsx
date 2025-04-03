import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personalized Coloring Books",
  description: "Create your own personalized coloring books from your photos",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
              <div className="font-bold text-xl">ColorMyBook</div>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a href="/" className="hover:text-purple-600 transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/create" className="hover:text-purple-600 transition-colors">
                      Create
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          {children}
          <footer className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">ColorMyBook</h3>
                  <p className="text-gray-600">Create personalized coloring books from your favorite photos.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                  <p className="text-gray-600">Have questions? Reach out to our support team.</p>
                  <p className="text-gray-600 mt-2">support@colormybook.com</p>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 text-center text-gray-600">
                <p>© {new Date().getFullYear()} ColorMyBook. All rights reserved.</p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'