import React from 'react';
import { useSubscriptionModal } from '../../hooks/UseSubscriptionModal';
import SubscriptionModal from '../../modals/SubscriptionModal';

interface SubscriptionButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'outline';
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  children = 'View Subscription Plans',
  className = '',
  style = {},
  variant = 'primary'
}) => {
  const { isOpen, openModal, closeModal, selectSubscription } = useSubscriptionModal();

  const getButtonStyles = () => {
    const baseStyles: React.CSSProperties = {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      ...style
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: '#560CE3',
          color: 'white',
          ':hover': {
            backgroundColor: '#4a0bc7'
          }
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: '#6c757d',
          color: 'white',
          ':hover': {
            backgroundColor: '#5a6268'
          }
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: '#560CE3',
          border: '2px solid #560CE3',
          ':hover': {
            backgroundColor: '#560CE3',
            color: 'white'
          }
        };
      default:
        return baseStyles;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonStyles = getButtonStyles();
    if (buttonStyles[':hover']) {
      Object.assign(e.currentTarget.style, buttonStyles[':hover']);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonStyles = getButtonStyles();
    Object.assign(e.currentTarget.style, buttonStyles);
  };

  return (
    <>
      <button
        className={`subscription-button ${className}`}
        style={getButtonStyles()}
        onClick={openModal}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>

      <SubscriptionModal
        isOpen={isOpen}
        onClose={closeModal}
        onSelectSubscription={selectSubscription}
      />
    </>
  );
};

export default SubscriptionButton;
