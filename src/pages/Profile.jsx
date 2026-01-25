// pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCalls } from '../utils/api';
import Header from '../components/Header';
import TagGroupSelector from '../components/TagGroupSelector';
import { toast } from 'react-hot-toast';
import { User, Mail, Settings, Bell, Tag, Save, Check, X, Trash2, BarChart3 } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import ActivityChart from '../components/ActivityChart';
import DifficultyChart from '../components/DifficultyChart';
import TagPerformance from '../components/TagPerformance';
import PlatformStats from '../components/PlatformStats';

export function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'emails', 'preferences', 'stats'
  
  // Profile data
  const [profile, setProfile] = useState(null);
  
  // Email data
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStep, setVerificationStep] = useState('idle'); // 'idle', 'code-sent', 'verifying'
  const [emailToVerify, setEmailToVerify] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  
  // Mail preferences
  const [allTags, setAllTags] = useState([]);
  const [mailPreferences, setMailPreferences] = useState({
    alwayson: false,
    problemsToMail: 3,
    selectedTags: [],
    preferredDifficulty: '' // '' means any difficulty, or 'A', 'B', 'C', 'D', 'E', 'F'
  });

  // Stats data
  const [detailedStats, setDetailedStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("autotoken699")) {
      navigate('/signin');
    } else {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchEmails(),
        fetchTags()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await apiCalls.getProfile();
      if (response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);
        setMailPreferences(prev => ({
          ...prev,
          alwayson: profileData?.dailymail || false,
          problemsToMail: profileData?.problemsToMail || 3,
          selectedTags: profileData?.tags?.map(t => t.id) || [],
          preferredDifficulty: profileData?.preferredDifficulty || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await apiCalls.getEmails();
      if (response.data.success) {
        setEmails(response.data.emails || []);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await apiCalls.getAllTags();
      if (response.data.success) {
        setAllTags(response.data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchDetailedStats = async () => {
    try {
      setStatsLoading(true);
      const response = await apiCalls.getDetailedStats();
      if (response.data.success) {
        setDetailedStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("autotoken699")) {
      navigate('/signin');
    } else {
      fetchAllData();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'stats' && !detailedStats) {
      fetchDetailedStats();
    }
  }, [activeTab]);

  const handleSendVerificationCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (sendingCode) return; // Prevent multiple clicks

    try {
      setSendingCode(true);
      const response = await apiCalls.sendVerificationCode(newEmail);
      if (response.data.success) {
        toast.success('Verification code sent to ' + newEmail);
        setEmailToVerify(newEmail);
        setVerificationStep('code-sent');
      } else {
        toast.error(response.data.message || 'Failed to send code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
      toast.error('Please enter the 4-digit code');
      return;
    }

    try {
      setVerificationStep('verifying');
      console.log('Verifying code for email:', emailToVerify);
      console.log('Verification code:', verificationCode);
      
      const response = await apiCalls.verifyCode(emailToVerify, verificationCode);
      console.log('Verification response:', response.data);
      
      if (response.data.success) {
        // Now add the email to user's account
        console.log('Adding email to account:', emailToVerify);
        try {
          const addEmailResponse = await apiCalls.addEmail(emailToVerify);
          console.log('Add email response:', addEmailResponse.data);
          
          if (addEmailResponse.data.success) {
            toast.success('Email verified and added!');
            setNewEmail('');
            setVerificationCode('');
            setEmailToVerify('');
            setVerificationStep('idle');
            fetchEmails(); // Refresh email list
          } else {
            toast.error(addEmailResponse.data.message || 'Failed to add email');
            setVerificationStep('idle');
          }
        } catch (addEmailError) {
          console.error('Error adding email:', addEmailError);
          console.error('Add email error response:', addEmailError.response?.data);
          console.error('Error status:', addEmailError.response?.status);
          console.error('Error message:', addEmailError.response?.data?.message);
          
          // Check the actual error message from backend
          const backendMessage = addEmailError.response?.data?.message || '';
          const isAlreadyAdded = backendMessage.toLowerCase().includes('already') || 
                                 backendMessage.toLowerCase().includes('duplicate') ||
                                 addEmailError.response?.data?.success === true;
          
          if (isAlreadyAdded) {
            toast.success('Email already added to your account');
            setNewEmail('');
            setVerificationCode('');
            setEmailToVerify('');
            setVerificationStep('idle');
            fetchEmails();
          } else {
            // Show the actual backend error message
            toast.error(backendMessage || 'Failed to add email. Please try again.');
            setVerificationStep('idle');
          }
        }
      } else {
        const errorMsg = response.data.message || 'Invalid code';
        console.error('Verification failed:', errorMsg);
        toast.error(errorMsg);
        setVerificationStep('code-sent');
      }
    } catch (error) {
      console.error('Error during verification process:', error);
      console.error('Error response:', error.response?.data);
      
      // Show more specific error message
      const errorMsg = error.response?.data?.message || error.message || 'Verification failed';
      toast.error(errorMsg);
      setVerificationStep('code-sent');
    }
  };

  const handleToggleDailyMail = async () => {
    try {
      const newValue = !mailPreferences.alwayson;
      const response = await apiCalls.toggleDailyMail(newValue);
      
      if (response.data.success) {
        setMailPreferences(prev => ({ ...prev, alwayson: newValue }));
        toast.success(`Daily mail ${newValue ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error toggling daily mail:', error);
      toast.error('Failed to update setting');
    }
  };

  const handleSaveMailPreferences = async () => {
    try {
      setSaving(true);
      
      const response = await apiCalls.updateMailPreferences({
        problemsToMail: mailPreferences.problemsToMail,
        tagIds: mailPreferences.selectedTags,
        preferredDifficulty: mailPreferences.preferredDifficulty || null
      });
      
      if (response.data.success) {
        toast.success('Mail preferences saved!');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving mail preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleTagsChange = (newTags) => {
    setMailPreferences(prev => ({
      ...prev,
      selectedTags: newTags
    }));
  };

  const handleDeleteEmail = async (email) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) {
      return;
    }

    try {
      const response = await apiCalls.deleteEmail(email);
      if (response.data.success) {
        toast.success('Email removed successfully');
        fetchEmails();
      } else {
        toast.error('Failed to remove email');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to remove email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your account, email preferences, and daily problem settings
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Mobile: Dropdown Tabs */}
          <div className="md:hidden border-b border-gray-200">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 text-base font-medium text-gray-900 bg-white border-0 focus:ring-2 focus:ring-blue-500 rounded-t-lg"
            >
              <option value="profile">👤 Profile</option>
              <option value="stats">📊 Statistics</option>
              <option value="emails">📧 Email Addresses</option>
              <option value="preferences">⚙️ Mail Preferences</option>
            </select>
          </div>

          {/* Desktop: Tab Buttons */}
          <div className="hidden md:block border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="inline w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stats'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="inline w-4 h-4 mr-2" />
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('emails')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'emails'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="inline w-4 h-4 mr-2" />
                Email Addresses
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'preferences'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="inline w-4 h-4 mr-2" />
                Mail Preferences
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                        {profile?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                        {profile?.username || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base break-all">
                        {profile?.email || 'Not set'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600">Daily Mail</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {mailPreferences.alwayson ? 'ON' : 'OFF'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600">Problems/Day</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {mailPreferences.problemsToMail}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600">Preferred Tags</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {mailPreferences.selectedTags.length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600">Email Addresses</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        {emails.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {statsLoading ? (
                  <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : detailedStats ? (
                  <>
                    <StatsOverview stats={detailedStats} />
                    
                    <ActivityChart data={detailedStats.last30Days} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DifficultyChart difficultyStats={detailedStats.difficultyStats} />
                      <PlatformStats platformStats={detailedStats.platformStats} />
                    </div>
                    
                    <TagPerformance tagStats={detailedStats.tagStats} />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No statistics available yet</p>
                    <p className="text-sm text-gray-500 mt-2">Start solving problems to see your stats!</p>
                  </div>
                )}
              </div>
            )}

            {/* Email Addresses Tab */}
            {activeTab === 'emails' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Manage Email Addresses</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Add multiple email addresses to receive daily coding problems. All verified emails will receive the daily problems.
                  </p>
                </div>

                {/* Add New Email */}
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Add New Email</h3>
                  
                  {verificationStep === 'idle' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        disabled={sendingCode}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !sendingCode) {
                            handleSendVerificationCode();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode || !newEmail}
                        className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] text-base sm:text-sm font-medium"
                      >
                        {sendingCode ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          'Send Code'
                        )}
                      </button>
                    </div>
                  )}

                  {verificationStep === 'code-sent' && (
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        We sent a 4-digit code to <strong className="break-all">{emailToVerify}</strong>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Enter 4-digit code"
                          maxLength="4"
                          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && verificationCode.length === 4) {
                              handleVerifyCode();
                            }
                          }}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleVerifyCode}
                            disabled={verificationCode.length !== 4}
                            className="flex-1 sm:flex-none px-6 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setVerificationStep('idle');
                              setVerificationCode('');
                              setEmailToVerify('');
                            }}
                            className="flex-1 sm:flex-none px-6 py-3 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationStep === 'verifying' && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-700">Verifying...</span>
                    </div>
                  )}
                </div>

                {/* Email List */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Your Email Addresses</h3>
                  {emails.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No additional emails added yet</p>
                      <p className="text-sm text-gray-500 mt-1">Add an email above to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {emails.map((email, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg gap-3"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-900 truncate text-sm sm:text-base">{email}</span>
                          </div>
                          <div className="flex items-center gap-2 justify-between sm:justify-end">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full">
                              Verified
                            </span>
                            <button
                              onClick={() => handleDeleteEmail(email)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                              title="Remove email"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mail Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Daily Mail Settings</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure how many problems you want to receive and which topics interest you
                  </p>
                </div>

                {/* Enable/Disable Daily Mail */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Daily Problem Emails
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive coding problems in your inbox every day
                      </p>
                    </div>
                    <button
                      onClick={handleToggleDailyMail}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        mailPreferences.alwayson ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          mailPreferences.alwayson ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {mailPreferences.alwayson && (
                  <>
                    {/* Number of Problems */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Number of Problems Per Day
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={mailPreferences.problemsToMail}
                          onChange={(e) => setMailPreferences(prev => ({
                            ...prev,
                            problemsToMail: parseInt(e.target.value)
                          }))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="w-16 text-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {mailPreferences.problemsToMail}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: 3-5 problems per day
                      </p>
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Difficulty
                      </label>
                      <p className="text-sm text-gray-600 mb-4">
                        Select a difficulty level for problems, or leave as "Any" for mixed difficulties.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: '', label: 'Any', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                          { value: 'A', label: 'A (Easy)', color: 'bg-green-100 text-green-700 border-green-300' },
                          { value: 'B', label: 'B', color: 'bg-lime-100 text-lime-700 border-lime-300' },
                          { value: 'C', label: 'C', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                          { value: 'D', label: 'D', color: 'bg-orange-100 text-orange-700 border-orange-300' },
                          { value: 'E', label: 'E', color: 'bg-red-100 text-red-700 border-red-300' },
                          { value: 'F', label: 'F (Hard)', color: 'bg-purple-100 text-purple-700 border-purple-300' },
                        ].map((diff) => (
                          <button
                            key={diff.value}
                            onClick={() => setMailPreferences(prev => ({ ...prev, preferredDifficulty: diff.value }))}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                              mailPreferences.preferredDifficulty === diff.value
                                ? `${diff.color} border-current ring-2 ring-offset-1 ring-current`
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {diff.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tag Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Tag className="inline w-4 h-4 mr-1" />
                        Preferred Topics/Tags
                      </label>
                      <p className="text-sm text-gray-600 mb-4">
                        Select tag groups to add all related tags, or pick individual tags. Leave empty for all topics.
                      </p>
                      <TagGroupSelector
                        allTags={allTags}
                        selectedTags={mailPreferences.selectedTags}
                        onTagsChange={handleTagsChange}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                      <button
                        onClick={handleSaveMailPreferences}
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
