// app/api/products/route.ts
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

interface Product {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  pricing_type?: string;
  archived?: boolean;
}

// Mock products for fallback
const MOCK_PRODUCTS: Product[] = [
  { product_id: 'prod_basic', name: 'Basic Plan', price: 999, currency: 'usd', description: 'Basic subscription plan' },
  { product_id: 'prod_premium', name: 'Premium Plan', price: 1999, currency: 'usd', description: 'Premium subscription plan' },
  { product_id: 'prod_pro', name: 'Pro Plan', price: 2999, currency: 'usd', description: 'Professional subscription plan' },
];

export async function GET(): Promise<NextResponse> {
  try {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT;
    
    if (!apiKey) {
      console.warn('DODO_PAYMENTS_API_KEY not configured, returning mock products');
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }

    console.log(`Using DodoPayments environment: ${environment}`);

    // Initialize DodoPayments client with the original environment value
    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: environment as 'test_mode' | 'live_mode', // Type assertion to match expected type
    });

    // Fetch all products
    const allProducts: Product[] = [];
    
    try {
      // Use the SDK's list method to get all products
      for await (const page of client.products.list()) {
        // Log the response structure to debug
        console.log('Product list response structure:', JSON.stringify(page, null, 2));
        
        // Check different possible response structures
        let products: Product[] = [];
        
        if (page && typeof page === 'object') {
          // Try different possible property names
          if ('items' in page && Array.isArray(page.items)) {
            products = page.items;
          } else if ('data' in page && Array.isArray(page.data)) {
            products = page.data;
          } else if ('products' in page && Array.isArray(page.products)) {
            products = page.products;
          } else if (Array.isArray(page)) {
            products = page;
          }
        }
        
        allProducts.push(...products);
      }
      
      console.log(`Successfully fetched ${allProducts.length} products from Dodo Payments`);
      
      // Filter out archived products
      const activeProducts = allProducts.filter(product => !product.archived);
      
      return NextResponse.json({ products: activeProducts });
    } catch (sdkError) {
      console.error('Error fetching products with DodoPayments SDK:', sdkError);
      
      // Fallback to mock products if SDK fails
      console.warn('DodoPayments SDK failed, returning mock products');
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }
  } catch (error) {
    console.error('Unexpected error in products API:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}