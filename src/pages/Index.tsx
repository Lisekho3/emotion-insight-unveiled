
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
    <div className="min-h-screen gradient-mesh animate-rainbow">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 transition-all duration-500 hover:scale-105 drop-shadow-lg">
            🎨 Sentiment Analysis Dashboard
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Analyze emotional tone in customer reviews, social media posts, and text content with advanced AI-powered sentiment classification
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="analyze" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-3">
            <TabsTrigger value="analyze" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">📝 Text Analysis</TabsTrigger>
            <TabsTrigger value="batch" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">⚡ Batch Processing</TabsTrigger>
            <TabsTrigger value="visualize" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">📊 Visualizations</TabsTrigger>
            <TabsTrigger value="export" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">💾 Export Results</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <TextInputSection onResult={handleNewResult} />
              </div>
              {currentAnalysis && (
                <div className="xl:col-span-1">
                  <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-6 text-white drop-shadow-md">✨ Current Analysis</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 border border-white/20">
                        <span className="font-medium text-white/90">Sentiment:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                          currentAnalysis.sentiment === 'positive' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                          currentAnalysis.sentiment === 'negative' ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white' :
                          'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
                        }`}>
                          {currentAnalysis.sentiment === 'positive' ? '😊 POSITIVE' : 
                           currentAnalysis.sentiment === 'negative' ? '😔 NEGATIVE' : 
                           '😐 NEUTRAL'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 border border-white/20">
                        <span className="font-medium text-white/90">Confidence:</span>
                        <span className="text-sm font-mono bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full shadow-lg">
                          {(currentAnalysis.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-white/90">🏷️ Key Words:</span>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.keywords.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm shadow-lg transition-all duration-300 hover:scale-105 cursor-default">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-medium text-white/90">💡 Explanation:</span>
                        <p className="text-sm text-white/80 leading-relaxed p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
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
          <Card className="p-8 mt-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-fade-in rounded-2xl">
            <h3 className="text-xl font-semibold mb-8 text-white drop-shadow-md">📈 Recent Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 group">
                <div className="text-4xl font-bold text-green-300 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😊 {sentimentResults.filter(r => r.sentiment === 'positive').length}
                </div>
                <div className="text-sm font-medium text-green-200">Positive Reviews</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-gray-400/20 to-slate-500/20 backdrop-blur-sm rounded-2xl border border-gray-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/20 hover:-translate-y-2 group">
                <div className="text-4xl font-bold text-gray-300 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😐 {sentimentResults.filter(r => r.sentiment === 'neutral').length}
                </div>
                <div className="text-sm font-medium text-gray-200">Neutral Reviews</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-400/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 group">
                <div className="text-4xl font-bold text-red-300 mb-2 transition-transform duration-300 group-hover:scale-110 animate-bounce-gentle">
                  😔 {sentimentResults.filter(r => r.sentiment === 'negative').length}
                </div>
                <div className="text-sm font-medium text-red-200">Negative Reviews</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
