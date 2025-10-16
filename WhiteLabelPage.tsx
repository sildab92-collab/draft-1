import { useState } from 'react';
import { Palette, Type, Layout, Upload, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import type { User, WhiteLabelSettings } from '../App';

interface WhiteLabelPageProps {
  user: User;
  onUpdateSettings: (settings: WhiteLabelSettings) => void;
}

export function WhiteLabelPage({ user, onUpdateSettings }: WhiteLabelPageProps) {
  const [settings, setSettings] = useState<WhiteLabelSettings>(user.whiteLabelSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean gradients and glass effects' },
    { id: 'classic', name: 'Classic', description: 'Traditional and timeless design' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and focused interface' }
  ];

  const presetColors = [
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#22c55e' }
  ];

  const handleChange = (field: keyof WhiteLabelSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateSettings(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(user.whiteLabelSettings);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-8">
      {/* Header */}
      <div className="gradient-primary px-6 pt-16 pb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white mb-1">White Label Settings</h1>
              <p className="text-sm text-teal-100">Customize your brand experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 -mt-6 relative z-10">
        {/* Preview Card */}
        <Card 
          className="p-6 border-0 shadow-soft rounded-3xl overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${settings.color}15 0%, ${settings.color}05 100%)`
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Live Preview</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div 
              className="h-2 w-24 rounded-full mb-4"
              style={{ backgroundColor: settings.color }}
            />
            <h2 className="mb-2 text-slate-900">{settings.title || 'Your App Title'}</h2>
            <p className="text-sm text-slate-600 mb-4">{settings.mantra || 'Your brand mantra here'}</p>
            <div className="flex gap-2">
              <Badge 
                className="border-0"
                style={{ 
                  backgroundColor: `${settings.color}20`,
                  color: settings.color 
                }}
              >
                {settings.template}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Title Settings */}
        <Card className="p-6 border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">App Title</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-slate-600">
              Customize your app name
            </Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., My Political Shopping"
              className="rounded-xl border-slate-200"
            />
          </div>
        </Card>

        {/* Mantra Settings */}
        <Card className="p-6 border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Brand Mantra</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mantra" className="text-sm text-slate-600">
              Your brand message or tagline
            </Label>
            <Textarea
              id="mantra"
              value={settings.mantra}
              onChange={(e) => handleChange('mantra', e.target.value)}
              placeholder="e.g., Shop your politics. Spend your values."
              className="rounded-xl border-slate-200 min-h-20"
            />
          </div>
        </Card>

        {/* Template Settings */}
        <Card className="p-6 border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Design Template</h3>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleChange('template', template.id as 'modern' | 'classic' | 'minimal')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  settings.template === template.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-900">{template.name}</span>
                  {settings.template === template.id && (
                    <Badge className="bg-teal-500 text-white border-0 text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-600">{template.description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Color Settings */}
        <Card className="p-6 border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Brand Color</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleChange('color', color.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    settings.color === color.value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-soft"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-slate-700">{color.name}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-color" className="text-sm text-slate-600">
                Or enter custom hex color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-color"
                  value={settings.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="#14b8a6"
                  className="rounded-xl border-slate-200"
                />
                <div
                  className="w-12 h-10 rounded-xl border-2 border-slate-200 shrink-0"
                  style={{ backgroundColor: settings.color }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Logo Upload */}
        <Card className="p-6 border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Custom Logo</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Upload your brand logo to personalize the app header
            </p>
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-200 hover:bg-slate-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo Image
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Recommended size: 200x200px, PNG or SVG format
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-20">
            <Card className="p-4 border-0 shadow-strong rounded-2xl glass-effect">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 rounded-xl border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white border-0"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
