
export interface SentimentResult {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
  explanation: string;
  timestamp: Date;
  source?: string;
}

export interface BatchAnalysisItem {
  id: string;
  text: string;
  source?: string;
}

export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}
