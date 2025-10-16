import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check } from 'lucide-react';

interface AuthModalProps {
  onLogin: (userData: { name: string; email: string }) => void;
  onClose: () => void;
}

export function AuthModal({ onLogin, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: name || 'User', email });
  };

  const benefits = [
    'Track your democracy score',
    'Save favorite companies',
    'Get personalized recommendations',
    'Make informed purchasing decisions'
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMm0tMiAyMGMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJNMTggMzZjLTEuMSAwLTItLjktMi0ycy45LTIgMi0yIDIgLjkgMiAyLS45IDItMiAyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-strong relative">
        {/* Decorative top gradient */}
        <div className="h-2 gradient-primary"></div>
        
        <div className="p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 gradient-primary rounded-3xl flex items-center justify-center shadow-medium transform hover:scale-105 transition-transform">
              <span className="text-4xl">🏷️</span>
            </div>
            <h2 className="mb-2 text-slate-900">Welcome</h2>
            <p className="text-sm text-slate-600">
              Shop your politics. Spend your values.
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-100">
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-xs text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-slate-700">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white rounded-xl py-6 shadow-medium hover:shadow-strong transition-all transform hover:scale-[1.02]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="text-teal-600 font-medium">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-teal-600 font-medium">Sign in</span>
                </>
              )}
            </button>
          </div>

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 text-center">
              <strong>Demo Mode:</strong> Use any email to explore the app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
