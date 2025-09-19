import { useState } from 'react';
import { type Subscription } from '../services/subscriptionService';

export const useSubscriptionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedSubscription(null);
  };

  const selectSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    // You can add additional logic here like:
    // - Save to localStorage
    // - Update user profile
    // - Redirect to payment page
    // - Show success message
    console.log('Selected subscription:', subscription);
  };

  return {
    isOpen,
    selectedSubscription,
    openModal,
    closeModal,
    selectSubscription
  };
};
