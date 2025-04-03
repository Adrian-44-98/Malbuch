import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { amount, currency = 'eur' } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}

// Webhook handler for Stripe events
export async function PUT(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
} 