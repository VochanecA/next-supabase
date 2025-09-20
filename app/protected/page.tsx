import { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProtectedDashboard } from "@/components/protected-dashboard";
// import ProtectedLayout from "./layout";
import type { JwtPayload } from "@supabase/supabase-js";

// Type-safe interface for user claims
interface UserClaims {
  email?: string;
  aud?: string; // Change from string | string[] to just string
  sub?: string;
  [key: string]: unknown;
}
// Data interfaces matching your database schema
interface Product {
  product_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
}

interface Subscription {
  subscription_id: string;
  subscription_status: string;
  quantity?: number | null;
  currency?: string | null;
  start_date?: string | null;
  next_billing_date?: string | null;
  trial_end_date?: string | null;
  product?: Product | null;
}

interface Transaction {
  transaction_id: string;
  status: string;
  amount?: number | null;
  currency?: string | null;
  billed_at?: string | null;
  payment_method?: string | null;
  card_last_four?: string | null;
  card_network?: string | null;
  card_type?: string | null;
}

// Type definitions for Supabase responses
interface SupabaseProduct {
  product_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
}


interface SupabaseCustomer {
  customer_id: string;
}

// Real data fetching functions using your Supabase schema
async function fetchUserSubscriptions(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  customerEmail: string
): Promise<Subscription[]> {
  try {
    // First, get the customer_id from the email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('email', customerEmail)
      .single();

    if (customerError || !customer) {
      // console.error('Error fetching subscriptions: Customer not found for email:', customerEmail, customerError);
      return [];
    }

    // Fetch subscriptions and products separately for better type safety
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select(`
        subscription_id,
        subscription_status,
        quantity,
        currency,
        start_date,
        next_billing_date,
        trial_end_date,
        product_id
      `)
      .eq('customer_id', (customer as SupabaseCustomer).customer_id)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      return [];
    }

    if (!subscriptions || subscriptions.length === 0) {
      return [];
    }

    // Get all unique product IDs
    const productIds = subscriptions
      .map(sub => sub.product_id)
      .filter((id): id is string => id !== null);

    // Fetch products if we have product IDs
    let products: SupabaseProduct[] = [];
    if (productIds.length > 0) {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('product_id, name, description, price, currency')
        .in('product_id', productIds);

      if (!productsError && productsData) {
        products = productsData;
      }
    }

    // Create a product lookup map
    const productMap = new Map<string, SupabaseProduct>();
    products.forEach(product => {
      productMap.set(product.product_id, product);
    });

    // Transform the data to match our interface
    const transformedSubscriptions: Subscription[] = subscriptions.map(sub => {
      const product = sub.product_id ? productMap.get(sub.product_id) : null;
      
      return {
        subscription_id: sub.subscription_id,
        subscription_status: sub.subscription_status,
        quantity: sub.quantity,
        currency: sub.currency,
        start_date: sub.start_date,
        next_billing_date: sub.next_billing_date,
        trial_end_date: sub.trial_end_date,
        product: product ? {
          product_id: product.product_id,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency
        } : null
      };
    });

    return transformedSubscriptions;
  } catch (error) {
    console.error('Unexpected error fetching subscriptions:', error);
    return [];
  }
}

async function fetchUserTransactions(
  supabase: Awaited<ReturnType<typeof createClient>>, 
  customerEmail: string
): Promise<Transaction[]> {
  try {
    // First, get the customer_id from the email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('email', customerEmail)
      .single();

    if (customerError || !customer) {
      // console.error('Error fetching transactions: Customer not found for email:', customerEmail, customerError);
      return [];
    }

    // Then fetch transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        transaction_id,
        status,
        amount,
        currency,
        payment_method,
        card_last_four,
        card_network,
        card_type,
        billed_at
      `)
      .eq('customer_id', (customer as SupabaseCustomer).customer_id)
      .order('billed_at', { ascending: false })
      .limit(20);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return [];
    }

    return transactions || [];
  } catch (error) {
    console.error('Unexpected error fetching transactions:', error);
    return [];
  }
}

export default async function ProtectedPage(): Promise<JSX.Element> {
  // Create server-side Supabase client
  const supabase = await createClient();
  
  // Get user claims using the same method as your middleware
  const { data, error } = await supabase.auth.getClaims();

  // Redirect to login if no valid claims (matching middleware logic)
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const jwtClaims: JwtPayload = data.claims;
  
  // Create user object from claims with proper type handling
  const user: UserClaims = {
    ...jwtClaims,
    aud: Array.isArray(jwtClaims.aud) ? jwtClaims.aud[0] : jwtClaims.aud,
  };

  // Ensure we have a user email for database queries
  if (!user.email) {
    console.error('No email found in user claims');
    redirect("/auth/login");
  }

  // Fetch user-specific data server-side using email as the lookup key
  const userEmail = user.email;
  
  try {
    const [subscriptions, transactions] = await Promise.all([
      fetchUserSubscriptions(supabase, userEmail),
      fetchUserTransactions(supabase, userEmail)
    ]);
    
    // Always return the dashboard, which now handles empty data
    return (
      <ProtectedDashboard 
        user={user}
        subscriptions={subscriptions}
        transactions={transactions}
      />
    );
  } catch (fetchError) {
    console.error('Error fetching user data:', fetchError);
    
    // Return dashboard with empty data if fetch fails
    return (
      <ProtectedDashboard 
        user={user}
        subscriptions={[]}
        transactions={[]}
      />
    );
  }
}
