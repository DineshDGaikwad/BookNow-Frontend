import React, { useState } from 'react';
import Header from '../../components/common/Header';

const TestAPI: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5089/api/organizer/shows?eventId=2ea65fc5-42b3-489b-ad28-40b13186c1bd&organizerId=ORG000018', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Success in ${duration}ms - Got ${data.length} shows`);
      } else {
        setResult(`❌ Error: ${response.status} in ${duration}ms`);
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      setResult(`❌ Network Error in ${duration}ms: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">API Performance Test</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Show API'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Result:</h3>
            <p>{result}</p>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Performance Expectations:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Good:</strong> &lt;100ms</li>
            <li>• <strong>Acceptable:</strong> 100-500ms</li>
            <li>• <strong>Slow:</strong> 500ms-2s</li>
            <li>• <strong>Problem:</strong> &gt;2s</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;