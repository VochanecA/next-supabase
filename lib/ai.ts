// lib/ai.ts
import { createClient as createBrowserClient } from './supabase/client';
import { createClient as createServerClient } from '../server'; // adjust import path
import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
// import type { Database } from '@/lib/types'; // <-- use if you have supabase types

// ---------------------------
// Types
// ---------------------------
export type AIModelProvider = 'openrouter' | 'anthropic' | 'openai' | 'gemini' | 'deepseek';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  provider?: AIModelProvider;
  model?: string;
  stream?: boolean;
}

export interface AIResponse {
  role: 'assistant';
  content: string;
}

interface ProviderConfig {
  baseUrl: string;
}

const PROVIDER_CONFIG: Record<AIModelProvider, ProviderConfig> = {
  openai: { baseUrl: 'https://api.openai.com/v1' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1' },
  deepseek: { baseUrl: 'https://api.deepseek.com/v1' },
};

const DEFAULT_MODELS: Record<AIModelProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20240620',
  gemini: 'gemini-1.5-pro',
  openrouter: 'openai/gpt-4o-mini',
  deepseek: 'deepseek-chat',
};

// ---------------------------
// Supabase helper: get API key
// ---------------------------
async function getApiKey(
  provider: AIModelProvider,
  isServer = false,
): Promise<string> {
  let supabase: SupabaseClient;

  if (isServer) {
    supabase = await createServerClient();
  } else {
    supabase = createBrowserClient();
  }

  // Example: table `ai_keys` with { provider, key }
  const { data, error }: { data: { key: string } | null; error: PostgrestError | null } =
    await supabase.from('ai_keys').select('key').eq('provider', provider).single();

  if (error || !data?.key) {
    throw new Error(`Missing API key for provider ${provider}: ${error?.message ?? 'not found'}`);
  }

  return data.key;
}

// ---------------------------
// Provider response types
// ---------------------------
interface OpenAIResponse {
  choices: Array<{ message: { content: string } }>;
}

interface AnthropicResponse {
  content: Array<{ text: string }>;
}

interface GeminiResponse {
  candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
}

type AIProviderResponse = OpenAIResponse | AnthropicResponse | GeminiResponse;

// ---------------------------
// Main function
// ---------------------------
export async function callAI(req: AIRequest, isServer = false): Promise<AIResponse> {
  const provider: AIModelProvider = req.provider ?? 'deepseek';
  const { baseUrl } = PROVIDER_CONFIG[provider];

  const apiKey = await getApiKey(provider, isServer);

  const model = req.model ?? DEFAULT_MODELS[provider];

  const body =
    provider === 'anthropic'
      ? {
          model,
          max_tokens: req.maxTokens ?? 800,
          temperature: req.temperature ?? 0.7,
          messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
        }
      : {
          model,
          max_tokens: req.maxTokens ?? 800,
          temperature: req.temperature ?? 0.7,
          messages: req.messages,
          stream: req.stream ?? false,
        };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (provider !== 'gemini') {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://your-app.com';
    headers['X-Title'] = 'Your App Name';
  }

  const url =
    provider === 'gemini'
      ? `${baseUrl}/models/${model}:generateContent?key=${apiKey}`
      : `${baseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error (${provider}, ${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as AIProviderResponse;

  let content: string | undefined;
  switch (provider) {
    case 'anthropic':
      content = (data as AnthropicResponse).content?.[0]?.text;
      break;
    case 'gemini':
      content = (data as GeminiResponse).candidates?.[0]?.content?.parts?.[0]?.text;
      break;
    default:
      content = (data as OpenAIResponse).choices?.[0]?.message?.content;
  }

  if (!content) {
    throw new Error(`Empty response from ${provider}`);
  }

  return { role: 'assistant', content };
}