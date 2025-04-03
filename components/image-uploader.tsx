"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { uploadImages } from "@/lib/actions"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

export function ImageUploader() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      // Validate file types
      const invalidFiles = selectedFiles.filter((file) => !file.type.startsWith("image/"))

      if (invalidFiles.length > 0) {
        setError("Please upload image files only.")
        return
      }

      // Create preview URLs
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))

      setFiles((prev) => [...prev, ...selectedFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("images", file)
      })

      const result = await uploadImages(formData)

      if (result.success && result.bookId) {
        // Clean up preview URLs
        previews.forEach((preview) => URL.revokeObjectURL(preview))

        // Redirect to the customize page
        router.push(`/customize/${result.bookId}`)
      } else {
        setError(result.error || "Failed to upload images. Please try again.")
        setIsUploading(false)
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("An error occurred while uploading. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag and drop your images here</h3>
        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button variant="outline" type="button">
          Select Files
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Selected Images ({previews.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <Card key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isUploading || files.length === 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Customization"
          )}
        </Button>
      </div>
    </div>
  )
}

