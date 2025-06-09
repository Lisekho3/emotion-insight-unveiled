
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import { SentimentResult } from "@/types/sentiment";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ExportSectionProps {
  results: SentimentResult[];
}

const ExportSection = ({ results }: ExportSectionProps) => {
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const { toast } = useToast();

  const exportToCSV = () => {
    if (results.length === 0) {
      toast({
        title: "No Data",
        description: "No analysis results to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Text", "Sentiment", "Confidence", "Keywords", "Explanation", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...results.map(result => [
        `"${result.text.replace(/"/g, '""')}"`,
        result.sentiment,
        (result.confidence * 100).toFixed(2),
        `"${result.keywords.join(', ')}"`,
        `"${result.explanation.replace(/"/g, '""')}"`,
        result.timestamp.toISOString()
      ].join(","))
    ].join("\n");

    downloadFile(csvContent, "sentiment-analysis-results.csv", "text/csv");
  };

  const exportToJSON = () => {
    if (results.length === 0) {
      toast({
        title: "No Data",
        description: "No analysis results to export",
        variant: "destructive",
      });
      return;
    }

    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalResults: results.length,
      summary: {
        positive: results.filter(r => r.sentiment === 'positive').length,
        negative: results.filter(r => r.sentiment === 'negative').length,
        neutral: results.filter(r => r.sentiment === 'neutral').length,
        averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
      },
      results: results
    }, null, 2);

    downloadFile(jsonContent, "sentiment-analysis-results.json", "application/json");
  };

  const exportToPDF = () => {
    if (results.length === 0) {
      toast({
        title: "No Data",
        description: "No analysis results to export",
        variant: "destructive",
      });
      return;
    }

    // Create a simple HTML report that can be printed to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sentiment Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .summary { background: #f5f5f5; padding: 20px; margin-bottom: 30px; border-radius: 5px; }
          .result { border-bottom: 1px solid #eee; padding: 15px 0; }
          .sentiment { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          .positive { background: #d4edda; color: #155724; }
          .negative { background: #f8d7da; color: #721c24; }
          .neutral { background: #d1ecf1; color: #0c5460; }
          .keywords { font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sentiment Analysis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Analyses:</strong> ${results.length}</p>
          <p><strong>Positive:</strong> ${results.filter(r => r.sentiment === 'positive').length}</p>
          <p><strong>Negative:</strong> ${results.filter(r => r.sentiment === 'negative').length}</p>
          <p><strong>Neutral:</strong> ${results.filter(r => r.sentiment === 'neutral').length}</p>
          <p><strong>Average Confidence:</strong> ${(results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100).toFixed(1)}%</p>
        </div>
        
        <h2>Detailed Results</h2>
        ${results.map(result => `
          <div class="result">
            <p><strong>Text:</strong> ${result.text}</p>
            <p><strong>Sentiment:</strong> <span class="sentiment ${result.sentiment}">${result.sentiment.toUpperCase()}</span></p>
            <p><strong>Confidence:</strong> ${(result.confidence * 100).toFixed(1)}%</p>
            <p><strong>Keywords:</strong> <span class="keywords">${result.keywords.join(', ')}</span></p>
            <p><strong>Explanation:</strong> ${result.explanation}</p>
            <p><strong>Timestamp:</strong> ${result.timestamp.toLocaleString()}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis-report.html';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "HTML report downloaded. Open in browser and print to PDF.",
    });
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Data exported as ${filename}`,
    });
  };

  const handleExport = () => {
    switch (exportFormat) {
      case "csv":
        exportToCSV();
        break;
      case "json":
        exportToJSON();
        break;
      case "pdf":
        exportToPDF();
        break;
      default:
        exportToCSV();
    }
  };

  const getSummaryData = () => {
    if (results.length === 0) return null;

    return {
      total: results.length,
      positive: results.filter(r => r.sentiment === 'positive').length,
      negative: results.filter(r => r.sentiment === 'negative').length,
      neutral: results.filter(r => r.sentiment === 'neutral').length,
      averageConfidence: (results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100).toFixed(1)
    };
  };

  const summary = getSummaryData();

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Export Analysis Results</h3>
            <p className="text-sm text-muted-foreground">
              Download your sentiment analysis results in various formats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                  <SelectItem value="json">JSON (Data)</SelectItem>
                  <SelectItem value="pdf">PDF Report (HTML)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={results.length === 0}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>

          {results.length === 0 && (
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              No analysis results available. Analyze some text first to enable export functionality.
            </p>
          )}
        </div>
      </Card>

      {/* Export Format Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Export Format Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              CSV Format
            </h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Spreadsheet compatible</li>
              <li>• Easy data analysis</li>
              <li>• Import into Excel/Sheets</li>
              <li>• Raw data format</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              JSON Format
            </h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Developer friendly</li>
              <li>• API integration ready</li>
              <li>• Includes metadata</li>
              <li>• Machine readable</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              PDF Report
            </h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Human readable report</li>
              <li>• Professional format</li>
              <li>• Print friendly</li>
              <li>• Includes summary</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Data Summary */}
      {summary && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Current Data Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
              <div className="text-sm text-blue-700">Total Analyses</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.positive}</div>
              <div className="text-sm text-green-700">Positive</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.negative}</div>
              <div className="text-sm text-red-700">Negative</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{summary.neutral}</div>
              <div className="text-sm text-gray-700">Neutral</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{summary.averageConfidence}%</div>
              <div className="text-sm text-purple-700">Avg Confidence</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExportSection;
