import { CustomerPortal } from '@dodopayments/nextjs';
import { getEnvironment, getRequiredApiKey } from '@/lib/env';

export const GET = CustomerPortal({
  bearerToken: getRequiredApiKey(),
  environment: getEnvironment(),
});