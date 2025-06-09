
import { Card } from "@/components/ui/card";
import { SentimentResult } from "@/types/sentiment";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SentimentVisualizationProps {
  results: SentimentResult[];
}

const COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280'
};

const SentimentVisualization = ({ results }: SentimentVisualizationProps) => {
  if (results.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Analyze some text to see visualizations here.</p>
      </Card>
    );
  }

  // Prepare data for charts
  const sentimentCounts = {
    positive: results.filter(r => r.sentiment === 'positive').length,
    negative: results.filter(r => r.sentiment === 'negative').length,
    neutral: results.filter(r => r.sentiment === 'neutral').length
  };

  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive, color: COLORS.positive },
    { name: 'Negative', value: sentimentCounts.negative, color: COLORS.negative },
    { name: 'Neutral', value: sentimentCounts.neutral, color: COLORS.neutral }
  ].filter(item => item.value > 0);

  const confidenceData = results.map((result, index) => ({
    index: index + 1,
    confidence: Math.round(result.confidence * 100),
    sentiment: result.sentiment
  }));

  const timelineData = results
    .slice(0, 10)
    .reverse()
    .map((result, index) => ({
      analysis: index + 1,
      positive: result.sentiment === 'positive' ? result.confidence * 100 : 0,
      negative: result.sentiment === 'negative' ? result.confidence * 100 : 0,
      neutral: result.sentiment === 'neutral' ? result.confidence * 100 : 0
    }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{results.length}</div>
          <div className="text-sm text-muted-foreground">Total Analyses</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</div>
          <div className="text-sm text-muted-foreground">Positive</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</div>
          <div className="text-sm text-muted-foreground">Negative</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{sentimentCounts.neutral}</div>
          <div className="text-sm text-muted-foreground">Neutral</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Confidence Scores */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} />
              <Bar dataKey="confidence" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Analysis Timeline</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="analysis" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Confidence']} />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke={COLORS.positive} strokeWidth={2} />
            <Line type="monotone" dataKey="negative" stroke={COLORS.negative} strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" stroke={COLORS.neutral} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Results Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Text Preview</th>
                <th className="text-left p-2">Sentiment</th>
                <th className="text-left p-2">Confidence</th>
                <th className="text-left p-2">Keywords</th>
                <th className="text-left p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((result) => (
                <tr key={result.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 max-w-xs">
                    <div className="truncate">{result.text}</div>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      result.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {result.sentiment}
                    </span>
                  </td>
                  <td className="p-2">{(result.confidence * 100).toFixed(1)}%</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {result.timestamp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SentimentVisualization;
