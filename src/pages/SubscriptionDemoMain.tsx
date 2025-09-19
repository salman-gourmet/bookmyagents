import React from 'react';
import SubscriptionButton from '../components/common/SubscriptionButton';
import SubscriptionModal from '../modals/SubscriptionModal';
import { useSubscriptionModal } from '../hooks/UseSubscriptionModal';

const SubscriptionDemoMain = () => {
  const { isOpen, openModal, closeModal, selectSubscription } = useSubscriptionModal();

  return (
    <div className="subscription-demo-page" style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
          Subscription Plans Demo
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          Click the buttons below to see the subscription modal in action
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '50px'
      }}>
        {/* Demo Card 1 */}
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
            Travel Explorer
          </h3>
          <p style={{ color: '#666', marginBottom: '25px' }}>
            Perfect for individual travelers who want to explore the world
          </p>
          <SubscriptionButton variant="primary">
            View Travel Plans
          </SubscriptionButton>
        </div>

        {/* Demo Card 2 */}
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
            Business Traveler
          </h3>
          <p style={{ color: '#666', marginBottom: '25px' }}>
            Ideal for business professionals who travel frequently
          </p>
          <SubscriptionButton variant="outline">
            See Business Plans
          </SubscriptionButton>
        </div>

        {/* Demo Card 3 */}
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
            Family Package
          </h3>
          <p style={{ color: '#666', marginBottom: '25px' }}>
            Great for families planning their next vacation together
          </p>
          <SubscriptionButton variant="secondary">
            Family Plans
          </SubscriptionButton>
        </div>
      </div>

      {/* Direct Modal Trigger */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
          Or open the modal directly:
        </h3>
        <button
          onClick={openModal}
          style={{
            backgroundColor: '#560CE3',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a0bc7'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#560CE3'}
        >
          Open Subscription Modal
        </button>
      </div>

      {/* Features Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '40px',
        marginTop: '50px'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#333', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Features of Our Subscription Modal
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#560CE3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '24px'
            }}>
              🔄
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
              Real-time API Integration
            </h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Fetches subscription data directly from your API endpoint
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#560CE3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '24px'
            }}>
              🎨
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
              Beautiful UI Design
            </h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Modern, responsive design that matches your brand
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#560CE3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '24px'
            }}>
              ⚡
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
              Fast & Responsive
            </h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Optimized for performance with loading states and error handling
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#560CE3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '24px'
            }}>
              🔧
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
              Easy Integration
            </h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Simple to integrate with existing components and pages
            </p>
          </div>
        </div>
      </div>

      {/* Direct Modal Instance */}
      <SubscriptionModal
        isOpen={isOpen}
        onClose={closeModal}
        onSelectSubscription={selectSubscription}
      />
    </div>
  );
};

export default SubscriptionDemoMain;
