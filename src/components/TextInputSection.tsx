
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
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

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="text-input" className="text-base font-semibold">
            Enter Text for Analysis
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Paste customer reviews, social media posts, or any text content
          </p>
        </div>

        <Textarea
          id="text-input"
          placeholder="Enter your text here for sentiment analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-none"
        />

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="file-upload" className="sr-only">
              Upload text file
            </Label>
            <div className="relative">
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
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Text File
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !text.trim()}
            className="px-8"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Character count: {text.length} | Word count: {text.trim().split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>
    </Card>
  );
};

export default TextInputSection;
