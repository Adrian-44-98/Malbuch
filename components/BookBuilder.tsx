"use client"

import { useState, useCallback, useMemo } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'
import { X, Plus, GripVertical } from 'lucide-react'
import Image from 'next/image'

interface BookImage {
  id: string
  originalUrl: string
  transformedUrl: string | null
  isTransforming: boolean
}

interface BookState {
  images: BookImage[]
  selectedSize: keyof typeof BOOK_SIZES
  selectedCover: string
}

const BOOK_SIZES = {
  A5: {
    name: 'A5',
    dimensions: '14.8 x 21.0 cm',
    pricePerPage: 0.5,
  },
  A4: {
    name: 'A4',
    dimensions: '21.0 x 29.7 cm',
    pricePerPage: 0.75,
  },
}

// Custom hook for image processing
function useImageProcessor() {
  const compressImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      const img = new window.Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        const maxDimension = 1200
        let width = img.width
        let height = img.height
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }
        
        canvas.width = width
        canvas.height = height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        } else {
          reject(new Error('Failed to create canvas context'))
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      reader.onload = () => {
        img.src = reader.result as string
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }, [])

  const createSketchEffect = useCallback((base64Image: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const img = new window.Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      try {
        await new Promise((res, rej) => {
          img.onload = res
          img.onerror = rej
          img.src = base64Image
        })

        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = avg
            data[i + 1] = avg
            data[i + 2] = avg
            
            if (i > 0 && Math.abs(avg - data[i - 4]) > 30) {
              data[i] = 0
              data[i + 1] = 0
              data[i + 2] = 0
            } else {
              data[i] = 255
              data[i + 1] = 255
              data[i + 2] = 255
            }
          }
          
          ctx.putImageData(imageData, 0, 0)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        } else {
          reject(new Error('Failed to create canvas context'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }, [])

  return { compressImage, createSketchEffect }
}

// Custom hook for book state management
function useBookState() {
  const [state, setState] = useState<BookState>({
    images: [],
    selectedSize: 'A5',
    selectedCover: 'classic'
  })

  const pageCount = useMemo(() => 
    Math.max(8, Math.ceil(state.images.length / 2) * 2),
    [state.images.length]
  )

  const availableImageSlots = useMemo(() => 
    pageCount - 2,
    [pageCount]
  )

  const totalPrice = useMemo(() => 
    (pageCount * BOOK_SIZES[state.selectedSize].pricePerPage).toFixed(2),
    [pageCount, state.selectedSize]
  )

  const updateState = useCallback((updates: Partial<BookState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    state,
    pageCount,
    availableImageSlots,
    totalPrice,
    updateState
  }
}

export function BookBuilder() {
  const { compressImage, createSketchEffect } = useImageProcessor()
  const { state, pageCount, availableImageSlots, totalPrice, updateState } = useBookState()
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [showCoverSelector, setShowCoverSelector] = useState(false)

  const handleCoverSelect = useCallback((coverId: string) => {
    updateState({ selectedCover: coverId })
    setShowCoverSelector(false)
  }, [updateState])

  const transformImage = useCallback(async (imageId: string, base64Image: string) => {
    try {
      updateState({
        images: state.images.map(img => 
          img.id === imageId 
            ? { ...img, isTransforming: true }
            : img
        )
      })

      await new Promise(resolve => setTimeout(resolve, 1000))
      const transformedUrl = await createSketchEffect(base64Image)
      
      updateState({
        images: state.images.map(img => 
          img.id === imageId 
            ? { ...img, transformedUrl, isTransforming: false }
            : img
        )
      })

      toast.success('Image transformed successfully!')
    } catch (error) {
      console.error('Error transforming image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to transform image')
      updateState({
        images: state.images.map(img => 
          img.id === imageId 
            ? { ...img, isTransforming: false }
            : img
        )
      })
    }
  }, [state.images, updateState, createSketchEffect])

  const processFile = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File "${file.name}" is too large (max 10MB)`)
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error(`File "${file.name}" is not an image`)
      return
    }

    try {
      const base64Image = await compressImage(file)
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        originalUrl: base64Image,
        transformedUrl: null,
        isTransforming: false
      }
      
      updateState({ images: [...state.images, newImage] })
      toast.success(`Image "${file.name}" uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to upload "${file.name}"`)
    }
  }, [state.images, updateState, compressImage])

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    try {
      // Process each file
      for (const file of Array.from(files)) {
        await processFile(file)
      }
    } finally {
      setIsLoading(false)
      // Reset the file input
      event.target.value = ''
    }
  }, [])

  const handleDelete = (id: string) => {
    updateState({ images: state.images.filter(img => img.id !== id) })
    toast.success('Image removed')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    setIsLoading(true)
    try {
      for (const file of files) {
        await processFile(file)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Cover Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Book Cover</h3>
          <p className="text-sm text-gray-500">Choose a design for your book cover</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowCoverSelector(!showCoverSelector)}
        >
          {showCoverSelector ? 'Hide Options' : 'Change Cover'}
        </Button>
      </div>

      {showCoverSelector && (
        <CoverSelector 
          onSelect={handleCoverSelect}
          selectedCover={state.selectedCover}
        />
      )}

      {/* Image Grid */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {state.images.map((image) => (
          <div key={image.id} className="relative group">
            <Card className="aspect-square">
              <CardContent className="p-2">
                <div className="relative w-full h-full">
                  {image.isTransforming ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  ) : image.transformedUrl ? (
                    <Image
                      src={image.transformedUrl}
                      alt="Transformed"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <img
                      src={image.originalUrl}
                      alt="Original"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 p-1 bg-white/80 rounded-full">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {/* Add Image Button */}
        <label className="aspect-square">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Card 
            className={`w-full h-full cursor-pointer transition-colors ${
              isDragging ? 'bg-purple-50 border-purple-500 border-2 border-dashed' : 'hover:bg-gray-50'
            }`}
          >
            <CardContent className="p-2 h-full flex items-center justify-center">
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Add Images</p>
                <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              </div>
            </CardContent>
          </Card>
        </label>
      </div>

      {/* Book Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <p className="text-lg font-semibold">
            {pageCount} Page Book
          </p>
          <p className="text-sm text-gray-500">
            {state.images.length} of {availableImageSlots} images uploaded
            {state.images.length > availableImageSlots && (
              <span className="text-red-500 ml-2">(Maximum reached)</span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            Includes front cover and back page
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {Object.entries(BOOK_SIZES).map(([size, details]) => (
              <Button
                key={size}
                variant={state.selectedSize === size ? "default" : "outline"}
                onClick={() => updateState({ selectedSize: size as keyof typeof BOOK_SIZES })}
              >
                {details.name}
              </Button>
            ))}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">€{totalPrice}</p>
            <p className="text-sm text-gray-500">{BOOK_SIZES[state.selectedSize].dimensions}</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {state.images.length > 0 && (
        <div className="flex justify-end gap-4">
          <Button 
            size="lg" 
            onClick={transformAllImages}
            disabled={isTransforming || state.images.every(img => img.transformedUrl)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isTransforming ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Transforming...
              </div>
            ) : (
              'Transform Now'
            )}
          </Button>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!state.images.some(img => img.transformedUrl)}
          >
            Continue to Customize
          </Button>
        </div>
      )}
    </div>
  )
} 