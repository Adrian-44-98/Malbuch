import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  return NextResponse.json(
    { error: 'OpenAI API key not configured' },
    { status: 500 }
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    // Validate the image URL
    if (!imageUrl || !imageUrl.startsWith('data:image')) {
      console.error('Invalid image format received')
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    console.log('Starting image processing...')

    // Process the image with OpenAI
    try {
      // Convert base64 to buffer
      const base64Data = imageUrl.split(',')[1]
      const imageBuffer = Buffer.from(base64Data, 'base64')

      const response = await openai.images.edit({
        image: imageBuffer,
        prompt: "Convert this image to a black and white line drawing suitable for a coloring book. Make the lines bold and clear, remove all colors and shading.",
        n: 1,
        size: "1024x1024",
      })

      console.log('OpenAI response:', response)

      // Get the URL of the generated image
      const transformedImage = response.data[0].url

      if (!transformedImage) {
        console.error('No image URL in OpenAI response')
        return NextResponse.json(
          { error: 'No image generated' },
          { status: 500 }
        )
      }

      return NextResponse.json({ transformedImage })
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError.message, openaiError.response?.data)
      
      // Handle rate limits specifically
      if (openaiError.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        )
      }
      
      // Handle billing issues
      if (openaiError.status === 402) {
        return NextResponse.json(
          { error: 'Billing issue. Please check your OpenAI account.' },
          { status: 402 }
        )
      }

      return NextResponse.json(
        { error: `OpenAI API Error: ${openaiError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('General error in image processing:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    )
  }
} 