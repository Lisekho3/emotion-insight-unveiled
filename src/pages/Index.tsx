
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
            <TextInputSection onResult={handleNewResult} currentAnalysis={currentAnalysis} />
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
