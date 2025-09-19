import React, { useState } from 'react';
import SubscriptionModal from '../modals/SubscriptionModal';
import { useSubscriptionModal } from '../hooks/UseSubscriptionModal';
import { subscriptionService, type Subscription } from '../services/subscriptionService';

const SubscriptionTestMain = () => {
  const { isOpen, openModal, closeModal, selectSubscription } = useSubscriptionModal();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiConnection = async () => {
    setIsTesting(true);
    addTestResult('Testing API connection...');
    
    try {
      const response = await subscriptionService.getSubscriptions();
      addTestResult(`✅ API connection successful! Found ${response.subscriptions.length} subscriptions`);
      addTestResult(`Total subscriptions: ${response.total}`);
      
      if (response.subscriptions.length > 0) {
        addTestResult('Sample subscription data:');
        response.subscriptions.slice(0, 2).forEach((sub, index) => {
          addTestResult(`  ${index + 1}. ${sub.name} - $${sub.price} (${sub.features.length} features)`);
        });
      }
    } catch (error: any) {
      addTestResult(`❌ API connection failed: ${error.message}`);
      if (error.response) {
        addTestResult(`Status: ${error.response.status} - ${error.response.statusText}`);
        addTestResult(`Response: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        addTestResult('No response received from server');
        addTestResult('Make sure your backend server is running on http://localhost:3000');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const handleSelectSubscription = (subscription: Subscription) => {
    selectSubscription(subscription);
    addTestResult(`✅ Selected subscription: ${subscription.name} - $${subscription.price}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
          Subscription API Test
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Test the subscription modal with real API calls
        </p>
      </div>

      {/* Test Controls */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
          API Test Controls
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={testApiConnection}
            disabled={isTesting}
            style={{
              backgroundColor: isTesting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: isTesting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isTesting ? 'Testing...' : 'Test API Connection'}
          </button>
          
          <button
            onClick={openModal}
            style={{
              backgroundColor: '#560CE3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Open Subscription Modal
          </button>
          
          <button
            onClick={clearTestResults}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #e9ecef',
        minHeight: '200px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
          Test Results
        </h3>
        {testResults.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Click "Test API Connection" to start testing the subscription API
          </p>
        ) : (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '14px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc', marginBottom: '15px' }}>
          📋 Instructions
        </h3>
        <ol style={{ color: '#333', lineHeight: '1.6' }}>
          <li><strong>Start your backend server</strong> on <code>http://localhost:3000</code></li>
          <li><strong>Implement the subscription endpoints</strong> as documented in <code>API_ENDPOINTS.md</code></li>
          <li><strong>Click "Test API Connection"</strong> to verify the API is working</li>
          <li><strong>Click "Open Subscription Modal"</strong> to see the modal with real data</li>
          <li><strong>Check the test results</strong> for detailed information about API responses</li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
          <strong>💡 Tip:</strong> If you get connection errors, make sure your backend server is running and implements the <code>GET /api/subscription</code> endpoint.
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isOpen}
        onClose={closeModal}
        onSelectSubscription={handleSelectSubscription}
      />
    </div>
  );
};

export default SubscriptionTestMain;
