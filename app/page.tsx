import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookBuilder } from "@/components/BookBuilder"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full bg-gradient-to-b from-white to-gray-100 py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Create Your Own Personalized Coloring Books
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Upload your favorite photos and transform them into beautiful coloring book pages. Customize your book and
              have it delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="#upload">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="upload" className="w-full bg-white py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Transform Your Photos
            </h2>
            <div className="w-full max-w-4xl">
              <BookBuilder />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full bg-gray-50 py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">1. Upload Photos</h3>
                  <p className="text-gray-500">
                    Upload your favorite photos. We'll transform them into beautiful coloring book pages.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">2. Customize Your Book</h3>
                  <p className="text-gray-500">
                    Choose your book size and customize the layout. Preview your coloring book before ordering.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">3. Receive Your Book</h3>
                  <p className="text-gray-500">
                    We'll print and ship your personalized coloring book directly to your doorstep.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Coloring Books?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 mr-2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>High-quality paper that's perfect for coloring</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 mr-2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Personalized with your own images</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 mr-2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Multiple binding options to choose from</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-purple-600 mr-2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Makes a perfect gift for all ages</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Coloring book example"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

