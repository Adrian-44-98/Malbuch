"use server"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Renamed and modified to create the initial order record with image URLs
export async function createOrderWithImages(userId: string, imageUrls: string[]) {
  try {
    if (!imageUrls || imageUrls.length === 0) {
      return { success: false, error: "No image URLs provided" }
    }
    if (!userId) {
      return { success: false, error: "User ID is required" }
    }

    // Create a new order record in the database
    const newOrder = await prisma.order.create({
      data: {
        userId: userId, // TODO: Get actual user ID from session/auth
        images: JSON.stringify(imageUrls), // Store the provided URLs
        status: "pending_customization", // Initial status
        customization: {}, // Start with empty customization
        // stripePaymentId will be set later
      },
    });

    console.log("Created new order:", newOrder.id);
    return { success: true, orderId: newOrder.id }; // Return the actual order ID

  } catch (error) {
    console.error("Error creating order with images:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return { success: false, error: errorMessage };
  }
}

interface CustomizationData {
  bookId: string
  format: string
  binding: string
  quantity: number
}

// Function to calculate price based on customization
function calculateOrderPrice(format: string, binding: string, quantity: number): number {
  let basePrice = 19.99 // Base price for a standard book

  // Format adjustments
  if (format === "large") basePrice += 5
  else if (format === "square") basePrice += 2 // Assuming square format has a price adjustment

  // Binding adjustments
  if (binding === "hardcover") basePrice += 10
  else if (binding === "perfect") basePrice += 5
  // Assuming spiral is the base binding included in basePrice

  // Calculate total price
  const totalPrice = basePrice * quantity;
  // Return price rounded to 2 decimal places
  return Math.round(totalPrice * 100) / 100;
}

export async function saveBookCustomization(data: CustomizationData) {
  const { bookId, format, binding, quantity } = data;

  try {
    // 1. Validate the input data (add more validation as needed)
    if (!bookId || !format || !binding || quantity <= 0) {
      throw new Error("Invalid customization data provided.");
    }

    // 2. Calculate the final price
    const totalPrice = calculateOrderPrice(format, binding, quantity);

    // 3. Save the customization options and calculated price to the database
    const updatedOrder = await prisma.order.update({
      where: { id: bookId },
      data: {
        customization: { format, binding, quantity }, // Store customization as JSON
        totalPrice: totalPrice, // Save the calculated price
        status: 'customized', // Update status to reflect customization
      },
    });

    if (!updatedOrder) {
      throw new Error(`Order with ID ${bookId} not found.`);
    }

    console.log(`Customization saved for Order ID: ${bookId}`, updatedOrder);
    return { success: true };

  } catch (error) {
    console.error("Error saving customization:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save customization";
    return { success: false, error: errorMessage };
  }
}

export async function createPaymentIntent(data: {
  bookId: string
  amount: number
  email: string
  name: string
  address: {
    line1: string
    city: string
    state: string
    postal_code: string
  }
}) {
  try {
    // In a real implementation, you would:
    // 1. Create a payment intent with Stripe
    // 2. Return the client secret for the frontend to complete the payment
    // 3. Save the order details to your database

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a random order ID
    const orderId = `order_${Date.now()}`

    return { success: true, orderId }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return { success: false, error: "Failed to process payment" }
  }
}

