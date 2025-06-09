
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-6 transition-all duration-500 hover:scale-105">
            Sentiment Analysis Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Analyze emotional tone in customer reviews, social media posts, and text content with advanced AI-powered sentiment classification
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="analyze" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border shadow-lg rounded-xl p-2">
            <TabsTrigger value="analyze" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Text Analysis</TabsTrigger>
            <TabsTrigger value="batch" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Batch Processing</TabsTrigger>
            <TabsTrigger value="visualize" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Visualizations</TabsTrigger>
            <TabsTrigger value="export" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md">Export Results</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <TextInputSection onResult={handleNewResult} />
              </div>
              {currentAnalysis && (
                <div className="xl:col-span-1">
                  <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-6 text-slate-700">Current Analysis</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 transition-all duration-300 hover:bg-slate-100/50">
                        <span className="font-medium text-slate-600">Sentiment:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          currentAnalysis.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          currentAnalysis.sentiment === 'negative' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {currentAnalysis.sentiment.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 transition-all duration-300 hover:bg-slate-100/50">
                        <span className="font-medium text-slate-600">Confidence:</span>
                        <span className="text-sm font-mono bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                          {(currentAnalysis.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-slate-600">Key Words:</span>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.keywords.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 transition-all duration-300 hover:bg-blue-100 hover:scale-105 cursor-default">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-slate-600">Explanation:</span>
                        <p className="text-sm text-slate-500 leading-relaxed p-4 bg-slate-50/50 rounded-lg border border-slate-200">
                          {currentAnalysis.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="batch" className="animate-fade-in">
            <BatchProcessor onResults={handleBatchResults} />
          </TabsContent>

          <TabsContent value="visualize" className="animate-fade-in">
            <SentimentVisualization results={sentimentResults} />
          </TabsContent>

          <TabsContent value="export" className="animate-fade-in">
            <ExportSection results={sentimentResults} />
          </TabsContent>
        </Tabs>

        {/* Recent Results Summary */}
        {sentimentResults.length > 0 && (
          <Card className="p-8 mt-12 bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in">
            <h3 className="text-xl font-semibold mb-8 text-slate-700">Recent Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group">
                <div className="text-3xl font-bold text-emerald-600 mb-2 transition-transform duration-300 group-hover:scale-110">
                  {sentimentResults.filter(r => r.sentiment === 'positive').length}
                </div>
                <div className="text-sm font-medium text-emerald-700">Positive Reviews</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group">
                <div className="text-3xl font-bold text-slate-600 mb-2 transition-transform duration-300 group-hover:scale-110">
                  {sentimentResults.filter(r => r.sentiment === 'neutral').length}
                </div>
                <div className="text-sm font-medium text-slate-700">Neutral Reviews</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group">
                <div className="text-3xl font-bold text-rose-600 mb-2 transition-transform duration-300 group-hover:scale-110">
                  {sentimentResults.filter(r => r.sentiment === 'negative').length}
                </div>
                <div className="text-sm font-medium text-rose-700">Negative Reviews</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
