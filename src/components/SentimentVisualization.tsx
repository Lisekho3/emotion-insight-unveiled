
import { Card } from "@/components/ui/card";
import { SentimentResult } from "@/types/sentiment";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SentimentVisualizationProps {
  results: SentimentResult[];
}

const COLORS = {
  positive: '#10b981',
  negative: '#f43f5e',
  neutral: '#64748b'
};

const SentimentVisualization = ({ results }: SentimentVisualizationProps) => {
  if (results.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-dashed rounded-full" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">No Data Available</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Analyze some text to see beautiful visualizations and insights here.
          </p>
        </div>
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
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
          <div className="text-3xl font-bold text-blue-600 mb-2 transition-transform duration-300 group-hover:scale-110">{results.length}</div>
          <div className="text-sm font-medium text-blue-700">Total Analyses</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
          <div className="text-3xl font-bold text-emerald-600 mb-2 transition-transform duration-300 group-hover:scale-110">{sentimentCounts.positive}</div>
          <div className="text-sm font-medium text-emerald-700">Positive</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
          <div className="text-3xl font-bold text-rose-600 mb-2 transition-transform duration-300 group-hover:scale-110">{sentimentCounts.negative}</div>
          <div className="text-sm font-medium text-rose-700">Negative</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
          <div className="text-3xl font-bold text-slate-600 mb-2 transition-transform duration-300 group-hover:scale-110">{sentimentCounts.neutral}</div>
          <div className="text-sm font-medium text-slate-700">Neutral</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-semibold mb-6 text-slate-700">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Confidence Scores */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-semibold mb-6 text-slate-700">Confidence Scores</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="index" stroke="#64748b" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Confidence']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="confidence" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
        <h3 className="text-xl font-semibold mb-6 text-slate-700">Recent Analysis Timeline</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="analysis" stroke="#64748b" />
            <YAxis domain={[0, 100]} stroke="#64748b" />
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Confidence']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="positive" 
              stroke={COLORS.positive} 
              strokeWidth={3}
              dot={{ fill: COLORS.positive, strokeWidth: 2, r: 4 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="negative" 
              stroke={COLORS.negative} 
              strokeWidth={3}
              dot={{ fill: COLORS.negative, strokeWidth: 2, r: 4 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="neutral" 
              stroke={COLORS.neutral} 
              strokeWidth={3}
              dot={{ fill: COLORS.neutral, strokeWidth: 2, r: 4 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Results Table */}
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
        <h3 className="text-xl font-semibold mb-6 text-slate-700">Analysis History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-medium text-slate-600">Text Preview</th>
                <th className="text-left p-4 font-medium text-slate-600">Sentiment</th>
                <th className="text-left p-4 font-medium text-slate-600">Confidence</th>
                <th className="text-left p-4 font-medium text-slate-600">Keywords</th>
                <th className="text-left p-4 font-medium text-slate-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((result) => (
                <tr key={result.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="p-4 max-w-xs">
                    <div className="truncate text-slate-700">{result.text}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
                      result.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      result.sentiment === 'negative' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {result.sentiment}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-blue-600">{(result.confidence * 100).toFixed(1)}%</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200 transition-all duration-300 hover:bg-blue-100">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
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
