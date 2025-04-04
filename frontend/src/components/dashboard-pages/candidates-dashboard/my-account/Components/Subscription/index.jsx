import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import './subscription.css';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth(); // Get user from auth context
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('payment');
  const [couponCode, setCouponCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulRegistrations: 0
  });
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [registeredContacts, setRegisteredContacts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
    fetchReferralStats();
    fetchContacts();
  }, [user]); // Fetch subscription when user is available

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/${user.uid}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (err) {
      setError("Failed to fetch subscription details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`/api/referrals/stats`);
      const data = await response.json();
      setReferralStats(data);
    } catch (err) {
      console.error("Failed to fetch referral stats");
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/referrals/${user.uid}`
      );
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts || []);
        setRegisteredContacts(data.registeredContacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contacts");
    }
  };

  const handlePurchase = async (method) => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/PurchaseSubscription',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: user.uid, // Use user.uid from auth context
            subscription_type: 'jobseeker',
            start_date: new Date().toISOString().split('T')[0],
            payment_amount: 8000,
            purchase_method: method,
            coupon_code: method === 'coupon' ? couponCode : undefined
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchSubscription();
        setError(null);
      } else {
        setError(data.message || "Purchase failed");
      }
    } catch (err) {
      setError("Failed to process subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subscription/verify-coupon', {
        method: 'POST',
        body: JSON.stringify({ couponCode })
      });
      const data = await response.json();
      if (data.success) {
        fetchSubscription();
      } else {
        setError("Invalid coupon code");
      }
    } catch (err) {
      setError("Failed to verify coupon");
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    // Basic phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // Check if number already exists
    if (contacts.includes(contactNumber)) {
      setError("This number has already been added");
      return;
    }

    try {
      const response = await fetch(
        'https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/add-referral',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: user.uid,
            contact_number: contactNumber
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setContacts([...contacts, contactNumber]);
        setContactNumber('');
        setError(null);
      } else {
        setError(data.message || "Failed to add contact");
      }
    } catch (err) {
      setError("Failed to add contact");
    }
  };

  const handleRemoveContact = async (numberToRemove) => {
    try {
      const response = await fetch(
        'https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/remove-referral',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebase_uid: user.uid,
            contact_number: numberToRemove
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setContacts(contacts.filter(num => num !== numberToRemove));
        setError(null);
      }
    } catch (err) {
      setError("Failed to remove contact");
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  // Show error if user is not authenticated
  if (!user) {
    return (
      <div className="error-message">
        Please log in to access subscription features
      </div>
    );
  }

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  if (subscription?.active) {
    return (
      <div className="active-subscription">
        <h2>Active Subscription</h2>
        <div className="subscription-details">
          <p>Valid until: {new Date(subscription.endDate).toLocaleDateString()}</p>
          <p>Status: Active</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="subscription-container">
        <h3 className="main-title">Premium Subscription</h3>
        
        <div className="subscription-tabs">
          <button 
            className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <span className="tab-icon">💳</span>
            Pay with Razorpay
          </button>
          <button 
            className={`tab ${activeTab === 'referral' ? 'active' : ''}`}
            onClick={() => setActiveTab('referral')}
          >
            <span className="tab-icon">👥</span>
            Refer Friends
          </button>
          <button 
            className={`tab ${activeTab === 'coupon' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupon')}
          >
            <span className="tab-icon">🎟️</span>
            Use Coupon
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'payment' && (
            <div className="payment-section">
              <div className="price-card">
                <div className="card-header">
                  <h3>Premium Job Seeker</h3>
                  <div className="price">
                    <span className="currency">₹</span>
                    <span className="amount">8,000</span>
                    <span className="period">/year</span>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="features">
                    <li><span className="check">✓</span> Access to Premium Jobs</li>
                    <li><span className="check">✓</span> Priority Application Processing</li>
                    <li><span className="check">✓</span> 8000 Coins Balance</li>
                    <li><span className="check">✓</span> 1 Year Validity</li>
                  </ul>
                  <button className="purchase-btn" onClick={() => handlePurchase('payment')}>
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="referral-section">
              <div className="info-card">
                <div className="referral-header">
                  <h3>Refer Teachers & Get Premium Access</h3>
                  <p className="subtitle">Add 20 contact number of teachers and get premium when 10 register!</p>
                </div>
                
                <div className="progress-container">
                  <div className="progress-item">
                    <label>Contacts Added</label>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill contacts"
                        style={{ width: `${(contacts.length / 20) * 100}%` }}
                      />
                    </div>
                    <span className="progress-text">{contacts.length}/20</span>
                  </div>
                  
                  <div className="progress-item">
                    <label>Teachers Registered</label>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill registered"
                        style={{ width: `${(registeredContacts.length / 10) * 100}%` }}
                      />
                    </div>
                    <span className="progress-text">{registeredContacts.length}/10</span>
                  </div>
                </div>

                {contacts.length < 20 && (
                  <form onSubmit={handleAddContact} className="contact-form">
                    <div className="input-group">
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter Teacher's mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                      />
                      <button 
                        type="submit"
                        disabled={contacts.length >= 20}
                      >
                        Add Contact
                      </button>
                    </div>
                    {error && <div className="error-text">{error}</div>}
                  </form>
                )}

                <div className="contacts-list">
                  <h4>Added Contacts</h4>
                  {contacts.length > 0 ? (
                    <div className="contacts-grid">
                      {contacts.map((number, index) => (
                        <div key={index} className="contact-item">
                          <span className={registeredContacts.includes(number) ? 'registered' : ''}>
                            {number}
                            {registeredContacts.includes(number) && 
                              <span className="status-icon">✓</span>
                            }
                          </span>
                          <button 
                            onClick={() => handleRemoveContact(number)}
                            className="remove-button"
                            aria-label="Remove contact"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-contacts">No contacts added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coupon' && (
            <div className="coupon-section">
              <div className="info-card">
                <h3>Have a Coupon Code?</h3>
                <p className="subtitle">Enter your coupon code to get premium access</p>
                <form onSubmit={handleCouponSubmit} className="coupon-form">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit">Apply Coupon</button>
                  </div>
                  {error && <div className="error-text">{error}</div>}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;