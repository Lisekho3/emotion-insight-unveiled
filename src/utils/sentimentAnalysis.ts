
import { SentimentResult } from "@/types/sentiment";
import { supabase } from "@/integrations/supabase/client";

export async function analyzeSentiment(text: string, source?: string): Promise<SentimentResult> {
  try {
    console.log('Calling NLP API for sentiment analysis...');
    
    const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
      body: { text, source }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to analyze sentiment');
    }

    if (!data) {
      throw new Error('No data returned from sentiment analysis');
    }

    // Convert timestamp string back to Date object
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };

  } catch (error) {
    console.error('Error in analyzeSentiment:', error);
    
    // Fallback to mock analysis if API fails
    console.log('Falling back to mock analysis...');
    return mockAnalyzeSentiment(text, source);
  }
}

export async function batchAnalyzeSentiment(texts: { text: string, source?: string }[]): Promise<SentimentResult[]> {
  const results: SentimentResult[] = [];
  
  for (const item of texts) {
    try {
      const result = await analyzeSentiment(item.text, item.source);
      results.push(result);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error analyzing text in batch:', error);
      
      // Continue with remaining texts even if one fails
      const fallbackResult = await mockAnalyzeSentiment(item.text, item.source);
      results.push(fallbackResult);
    }
  }
  
  return results;
}

// Fallback mock analysis function
async function mockAnalyzeSentiment(text: string, source?: string): Promise<SentimentResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sentimentWords = {
    positive: [
      'excellent', 'amazing', 'fantastic', 'wonderful', 'great', 'good', 'awesome',
      'love', 'perfect', 'brilliant', 'outstanding', 'superb', 'impressive',
      'delighted', 'satisfied', 'happy', 'pleased', 'recommend', 'best'
    ],
    negative: [
      'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing',
      'poor', 'useless', 'pathetic', 'disgusting', 'annoying', 'frustrated',
      'angry', 'upset', 'dissatisfied', 'complaint', 'problem', 'issue'
    ],
    neutral: [
      'okay', 'average', 'normal', 'standard', 'typical', 'regular', 'fine',
      'acceptable', 'moderate', 'fair', 'decent', 'sufficient'
    ]
  };

  function calculateSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral', confidence: number } {
    const words = text.toLowerCase().split(/\W+/);
    
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    
    words.forEach(word => {
      if (sentimentWords.positive.includes(word)) positiveScore++;
      if (sentimentWords.negative.includes(word)) negativeScore++;
      if (sentimentWords.neutral.includes(word)) neutralScore++;
    });
    
    const totalScore = positiveScore + negativeScore + neutralScore;
    
    if (totalScore === 0) {
      return { sentiment: 'neutral', confidence: 0.5 };
    }
    
    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      return { 
        sentiment: 'positive', 
        confidence: Math.min(0.95, 0.6 + (positiveScore / totalScore) * 0.4)
      };
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      return { 
        sentiment: 'negative', 
        confidence: Math.min(0.95, 0.6 + (negativeScore / totalScore) * 0.4)
      };
    } else {
      return { 
        sentiment: 'neutral', 
        confidence: Math.min(0.9, 0.5 + (neutralScore / totalScore) * 0.4)
      };
    }
  }

  function extractKeywords(text: string, sentiment: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const relevantWords = sentimentWords[sentiment as keyof typeof sentimentWords] || [];
    
    return words
      .filter(word => relevantWords.includes(word))
      .slice(0, 5);
  }

  const { sentiment, confidence } = calculateSentiment(text);
  const keywords = extractKeywords(text, sentiment);
  const confidenceText = confidence > 0.8 ? 'high' : confidence > 0.6 ? 'moderate' : 'low';
  const explanation = `This text was classified as ${sentiment} with ${confidenceText} confidence using fallback analysis.`;
  
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    sentiment,
    confidence,
    keywords,
    explanation,
    timestamp: new Date(),
    source
  };
}
