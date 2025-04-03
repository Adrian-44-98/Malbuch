import { BookCustomizer } from "@/components/book-customizer"
import { getBookImages } from "@/lib/book-service"
import { notFound } from "next/navigation"

interface CustomizePageProps {
  params: {
    id: string
  }
}

export default async function CustomizePage({ params }: CustomizePageProps) {
  const bookId = params.id
  const bookData = await getBookImages(bookId)

  if (!bookData) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Customize Your Coloring Book</h1>
      <BookCustomizer bookId={bookId} images={bookData.images} />
    </div>
  )
}

