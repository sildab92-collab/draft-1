import { Home, Compass, Tag, User } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'home' | 'browse' | 'white-label' | 'profile' | 'settings';
  onPageChange: (page: 'home' | 'browse' | 'white-label' | 'profile') => void;
}

export function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'browse' as const, icon: Compass, label: 'Browse' },
    { id: 'white-label' as const, icon: Tag, label: 'White Label' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto">
      <div className="glass-effect border-t border-slate-200 shadow-strong">
        <nav className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                  isActive
                    ? 'text-teal-600 bg-gradient-to-br from-teal-50 to-blue-50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-xs transition-all ${
                    isActive ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
