
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInputSection from "@/components/TextInputSection";
import SentimentVisualization from "@/components/SentimentVisualization";
import BatchProcessor from "@/components/BatchProcessor";
import ExportSection from "@/components/ExportSection";
import { SentimentResult } from "@/types/sentiment";

const Index = () => {
  const [sentimentResults, setSentimentResults] = useState<SentimentResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<SentimentResult | null>(null);

  const handleNewResult = (result: SentimentResult) => {
    setSentimentResults(prev => [result, ...prev]);
    setCurrentAnalysis(result);
  };

  const handleBatchResults = (results: SentimentResult[]) => {
    setSentimentResults(prev => [...results, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Sentiment Analysis Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze emotional tone in customer reviews, social media posts, and text content with advanced AI-powered sentiment classification
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analyze">Text Analysis</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
            <TabsTrigger value="visualize">Visualizations</TabsTrigger>
            <TabsTrigger value="export">Export Results</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInputSection onResult={handleNewResult} />
              {currentAnalysis && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sentiment:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        currentAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {currentAnalysis.sentiment.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Confidence:</span>
                      <span className="text-sm">{(currentAnalysis.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Key Words:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentAnalysis.keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Explanation:</span>
                      <p className="text-sm text-muted-foreground mt-1">{currentAnalysis.explanation}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="batch">
            <BatchProcessor onResults={handleBatchResults} />
          </TabsContent>

          <TabsContent value="visualize">
            <SentimentVisualization results={sentimentResults} />
          </TabsContent>

          <TabsContent value="export">
            <ExportSection results={sentimentResults} />
          </TabsContent>
        </Tabs>

        {/* Recent Results Summary */}
        {sentimentResults.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {sentimentResults.filter(r => r.sentiment === 'positive').length}
                </div>
                <div className="text-sm text-green-700">Positive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {sentimentResults.filter(r => r.sentiment === 'neutral').length}
                </div>
                <div className="text-sm text-gray-700">Neutral</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {sentimentResults.filter(r => r.sentiment === 'negative').length}
                </div>
                <div className="text-sm text-red-700">Negative</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
