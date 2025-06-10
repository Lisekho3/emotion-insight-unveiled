
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, source } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing text:', text.substring(0, 100) + '...');

    // Use Hugging Face's sentiment analysis model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Hugging Face API error:', await response.text());
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const sentimentData = await response.json();
    console.log('Hugging Face response:', sentimentData);

    // Process the sentiment results
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidence = 0.5;

    if (Array.isArray(sentimentData) && sentimentData.length > 0) {
      const results = sentimentData[0];
      
      // Find the highest scoring sentiment
      const topResult = results.reduce((prev: any, current: any) => 
        (prev.score > current.score) ? prev : current
      );

      // Map Hugging Face labels to our sentiment categories
      if (topResult.label === 'LABEL_2' || topResult.label.toLowerCase().includes('positive')) {
        sentiment = 'positive';
      } else if (topResult.label === 'LABEL_0' || topResult.label.toLowerCase().includes('negative')) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
      
      confidence = topResult.score;
    }

    // Extract keywords using a simple approach
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    const keywords = words.slice(0, 5);

    // Generate explanation
    const confidenceText = confidence > 0.8 ? 'high' : confidence > 0.6 ? 'moderate' : 'low';
    const explanation = `This text was classified as ${sentiment} with ${confidenceText} confidence (${(confidence * 100).toFixed(1)}%) using advanced NLP analysis.`;

    const result = {
      id: crypto.randomUUID(),
      text: text.trim(),
      sentiment,
      confidence,
      keywords,
      explanation,
      timestamp: new Date().toISOString(),
      source
    };

    console.log('Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze sentiment', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
