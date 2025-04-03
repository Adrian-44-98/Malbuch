import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface BookDetails {
  id: string
  format: string
  binding: string
  quantity: number
  totalPrice: number
  pageCount: number
  previewImage: string
}

interface OrderSummaryProps {
  bookDetails: BookDetails
}

export function OrderSummary({ bookDetails }: OrderSummaryProps) {
  const formatLabels = {
    standard: 'Standard (8.5" x 11")',
    large: 'Large (11" x 14")',
    square: 'Square (8" x 8")',
  }

  const bindingLabels = {
    spiral: "Spiral Bound",
    perfect: "Perfect Bound",
    hardcover: "Hardcover",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative h-24 w-24 rounded-md overflow-hidden">
            <Image
              src={bookDetails.previewImage || "/placeholder.svg"}
              alt="Coloring book preview"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">Personalized Coloring Book</h3>
            <p className="text-sm text-gray-500">{bookDetails.pageCount} pages</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Format:</span>
            <span>{formatLabels[bookDetails.format as keyof typeof formatLabels]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Binding:</span>
            <span>{bindingLabels[bookDetails.binding as keyof typeof bindingLabels]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Quantity:</span>
            <span>{bookDetails.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price per book:</span>
            <span>${(bookDetails.totalPrice / bookDetails.quantity).toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${bookDetails.totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Includes shipping and handling</p>
        </div>
      </CardContent>
    </Card>
  )
}

