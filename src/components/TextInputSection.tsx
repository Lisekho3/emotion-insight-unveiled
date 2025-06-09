
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
}

const TextInputSection = ({ onResult }: TextInputSectionProps) => {
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
    <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 rounded-2xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="text-input" className="text-lg font-semibold text-white drop-shadow-md flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            Enter Text for Analysis
          </Label>
          <p className="text-white/80 leading-relaxed">
            Paste customer reviews, social media posts, or upload files (CSV, JSON, PDF, TXT) to analyze emotional tone
          </p>
        </div>

        <div className="relative group">
          <Textarea
            id="text-input"
            placeholder="Enter your text here for sentiment analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[240px] resize-none bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 group-hover:border-white/40 rounded-xl"
          />
          {(isAnalyzing || isProcessingFile) && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">
                  {isProcessingFile ? "Processing file..." : "Analyzing sentiment..."}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
              className="w-full h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-purple-300 transition-all duration-300 group rounded-xl"
              disabled={isAnalyzing || isProcessingFile}
            >
              <div className="flex items-center gap-2">
                {isProcessingFile ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                )}
                <span>Upload File</span>
                <div className="flex gap-1 text-xs">
                  <FileText className="w-3 h-3" />
                  <FileJson className="w-3 h-3" />
                  <File className="w-3 h-3" />
                </div>
              </div>
            </Button>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || isProcessingFile || !text.trim()}
            className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none rounded-xl text-white border-0"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Sentiment
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-white/80">
              <span className="font-medium text-yellow-400">{text.length}</span> characters
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">
              <span className="font-medium text-yellow-400">{wordCount}</span> words
            </span>
          </div>
          {text.length > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                text.length < 100 ? 'bg-orange-400' : 
                text.length < 500 ? 'bg-green-400' : 'bg-blue-400'
              }`} />
              <span className="text-xs text-white/60">
                {text.length < 100 ? '📝 Short' : text.length < 500 ? '✅ Good' : '🎯 Detailed'}
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-white/60 bg-white/5 p-3 rounded-lg">
          <div className="font-medium mb-1">📁 Supported file formats:</div>
          <div className="grid grid-cols-2 gap-1">
            <span>• 📄 Text files (.txt)</span>
            <span>• 📊 CSV files (.csv)</span>
            <span>• 🔧 JSON files (.json)</span>
            <span>• 📖 PDF files (.pdf)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TextInputSection;
