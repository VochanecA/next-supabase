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
  [key: string]: unknown;
}

interface DodoPaymentsProduct {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  pricing_type?: string;
  archived?: boolean;
  price_detail?: {
    price: number;
    currency: string;
    tax_inclusive: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

type DodoPaymentsResponse =
  | DodoPaymentsProduct[]
  | { items: DodoPaymentsProduct[] }
  | { data: DodoPaymentsProduct[] }
  | { products: DodoPaymentsProduct[] }
  | DodoPaymentsProduct;

const MOCK_PRODUCTS: Product[] = [
  { product_id: 'prod_basic', name: 'Basic Plan', price: 9.99, currency: 'usd', description: 'Basic subscription plan' },
  { product_id: 'prod_premium', name: 'Premium Plan', price: 19.99, currency: 'usd', description: 'Premium subscription plan' },
  { product_id: 'prod_pro', name: 'Pro Plan', price: 29.99, currency: 'usd', description: 'Professional subscription plan' },
];

function normalizeResponse(page: DodoPaymentsResponse): DodoPaymentsProduct[] {
  if (Array.isArray(page)) return page;

  if (page && typeof page === 'object') {
    if ('items' in page && Array.isArray(page.items)) return page.items;
    if ('data' in page && Array.isArray(page.data)) return page.data;
    if ('products' in page && Array.isArray(page.products)) return page.products;
    return [page as DodoPaymentsProduct]; // single object fallback
  }

  return [];
}

export async function GET(): Promise<NextResponse> {
  try {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode';

    if (!apiKey) {
      console.warn('DODO_PAYMENTS_API_KEY not configured, returning mock products');
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }

    console.log(`Using DodoPayments environment: ${environment}`);

    const client = new DodoPayments({ bearerToken: apiKey, environment });

    const allProducts: Product[] = [];

    try {
      for await (const page of client.products.list() as AsyncIterable<DodoPaymentsResponse>) {
        console.log('Fetched page from DodoPayments SDK:', JSON.stringify(page, null, 2));

        const products = normalizeResponse(page);

        const transformedProducts: Product[] = products.map((product) => {
          // prefer price_detail.price (cents), fallback to price
          const rawPrice =
            product.price_detail && typeof product.price_detail === 'object' && 'price' in product.price_detail
              ? product.price_detail.price
              : product.price;

          return {
            product_id: product.product_id,
            name: product.name,
            price: rawPrice ? rawPrice / 100 : 0, // normalize cents → dollars
            currency: product.currency,
            description: product.description,
            pricing_type: product.pricing_type,
            archived: product.archived,
          };
        });

        allProducts.push(...transformedProducts);
      }

      const activeProducts = allProducts.filter((product) => !product.archived);

      console.log(`Successfully fetched ${activeProducts.length} active products from DodoPayments`);

      return NextResponse.json({ products: activeProducts });
    } catch (sdkError: unknown) {
      console.error('Error fetching products with DodoPayments SDK:', sdkError);
      return NextResponse.json({ products: MOCK_PRODUCTS });
    }
  } catch (error: unknown) {
    console.error('Unexpected error in products API:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}
