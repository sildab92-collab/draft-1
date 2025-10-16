import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import type { User } from '../App';

interface SettingsPageProps {
  user: User | null;
  onUpdatePreferences: (preferences: User['preferences']) => void;
  onLogout: () => void;
}

export function SettingsPage({ user, onUpdatePreferences, onLogout }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'values'>('branding');
  const [appTagline, setAppTagline] = useState('Shop your politics. Spend your values.');

  if (!user) {
    return null;
  }

  const handleSaveChanges = () => {
    // Save app customizations
    console.log('Saving app tagline:', appTagline);
  };

  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'content', label: 'Content' },
    { id: 'values', label: 'Values' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">Back to Profile</span>
        </div>
        
        <h1 className="text-2xl font-medium mb-2">Customize Your Experience</h1>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* App Logo Section */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">App Logo</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <Button variant="outline" className="mb-2">
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500 ml-2">No file chosen</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a square image (recommended 512×512px)
                  </p>
                </div>
              </div>
            </div>

            {/* App Tagline Section */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">App Tagline/Mantra</h3>
              
              <Textarea
                value={appTagline}
                onChange={(e) => setAppTagline(e.target.value)}
                className="w-full min-h-[80px] resize-none"
                placeholder="Enter your app tagline..."
              />
              
              <p className="text-xs text-gray-500 mt-2">
                This will appear on the home screen and marketing materials
              </p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Content Preferences</h3>
            <p className="text-gray-600">Content customization options coming soon...</p>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Values Configuration</h3>
            <p className="text-gray-600">Values customization options coming soon...</p>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8">
          <Button 
            onClick={handleSaveChanges}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}