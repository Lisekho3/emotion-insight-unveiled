
import { SentimentResult } from "@/types/sentiment";

// Mock sentiment analysis engine - in production, this would connect to a real AI service
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

function extractKeywords(text: string, sentiment: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  const relevantWords = sentimentWords[sentiment as keyof typeof sentimentWords] || [];
  
  return words
    .filter(word => relevantWords.includes(word))
    .slice(0, 5); // Return top 5 keywords
}

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

function generateExplanation(sentiment: string, keywords: string[], confidence: number): string {
  const confidenceText = confidence > 0.8 ? 'high' : confidence > 0.6 ? 'moderate' : 'low';
  
  if (keywords.length === 0) {
    return `This text was classified as ${sentiment} with ${confidenceText} confidence based on overall tone and context.`;
  }
  
  const keywordText = keywords.length > 1 
    ? `words like "${keywords.join('", "')}"` 
    : `the word "${keywords[0]}"`;
  
  return `This text was classified as ${sentiment} with ${confidenceText} confidence primarily due to ${keywordText} which indicate ${sentiment} sentiment.`;
}

export async function analyzeSentiment(text: string, source?: string): Promise<SentimentResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const { sentiment, confidence } = calculateSentiment(text);
  const keywords = extractKeywords(text, sentiment);
  const explanation = generateExplanation(sentiment, keywords, confidence);
  
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

export async function batchAnalyzeSentiment(texts: { text: string, source?: string }[]): Promise<SentimentResult[]> {
  const results: SentimentResult[] = [];
  
  for (const item of texts) {
    const result = await analyzeSentiment(item.text, item.source);
    results.push(result);
  }
  
  return results;
}
