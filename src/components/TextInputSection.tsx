import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Sparkles, FileJson, File } from "lucide-react";
import { SentimentResult } from "@/types/sentiment";
import { analyzeSentiment } from "@/utils/sentimentAnalysis";
import { useToast } from "@/hooks/use-toast";
import { processCSVFile, processJSONFile, processPDFFile, processTextFile } from "@/utils/fileProcessing";

interface TextInputSectionProps {
  onResult: (result: SentimentResult) => void;
  currentAnalysis?: SentimentResult | null;
}

const TextInputSection = ({ onResult, currentAnalysis }: TextInputSectionProps) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(text);
      onResult(result);
      toast({
        title: "✨ Analysis Complete",
        description: `Text analyzed with ${(result.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during sentiment analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['.txt', '.csv', '.json', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt, .csv, .json, or .pdf file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingFile(true);
    
    try {
      let processedData;
      
      switch (fileExtension) {
        case '.csv':
          processedData = await processCSVFile(file);
          break;
        case '.json':
          processedData = await processJSONFile(file);
          break;
        case '.pdf':
          processedData = await processPDFFile(file);
          break;
        case '.txt':
        default:
          processedData = await processTextFile(file);
          break;
      }
      
      // For single text analysis, use the first text item
      if (processedData.texts.length > 0) {
        setText(processedData.texts[0]);
        toast({
          title: `🎉 ${processedData.fileType} File Processed`,
          description: `Loaded ${processedData.texts.length} text items from ${processedData.fileName}`,
        });
      } else {
        toast({
          title: "No Text Found",
          description: "No analyzable text content found in the file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "File Processing Failed",
        description: `Error processing ${fileExtension} file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 rounded-xl">
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="text-input" className="text-base md:text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-500 animate-pulse" />
              Enter Text for Analysis
            </Label>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Paste customer reviews, social media posts, or upload files (CSV, JSON, PDF, TXT) to analyze emotional tone
            </p>
          </div>

          <div className="relative group">
            <Textarea
              id="text-input"
              placeholder="Enter your text here for sentiment analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] md:min-h-[240px] resize-none bg-slate-50/50 backdrop-blur-sm border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-slate-300 rounded-xl text-sm md:text-base"
            />
            {(isAnalyzing || isProcessingFile) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium text-sm md:text-base">
                    {isProcessingFile ? "Processing file..." : "Analyzing sentiment..."}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.csv,.json,.pdf,text/plain,application/json,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full h-10 md:h-12 bg-slate-50/50 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-blue-300 transition-all duration-300 group rounded-xl text-sm md:text-base"
                disabled={isAnalyzing || isProcessingFile}
              >
                <div className="flex items-center gap-2">
                  {isProcessingFile ? (
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <span>Upload File</span>
                  <div className="flex gap-1 text-xs">
                    <FileText className="w-2 h-2 md:w-3 md:h-3" />
                    <FileJson className="w-2 h-2 md:w-3 md:h-3" />
                    <File className="w-2 h-2 md:w-3 md:h-3" />
                  </div>
                </div>
              </Button>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || isProcessingFile || !text.trim()}
              className="h-10 md:h-12 px-6 md:px-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none rounded-xl text-white border-0 text-sm md:text-base"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  <span className="hidden sm:inline">Analyze Sentiment</span>
                  <span className="sm:hidden">Analyze</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 text-xs md:text-sm bg-slate-50/50 backdrop-blur-sm px-3 md:px-4 py-2 md:py-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-slate-600">
                <span className="font-medium text-blue-600">{text.length}</span> characters
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">
                <span className="font-medium text-blue-600">{wordCount}</span> words
              </span>
            </div>
            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  text.length < 100 ? 'bg-orange-400' : 
                  text.length < 500 ? 'bg-emerald-400' : 'bg-blue-400'
                }`} />
                <span className="text-xs text-slate-500">
                  {text.length < 100 ? '📝 Short' : text.length < 500 ? '✅ Good' : '🎯 Detailed'}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs md:text-sm text-slate-500 bg-slate-50/30 p-3 rounded-lg border border-slate-200">
            <div className="font-medium mb-1 text-slate-600">📁 Supported file formats:</div>
            <div className="grid grid-cols-2 gap-1">
              <span>• 📄 Text files (.txt)</span>
              <span>• 📊 CSV files (.csv)</span>
              <span>• 🔧 JSON files (.json)</span>
              <span>• 📖 PDF files (.pdf)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Analysis Results */}
      {currentAnalysis && (
        <Card className="p-4 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 rounded-xl">
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-slate-700">✨ Current Analysis Results</h3>
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
                {currentAnalysis.keywords.length > 0 ? (
                  currentAnalysis.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 rounded-full text-xs md:text-sm shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-xs md:text-sm text-slate-500 italic">No specific keywords detected</span>
                )}
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
      )}
    </div>
  );
};

export default TextInputSection;
