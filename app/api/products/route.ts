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

interface DodoPaymentsConfig {
  bearerToken: string;
  environment: 'test_mode' | 'live_mode';
}

interface DodoPaymentsProduct {
  product_id: string;
  name: string;
  price: number; // Assuming price is in cents from DodoPayments
  currency: string;
  description?: string;
  pricing_type?: string;
  archived?: boolean;
  // Add other possible properties from DodoPayments response
  [key: string]: unknown;
}

type DodoPaymentsResponse = 
  | { items: DodoPaymentsProduct[] }
  | { data: DodoPaymentsProduct[] }
  | { products: DodoPaymentsProduct[] }
  | DodoPaymentsProduct[];

// Mock products for fallback
const MOCK_PRODUCTS: Product[] = [
  { 
    product_id: 'prod_basic', 
    name: 'Basic Plan', 
    price: 9.99, 
    currency: 'usd', 
    description: 'Basic subscription plan' 
  },
  { 
    product_id: 'prod_premium', 
    name: 'Premium Plan', 
    price: 19.99, 
    currency: 'usd', 
    description: 'Premium subscription plan' 
  },
  { 
    product_id: 'prod_pro', 
    name: 'Pro Plan', 
    price: 29.99, 
    currency: 'usd', 
    description: 'Professional subscription plan' 
  },
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

    // Initialize DodoPayments client with proper type checking
    const config: DodoPaymentsConfig = {
      bearerToken: apiKey,
      environment: environment === 'live_mode' ? 'live_mode' : 'test_mode',
    };

    const client = new DodoPayments(config);

    // Fetch all products
    const allProducts: Product[] = [];
    
    try {
      // Use the SDK's list method to get all products
      for await (const page of client.products.list() as AsyncIterable<DodoPaymentsResponse>) {
        // Log the response structure to debug
        console.log('Product list response structure:', JSON.stringify(page, null, 2));
        
        // Check different possible response structures with proper type guards
        let products: DodoPaymentsProduct[] = [];
        
        if (Array.isArray(page)) {
          products = page;
        } else if (page && typeof page === 'object') {
          if ('items' in page && Array.isArray(page.items)) {
            products = page.items;
          } else if ('data' in page && Array.isArray(page.data)) {
            products = page.data;
          } else if ('products' in page && Array.isArray(page.products)) {
            products = page.products;
          }
        }
        
        // Transform products to convert price from cents to dollars
        const transformedProducts: Product[] = products.map((product: DodoPaymentsProduct) => ({
          product_id: product.product_id,
          name: product.name,
          price: product.price ? product.price / 100 : 0, // Convert cents to dollars
          currency: product.currency,
          description: product.description,
          pricing_type: product.pricing_type,
          archived: product.archived,
        }));
        
        allProducts.push(...transformedProducts);
      }
      
      console.log(`Successfully fetched ${allProducts.length} products from Dodo Payments`);
      
      // Filter out archived products
      const activeProducts = allProducts.filter((product: Product) => !product.archived);
      
      return NextResponse.json({ products: activeProducts });
    } catch (sdkError: unknown) {
      console.error('Error fetching products with DodoPayments SDK:', sdkError);
      
      // Fallback to mock products if SDK fails
      console.warn('DodoPayments SDK failed, returning mock products');
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }
  } catch (error: unknown) {
    console.error('Unexpected error in products API:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}