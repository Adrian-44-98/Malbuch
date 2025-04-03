import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderDetails } from "@/lib/book-service"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ConfirmationPageProps {
  params: {
    id: string
  }
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const orderId = params.id
  const orderDetails = await getOrderDetails(orderId)

  if (!orderDetails) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We've received your payment and will begin processing your coloring book right away.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order #{orderDetails.orderNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Order Date:</p>
                  <p className="text-gray-600">{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Total Amount:</p>
                  <p className="text-gray-600">${orderDetails.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Shipping Address:</p>
                  <p className="text-gray-600">{orderDetails.shippingAddress}</p>
                </div>
                <div>
                  <p className="font-medium">Estimated Delivery:</p>
                  <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">
                  You will receive an email confirmation at {orderDetails.email} with your order details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

