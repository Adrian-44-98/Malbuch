import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { getBookDetails } from "@/lib/book-service"
import { notFound } from "next/navigation"

interface CheckoutPageProps {
  params: {
    id: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const bookId = params.id
  const bookDetails = await getBookDetails(bookId)

  if (!bookDetails) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderSummary bookDetails={bookDetails} />
        <CheckoutForm bookId={bookId} amount={bookDetails.totalPrice} />
      </div>
    </div>
  )
}

