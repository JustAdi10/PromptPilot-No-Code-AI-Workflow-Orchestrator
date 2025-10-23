import { Client, Databases, Storage } from 'node-appwrite';

// Types
interface AITextRequest {
  operation: 'summarize' | 'translate' | 'sentiment' | 'extract' | 'generate' | 'classify';
  input: string;
  config: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    language?: string; // for translation
    prompt?: string; // for custom operations
    categories?: string[]; // for classification
  };
}

interface AITextResponse {
  success: boolean;
  result?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const storage = new Storage(client);

// OpenAI API integration
async function callOpenAI(messages: any[], config: any = {}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages,
      max_tokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// AI Text Operations
async function summarizeText(input: string, config: any): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful assistant that creates concise summaries. ${
        config.maxLength ? `Keep summaries under ${config.maxLength} words.` : ''
      }`,
    },
    {
      role: 'user',
      content: `Please summarize the following text:\n\n${input}`,
    },
  ];

  const response = await callOpenAI(messages, config);
  const summary = response.choices[0].message.content.trim();

  return {
    summary,
    originalLength: input.split(' ').length,
    summaryLength: summary.split(' ').length,
    compressionRatio: (summary.split(' ').length / input.split(' ').length).toFixed(2),
  };
}

async function translateText(input: string, config: any): Promise<any> {
  const targetLanguage = config.language || 'English';
  
  const messages = [
    {
      role: 'system',
      content: `You are a professional translator. Translate the given text to ${targetLanguage}. Only provide the translation, no explanations.`,
    },
    {
      role: 'user',
      content: input,
    },
  ];

  const response = await callOpenAI(messages, config);
  const translation = response.choices[0].message.content.trim();

  return {
    originalText: input,
    translatedText: translation,
    targetLanguage,
    sourceLanguage: 'auto-detected',
  };
}

async function analyzeSentiment(input: string, config: any): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with a JSON object containing: sentiment (positive/negative/neutral), confidence (0-1), and explanation.',
    },
    {
      role: 'user',
      content: input,
    },
  ];

  const response = await callOpenAI(messages, config);
  const result = JSON.parse(response.choices[0].message.content);

  return {
    text: input,
    ...result,
  };
}

async function extractInformation(input: string, config: any): Promise<any> {
  const extractionPrompt = config.prompt || 'Extract key information from the following text:';
  
  const messages = [
    {
      role: 'system',
      content: 'You are an information extraction expert. Extract the requested information and return it in a structured format.',
    },
    {
      role: 'user',
      content: `${extractionPrompt}\n\n${input}`,
    },
  ];

  const response = await callOpenAI(messages, config);
  const extracted = response.choices[0].message.content.trim();

  return {
    originalText: input,
    extractedInfo: extracted,
    prompt: extractionPrompt,
  };
}

async function generateText(input: string, config: any): Promise<any> {
  const prompt = config.prompt || input;
  
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant. Generate high-quality content based on the user\'s request.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenAI(messages, config);
  const generated = response.choices[0].message.content.trim();

  return {
    prompt: input,
    generatedText: generated,
    wordCount: generated.split(' ').length,
  };
}

async function classifyText(input: string, config: any): Promise<any> {
  const categories = config.categories || ['positive', 'negative', 'neutral'];
  
  const messages = [
    {
      role: 'system',
      content: `You are a text classifier. Classify the given text into one of these categories: ${categories.join(', ')}. Respond with a JSON object containing: category, confidence (0-1), and reasoning.`,
    },
    {
      role: 'user',
      content: input,
    },
  ];

  const response = await callOpenAI(messages, config);
  const result = JSON.parse(response.choices[0].message.content);

  return {
    text: input,
    availableCategories: categories,
    ...result,
  };
}

// Main function
export default async ({ req, res, log, error }: any) => {
  log('AI Text Operations function started');

  try {
    // Parse request
    const requestData: AITextRequest = JSON.parse(req.body || '{}');
    
    if (!requestData.operation || !requestData.input) {
      throw new Error('Missing required fields: operation and input');
    }

    log(`Processing ${requestData.operation} operation`);

    let result: any;
    const startTime = Date.now();

    // Route to appropriate operation
    switch (requestData.operation) {
      case 'summarize':
        result = await summarizeText(requestData.input, requestData.config || {});
        break;
      case 'translate':
        result = await translateText(requestData.input, requestData.config || {});
        break;
      case 'sentiment':
        result = await analyzeSentiment(requestData.input, requestData.config || {});
        break;
      case 'extract':
        result = await extractInformation(requestData.input, requestData.config || {});
        break;
      case 'generate':
        result = await generateText(requestData.input, requestData.config || {});
        break;
      case 'classify':
        result = await classifyText(requestData.input, requestData.config || {});
        break;
      default:
        throw new Error(`Unsupported operation: ${requestData.operation}`);
    }

    const processingTime = Date.now() - startTime;

    // Prepare response
    const response: AITextResponse = {
      success: true,
      result: {
        ...result,
        operation: requestData.operation,
        processingTime,
        timestamp: new Date().toISOString(),
      },
    };

    log(`Operation completed successfully in ${processingTime}ms`);

    return res.json(response);

  } catch (err: any) {
    error('AI Text Operations error:', err);
    
    const response: AITextResponse = {
      success: false,
      error: err.message || 'Internal server error',
    };

    return res.json(response, 500);
  }
};