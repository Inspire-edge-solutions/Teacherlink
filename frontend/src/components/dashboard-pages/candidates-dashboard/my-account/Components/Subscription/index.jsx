import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import './subscription.css';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
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
  const [contactsLoading, setContactsLoading] = useState(true);

  // While auth is loading or if no user, show appropriate UI.
  if (authLoading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }
  if (!user) {
    return (
      <div className="error-message">
        Please log in to access subscription features.
      </div>
    );
  }

  // Extract firebase_uid and user_type just like in your OrgDetails page.
  const firebase_uid = user?.uid;
  const userType = user?.user_type; // Ensure this property exists in your auth context

  useEffect(() => {
    if (user?.uid) {
      const fetchInitialData = async () => {
        try {
          setLoading(true);
          // Fetch subscription and contacts in parallel
          const [subscriptionRes, contactsRes] = await Promise.all([
            fetch(`https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/${user.uid}`),
            fetch(`https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/submission/${user.uid}`)
          ]);

          const subscriptionData = await subscriptionRes.json();
          const contactsData = await contactsRes.json();

          if (subscriptionData.success) {
            setSubscription(subscriptionData.subscription);
          }

          if (contactsData.success) {
            setContacts(contactsData.contacts || []);
            setRegisteredContacts(contactsData.registeredContacts || []);
          }
        } catch (err) {
          console.error("Failed to fetch initial data:", err);
          setError("Failed to load your data");
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }
  }, [user]); // Dependency on user

  // Fetch subscription details using the firebase_uid
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/subscription/${firebase_uid}`
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

  // Fetch referral statistics (update the endpoint as needed)
  const fetchReferralStats = async () => {
    try {
      const response = await fetch('https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/register');
      const data = await response.json();
      setReferralStats(data);
    } catch (err) {
      console.error("Failed to fetch referral stats");
    }
  };

  // Fetch referral contacts already submitted for this user
  const fetchContacts = async () => {
    try {
      if (!user?.uid) return;
      
      const response = await fetch(
        `https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/submission/${user.uid}`
      );
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.contacts || []);
        setRegisteredContacts(data.registeredContacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  // Handle subscription purchase
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
            firebase_uid, // using firebase_uid from auth context
            user_type: userType, // sending the user type as well
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

  // Handle coupon submission
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build the payload including coupon_code, firebase_uid, and route.
      const payload = {
        coupon_code: couponCode,
        firebase_uid: firebase_uid,  // Ensure firebase_uid is defined in your component state or props
        route: "RedeemCoupon"
      };
  
      const response = await fetch(
        "https://2u7ec1e22c.execute-api.ap-south-1.amazonaws.com/staging/RedeemCoupon",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      
      if (data.success) {
        console.log("Coupon applied successfully");
        toast.success("Coupon applied successfully");
        
        // Clear coupon input
        setCouponCode('');
        
        // Fetch updated subscription status
        await fetchSubscription();
        
        // Show success message
        toast.success("Premium subscription activated successfully!");
        
        // Switch to subscription details view
        setActiveTab('subscription-details');
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Failed to verify coupon");
    }
  };
  // Handle adding a referral contact locally.
  const handleAddContact = async (e) => {
    e.preventDefault();
    
    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (contacts.includes(contactNumber)) {
      setError("This number has already been added");
      return;
    }

    // Just update local state, don't make API call yet
    setContacts(prev => [...prev, contactNumber]);
    setContactNumber('');
    setError(null);
  };

  // Handle bulk submission of referrals.
  // This sends all accumulated contacts as an array in the payload.
  const handleSubmitReferrals = async () => {
    const nonEmptyContacts = contacts.filter(c => c.trim() !== "");
    if (nonEmptyContacts.length < 10) {
        setError("At least 10 contact numbers are required.");
        return;
    }

    try {
        setLoading(true);
        const response = await fetch(
            'https://v0trs9tt4k.execute-api.ap-south-1.amazonaws.com/staging/submission',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebase_uid: user.uid,
                    user_type: user.user_type,
                    contacts: nonEmptyContacts
                }),
            }
        );

        const data = await response.json();
        if (data.success) {
            setError(null);
            alert("Contacts submitted successfully! We'll notify you when they register.");
            // Immediately fetch updated contacts
            await fetchContacts();
        } else {
            setError(data.message || "Failed to submit referrals");
        }
    } catch (err) {
        console.error("Submission error:", err);
        setError("Failed to submit referrals");
    } finally {
        setLoading(false);
    }
  };

  // Remove a referral contact (also call backend remove endpoint if needed)
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

  // Add periodic check for registration status
  useEffect(() => {
    if (!user?.uid || contacts.length === 0) return;

    // Check registration status every minute
    const intervalId = setInterval(() => {
      fetchContacts();
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [user, contacts.length]);

  // Add this useEffect for periodic refresh
  useEffect(() => {
    if (!user?.uid) return;

    // Initial fetch
    fetchContacts();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      fetchContacts();
    }, 30000); // Refresh every 30 seconds

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [user]);

  // Add this useEffect after your existing useEffects
  useEffect(() => {
    if (!user?.uid) return;

    // Initial fetch
    fetchContacts();

    // Set up interval to check registration status every minute
    const intervalId = setInterval(() => {
      fetchContacts();
    }, 60000); // 60000 ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [user]);

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
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

  const renderReferralContent = () => (
    <div className="referral-section">
      <div className="info-card">
        <div className="referral-header">
          <h3>Refer Teachers & Get Premium Access</h3>
          <p className="subtitle">Add 20 contact numbers of teachers and get premium when 10 register!</p>
        </div>
        
        <div className="referral-content">
          {/* Left side - Progress and Form */}
          <div className="referral-left">
            <div className="progress-container">
              <div className="progress-item">
                <label>Contacts Added</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill contacts"
                    style={{"width": `${(contacts.length / 20) * 100}%`}}
                  />
                </div>
                <span className="progress-text">{contacts.length}/20</span>
              </div>
              <div className="progress-item">
                <label>Teachers Registered</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill registered"
                    style={{"width": `${(registeredContacts.length / 10) * 100}%`}}
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
                    className="add-button"
                  >
                    Add Contact
                  </button>
                </div>
                {error && <div className="error-text">{error}</div>}
              </form>
            )}
          </div>

          {/* Right side - Contacts List */}
          <div className="contacts-list">
            <h4>Added Contacts ({contacts.length}/20)</h4>
            {loading ? (
                <div className="loading-spinner">Loading contacts...</div>
            ) : contacts.length > 0 ? (
                <div className="contacts-vertical">
                    {contacts.map((number, index) => (
                        <div key={index} className="contact-row">
                            <div className="contact-info">
                                <span className="contact-number">{number}</span>
                                <span className={`registration-status ${
                                    registeredContacts.includes(number) ? 'completed' : 'pending'
                                }`}>
                                    {registeredContacts.includes(number) 
                                        ? 'Registration Complete' 
                                        : 'Registration Pending'
                                    }
                                </span>
                            </div>
                            {!registeredContacts.includes(number) && (
                                <button
                                    onClick={() => {
                                        setContacts(contacts.filter(n => n !== number));
                                    }}
                                    className="remove-button"
                                    aria-label="Remove contact"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-contacts">No contacts added yet</p>
            )}

            {/* Submit button */}
            {contacts.length > 0 && (
              <button 
                className={`submit-button ${contacts.length >= 10 ? 'ready' : ''}`}
                onClick={handleSubmitReferrals}
                disabled={contacts.length < 10}
              >
                {contacts.length < 10 
                  ? `Add ${10 - contacts.length} more contact${10 - contacts.length === 1 ? '' : 's'} to submit`
                  : 'Submit All Contacts'
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SubscriptionDetailsView = ({ subscription }) => {
    return (
      <div className="subscription-details-view">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h3>Premium Subscription Activated!</h3>
        </div>

        <div className="details-card">
          <div className="detail-row">
            <span className="label">Status</span>
            <span className="value status-active">Active</span>
          </div>
          <div className="detail-row">
            <span className="label">Start Date</span>
            <span className="value">{new Date(subscription.start_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Valid Until</span>
            <span className="value">{new Date(subscription.end_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Plan Type</span>
            <span className="value">Premium Job Seeker</span>
          </div>
          <div className="detail-row">
            <span className="label">Coins Balance</span>
            <span className="value coins">{subscription.coins_balance} coins</span>
          </div>
        </div>

        <div className="premium-features">
          <h4>Premium Benefits Unlocked</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span className="feature-text">Priority Job Applications</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💼</span>
              <span className="feature-text">Access to Premium Jobs</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Advanced Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌟</span>
              <span className="feature-text">Featured Profile</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
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
          <span className="tab-icon">🎟</span>
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
        {activeTab === 'referral' && renderReferralContent()}
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
        {activeTab === 'subscription-details' && subscription && (
          <SubscriptionDetailsView subscription={subscription} />
        )}
      </div>
    </div>
  );
};

export default Subscription;