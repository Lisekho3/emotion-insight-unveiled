
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Play, Trash2, FileText, FileJson, File } from "lucide-react";
import { SentimentResult } from "@/types/sentiment";
import { batchAnalyzeSentiment } from "@/utils/sentimentAnalysis";
import { useToast } from "@/hooks/use-toast";
import { processCSVFile, processJSONFile, processPDFFile, processTextFile } from "@/utils/fileProcessing";

interface BatchProcessorProps {
  onResults: (results: SentimentResult[]) => void;
}

const BatchProcessor = ({ onResults }: BatchProcessorProps) => {
  const [batchText, setBatchText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
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
        title: "🎉 Batch Analysis Complete",
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
      
      if (processedData.texts.length > 0) {
        setBatchText(processedData.texts.join('\n'));
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

  const clearBatchText = () => {
    setBatchText("");
  };

  const itemCount = batchText.split('\n').filter(line => line.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="batch-input" className="text-base font-semibold text-white drop-shadow-md flex items-center gap-2">
              ⚡ Batch Text Analysis
            </Label>
            <p className="text-sm text-white/80 mb-3">
              Enter multiple text items (one per line) or upload a file for batch processing
            </p>
          </div>

          <div className="relative">
            <Textarea
              id="batch-input"
              placeholder="Enter text items for batch analysis (one per line)&#10;Example:&#10;This product is amazing! 😍&#10;Terrible customer service 😠&#10;Average quality for the price 😐"
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              className="min-h-[200px] resize-none bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              disabled={isProcessing || isProcessingFile}
            />
            {isProcessingFile && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Processing file...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept=".txt,.csv,.json,.pdf,text/plain,application/json,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="batch-file-upload"
                disabled={isProcessing || isProcessingFile}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('batch-file-upload')?.click()}
                disabled={isProcessing || isProcessingFile}
                className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-cyan-300 transition-all duration-300 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  {isProcessingFile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
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
              variant="outline"
              onClick={clearBatchText}
              disabled={isProcessing || isProcessingFile || !batchText.trim()}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-red-500/20 hover:border-red-300 transition-all duration-300 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            
            <Button 
              onClick={handleBatchAnalysis} 
              disabled={isProcessing || isProcessingFile || !batchText.trim()}
              className="px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none rounded-xl text-white border-0"
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

          <div className="flex justify-between items-center text-sm text-white/70 bg-white/5 p-3 rounded-lg">
            <span>📊 Items to process: <span className="text-yellow-400 font-medium">{itemCount}</span></span>
            <span>⏱️ Estimated time: ~{Math.ceil(itemCount * 1.5)} seconds</span>
          </div>

          {isProcessing && (
            <div className="space-y-2 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex justify-between items-center text-sm text-white">
                <span>Processing item {currentItem} of {totalItems}</span>
                <span className="text-yellow-400 font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-md">💡 Batch Processing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-purple-300">📝 Text Format</h4>
            <ul className="space-y-1 text-white/70">
              <li>• One text item per line</li>
              <li>• Empty lines will be ignored</li>
              <li>• Maximum 1000 characters per item</li>
            </ul>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-300">📁 File Upload</h4>
            <ul className="space-y-1 text-white/70">
              <li>• Supports .txt, .csv, .json, .pdf files</li>
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
