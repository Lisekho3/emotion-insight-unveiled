
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Play, Trash2 } from "lucide-react";
import { SentimentResult } from "@/types/sentiment";
import { batchAnalyzeSentiment } from "@/utils/sentimentAnalysis";
import { useToast } from "@/hooks/use-toast";

interface BatchProcessorProps {
  onResults: (results: SentimentResult[]) => void;
}

const BatchProcessor = ({ onResults }: BatchProcessorProps) => {
  const [batchText, setBatchText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();

  const handleBatchAnalysis = async () => {
    if (!batchText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text items to analyze",
        variant: "destructive",
      });
      return;
    }

    const items = batchText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => ({ text: line }));

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "No valid text items found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCurrentItem(0);
    setTotalItems(items.length);

    try {
      const results: SentimentResult[] = [];
      
      for (let i = 0; i < items.length; i++) {
        setCurrentItem(i + 1);
        setProgress(((i + 1) / items.length) * 100);
        
        // Simulate processing delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await batchAnalyzeSentiment([items[i]]);
        results.push(...result);
      }

      onResults(results);
      setBatchText("");
      toast({
        title: "Batch Analysis Complete",
        description: `Successfully analyzed ${results.length} text items`,
      });
    } catch (error) {
      toast({
        title: "Batch Analysis Failed",
        description: "An error occurred during batch processing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentItem(0);
      setTotalItems(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.type.includes('text') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a text file (.txt) or CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // If it's a CSV, try to extract text from the first column
      if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const textItems = lines
          .slice(1) // Skip header
          .map(line => line.split(',')[0])
          .filter(item => item && item.trim().length > 0)
          .join('\n');
        setBatchText(textItems);
      } else {
        setBatchText(content);
      }
      
      toast({
        title: "File Uploaded",
        description: `Loaded content from ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const clearBatchText = () => {
    setBatchText("");
  };

  const itemCount = batchText.split('\n').filter(line => line.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="batch-input" className="text-base font-semibold">
              Batch Text Analysis
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Enter multiple text items (one per line) or upload a file for batch processing
            </p>
          </div>

          <Textarea
            id="batch-input"
            placeholder="Enter text items for batch analysis (one per line)&#10;Example:&#10;This product is amazing!&#10;Terrible customer service&#10;Average quality for the price"
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isProcessing}
          />

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept=".txt,.csv,text/plain"
                onChange={handleFileUpload}
                className="hidden"
                id="batch-file-upload"
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('batch-file-upload')?.click()}
                disabled={isProcessing}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File (.txt or .csv)
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={clearBatchText}
              disabled={isProcessing || !batchText.trim()}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            
            <Button 
              onClick={handleBatchAnalysis} 
              disabled={isProcessing || !batchText.trim()}
              className="px-8"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyze Batch
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Items to process: {itemCount}</span>
            <span>Estimated time: ~{Math.ceil(itemCount * 1.5)} seconds</span>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Processing item {currentItem} of {totalItems}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Batch Processing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Text Format</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• One text item per line</li>
              <li>• Empty lines will be ignored</li>
              <li>• Maximum 1000 characters per item</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">File Upload</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Supports .txt and .csv files</li>
              <li>• CSV files use first column as text</li>
              <li>• File size limit: 10MB</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BatchProcessor;
