"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveBookCustomization } from "@/lib/actions"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface BookImage {
  id: string
  originalUrl: string
  sketchUrl: string
}

interface BookCustomizerProps {
  bookId: string
  images: BookImage[]
}

export function BookCustomizer({ bookId, images }: BookCustomizerProps) {
  const router = useRouter()
  const [format, setFormat] = useState("standard")
  const [binding, setBinding] = useState("spiral")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const result = await saveBookCustomization({
        bookId,
        format,
        binding,
        quantity,
      })

      if (result.success) {
        router.push(`/checkout/${bookId}`)
      } else {
        console.error("Failed to save customization:", result.error)
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error saving customization:", err)
      setIsLoading(false)
    }
  }

  const calculatePrice = () => {
    let basePrice = 19.99

    // Format adjustments
    if (format === "large") basePrice += 5

    // Binding adjustments
    if (binding === "hardcover") basePrice += 10
    else if (binding === "perfect") basePrice += 5

    return (basePrice * quantity).toFixed(2)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview Pages</TabsTrigger>
            <TabsTrigger value="original">Original Images</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={image.sketchUrl || "/placeholder.svg"}
                      alt="Coloring book page preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="original" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={image.originalUrl || "/placeholder.svg"}
                      alt="Original image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="format">Book Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (8.5" x 11")</SelectItem>
                    <SelectItem value="large">Large (11" x 14")</SelectItem>
                    <SelectItem value="square">Square (8" x 8")</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="binding">Binding Type</Label>
                <Select value={binding} onValueChange={setBinding}>
                  <SelectTrigger id="binding">
                    <SelectValue placeholder="Select binding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spiral">Spiral Bound</SelectItem>
                    <SelectItem value="perfect">Perfect Bound</SelectItem>
                    <SelectItem value="hardcover">Hardcover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="1" value={quantity} onChange={handleQuantityChange} />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total Price:</span>
                  <span>${calculatePrice()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Includes {images.length} pages and shipping</p>
              </div>

              <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

