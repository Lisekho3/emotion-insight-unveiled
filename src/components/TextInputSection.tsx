
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Sparkles } from "lucide-react";
import { SentimentResult } from "@/types/sentiment";
import { analyzeSentiment } from "@/utils/sentimentAnalysis";
import { useToast } from "@/hooks/use-toast";

interface TextInputSectionProps {
  onResult: (result: SentimentResult) => void;
}

const TextInputSection = ({ onResult }: TextInputSectionProps) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
        title: "Analysis Complete",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.type.includes('text')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a text file (.txt)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      toast({
        title: "File Uploaded",
        description: `Loaded ${content.length} characters from ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="text-input" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Enter Text for Analysis
          </Label>
          <p className="text-slate-500 leading-relaxed">
            Paste customer reviews, social media posts, or any text content to analyze emotional tone
          </p>
        </div>

        <div className="relative group">
          <Textarea
            id="text-input"
            placeholder="Enter your text here for sentiment analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[240px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 group-hover:border-slate-300"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Analyzing sentiment...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1">
            <Input
              id="file-upload"
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full h-12 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
              Upload Text File
            </Button>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !text.trim()}
            className="h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Analyze Sentiment
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              <span className="font-medium">{text.length}</span> characters
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              <span className="font-medium">{wordCount}</span> words
            </span>
          </div>
          {text.length > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                text.length < 100 ? 'bg-amber-400' : 
                text.length < 500 ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <span className="text-xs text-slate-500">
                {text.length < 100 ? 'Short' : text.length < 500 ? 'Good' : 'Detailed'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TextInputSection;
