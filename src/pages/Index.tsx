
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 md:mb-6 transition-all duration-500 hover:scale-105">
            📊 Sentiment Analysis Dashboard
          </h1>
          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Analyze emotional tone in customer reviews, social media posts, and text content with advanced AI-powered sentiment classification
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="analyze" className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-xl p-2">
            <TabsTrigger value="analyze" className="text-xs md:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <span className="hidden md:inline">📝 Text Analysis</span>
              <span className="md:hidden">📝 Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="text-xs md:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <span className="hidden md:inline">⚡ Batch Processing</span>
              <span className="md:hidden">⚡ Batch</span>
            </TabsTrigger>
            <TabsTrigger value="visualize" className="text-xs md:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <span className="hidden md:inline">📊 Visualizations</span>
              <span className="md:hidden">📊 Charts</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs md:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
              <span className="hidden md:inline">💾 Export Results</span>
              <span className="md:hidden">💾 Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <TextInputSection onResult={handleNewResult} />
              </div>
              {currentAnalysis && (
                <div className="lg:col-span-1">
                  <Card className="p-4 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 rounded-xl">
                    <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-slate-700">✨ Current Analysis</h3>
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-xl bg-slate-50/80 backdrop-blur-sm transition-all duration-300 hover:bg-slate-100/80 border border-slate-200">
                        <span className="font-medium text-slate-600 mb-2 sm:mb-0">Sentiment:</span>
                        <span className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md ${
                          currentAnalysis.sentiment === 'positive' ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' :
                          currentAnalysis.sentiment === 'negative' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' :
                          'bg-gradient-to-r from-slate-400 to-gray-500 text-white'
                        }`}>
                          {currentAnalysis.sentiment === 'positive' ? '😊 POSITIVE' : 
                           currentAnalysis.sentiment === 'negative' ? '😔 NEGATIVE' : 
                           '😐 NEUTRAL'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-xl bg-slate-50/80 backdrop-blur-sm transition-all duration-300 hover:bg-slate-100/80 border border-slate-200">
                        <span className="font-medium text-slate-600 mb-2 sm:mb-0">Confidence:</span>
                        <span className="text-xs md:text-sm font-mono bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full shadow-md">
                          {(currentAnalysis.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-slate-600">🏷️ Key Words:</span>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 rounded-full text-xs md:text-sm shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-slate-600">💡 Explanation:</span>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed p-3 md:p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200">
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
          <Card className="p-4 md:p-8 mt-8 md:mt-12 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg animate-fade-in rounded-xl">
            <h3 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 text-slate-700">📈 Recent Analysis Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6 bg-gradient-to-br from-emerald-50 to-green-100 backdrop-blur-sm rounded-xl md:rounded-2xl border border-emerald-200 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 group">
                <div className="text-2xl md:text-4xl font-bold text-emerald-600 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😊 {sentimentResults.filter(r => r.sentiment === 'positive').length}
                </div>
                <div className="text-xs md:text-sm font-medium text-emerald-700">Positive Reviews</div>
              </div>
              <div className="text-center p-4 md:p-6 bg-gradient-to-br from-slate-50 to-gray-100 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-200 transition-all duration-500 hover:shadow-lg hover:shadow-slate-500/20 hover:-translate-y-1 group">
                <div className="text-2xl md:text-4xl font-bold text-slate-600 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😐 {sentimentResults.filter(r => r.sentiment === 'neutral').length}
                </div>
                <div className="text-xs md:text-sm font-medium text-slate-700">Neutral Reviews</div>
              </div>
              <div className="text-center p-4 md:p-6 bg-gradient-to-br from-red-50 to-rose-100 backdrop-blur-sm rounded-xl md:rounded-2xl border border-red-200 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-1 group">
                <div className="text-2xl md:text-4xl font-bold text-red-600 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😔 {sentimentResults.filter(r => r.sentiment === 'negative').length}
                </div>
                <div className="text-xs md:text-sm font-medium text-red-700">Negative Reviews</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
