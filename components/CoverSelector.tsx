import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Image from 'next/image'

interface CoverOption {
  id: string
  title: string
  imageUrl: string
  description: string
}

const COVER_OPTIONS: CoverOption[] = [
  {
    id: 'classic',
    title: 'Classic Cover',
    imageUrl: '/covers/classic.jpg',
    description: 'A timeless design with elegant typography'
  },
  {
    id: 'modern',
    title: 'Modern Cover',
    imageUrl: '/covers/modern.jpg',
    description: 'Clean and contemporary design'
  },
  {
    id: 'playful',
    title: 'Playful Cover',
    imageUrl: '/covers/playful.jpg',
    description: 'Fun and colorful design perfect for kids'
  },
  {
    id: 'minimal',
    title: 'Minimal Cover',
    imageUrl: '/covers/minimal.jpg',
    description: 'Simple and sophisticated design'
  }
]

interface CoverSelectorProps {
  onSelect: (coverId: string) => void
  selectedCover?: string
}

export function CoverSelector({ onSelect, selectedCover }: CoverSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Cover Design</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COVER_OPTIONS.map((cover) => (
          <Card 
            key={cover.id}
            className={`cursor-pointer transition-all ${
              selectedCover === cover.id ? 'ring-2 ring-purple-600' : 'hover:shadow-lg'
            }`}
            onClick={() => onSelect(cover.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-[3/4] relative mb-2">
                <Image
                  src={cover.imageUrl}
                  alt={cover.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h4 className="font-medium">{cover.title}</h4>
              <p className="text-sm text-gray-500">{cover.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 