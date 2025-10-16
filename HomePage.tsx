import { Search, TrendingUp, TrendingDown, ChevronRight, Sparkles, Bell, Eye, EyeOff, AlertCircle, ExternalLink, DollarSign, BarChart3 } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { User, Category, Company } from '../App';
import { useState } from 'react';

interface HomePageProps {
  user: User | null;
  categories: Category[];
  onCompanySelect: (company: Company) => void;
  onCategorySelect: (category: Category) => void;
  onToggleCategoryVisibility: (categoryId: string) => void;
}

export function HomePage({ user, categories, onCompanySelect, onCategorySelect, onToggleCategoryVisibility }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showHiddenCategories, setShowHiddenCategories] = useState(false);

  // Get top spending by category
  const getTopSpendingByCategory = () => {
    if (!user) return [];
    
    const spendingByCategory = user.userSpending.reduce((acc, spending) => {
      if (!acc[spending.categoryId]) {
        acc[spending.categoryId] = {
          categoryId: spending.categoryId,
          totalAmount: 0,
          stores: new Set<string>()
        };
      }
      acc[spending.categoryId].totalAmount += spending.amount;
      acc[spending.categoryId].stores.add(spending.companyId);
      return acc;
    }, {} as Record<string, { categoryId: string; totalAmount: number; stores: Set<string> }>);

    return Object.values(spendingByCategory)
      .map(spending => {
        const category = categories.find(c => c.id === spending.categoryId);
        return category ? { category, totalAmount: spending.totalAmount, storeCount: spending.stores.size } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.totalAmount - a!.totalAmount)
      .slice(0, 3) as { category: Category; totalAmount: number; storeCount: number }[];
  };

  const topSpendingCategories = getTopSpendingByCategory();

  // Get all companies for trending
  const allCompanies = categories.flatMap(cat => cat.companies);
  const topCompanies = [...allCompanies]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-600';
  };

  // Order categories based on user preference
  const orderedCategories = user?.categoryOrder
    ? user.categoryOrder
        .map(id => categories.find(c => c.id === id))
        .filter(Boolean) as Category[]
    : categories;

  // Filter visible and hidden categories
  const visibleCategories = orderedCategories.filter(cat => 
    !user || user.categoryVisibility[cat.id] !== false
  );

  const hiddenCategories = orderedCategories.filter(cat =>
    user && user.categoryVisibility[cat.id] === false
  );

  const notificationsToShow = showAllNotifications 
    ? user?.notifications || []
    : (user?.notifications || []).slice(0, 2);

  // Get brand color from white label settings
  const brandColor = user?.whiteLabelSettings.color || '#14b8a6';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Header */}
      <div 
        className="px-6 pt-16 pb-12 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, #3b82f6 100%)`
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white/80" />
              <p className="text-sm text-white/80">Your Democracy Score</p>
            </div>
            <p className="text-sm text-white/90">{user?.whiteLabelSettings.mantra || 'Shop your politics. Spend your values.'}</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search companies, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 bg-white border-0 rounded-2xl shadow-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 -mt-6 relative z-10">
        {/* User Score Overview */}
        {user && (
          <Card className="gradient-card border-0 shadow-soft rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Your Overall Score</p>
                  <h2 className="text-slate-900">Democracy Index</h2>
                </div>
                <div className={`text-5xl ${getScoreColor(user.overallScore)}`}>
                  {user.overallScore}
                </div>
              </div>

              {/* Score Bar */}
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(user.overallScore)} transition-all duration-500 rounded-full`}
                  style={{ width: `${user.overallScore}%` }}
                ></div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Categories</p>
                  <p className="text-lg text-slate-900">
                    {Object.keys(user.categoryScores).length}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Spending</p>
                  <p className="text-lg text-slate-900">
                    ${user.userSpending.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Impact</p>
                  <div className="flex items-center justify-center gap-1">
                    {user.overallScore >= 70 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                    <p className="text-lg text-slate-900">
                      {user.overallScore >= 70 ? 'High' : user.overallScore >= 40 ? 'Med' : 'Low'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Notifications Section */}
        {user && user.notifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-slate-900">Score Updates</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full">
                {user.notifications.length} new
              </Badge>
            </div>

            <div className="space-y-3">
              {notificationsToShow.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 border-0 rounded-2xl shadow-soft ${
                    notification.trend === 'up'
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50'
                      : 'bg-gradient-to-r from-rose-50 to-orange-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notification.trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {notification.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-white" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900">{notification.companyName}</h4>
                        <Badge 
                          className={`text-xs border-0 ${
                            notification.trend === 'up'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {notification.oldScore} → {notification.newScore}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{notification.reason}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">{new Date(notification.date).toLocaleDateString()}</p>
                        {notification.newsUrl && (
                          <a
                            href={notification.newsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Read source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {user.notifications.length > 2 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                  className="w-full text-sm text-slate-600 hover:text-slate-900"
                >
                  {showAllNotifications ? 'Show Less' : `View ${user.notifications.length - 2} More Updates`}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Your Top Spending by Category */}
        {topSpendingCategories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-slate-900">Your Top Spending</h3>
            </div>

            <div className="space-y-3">
              {topSpendingCategories.map(({ category, totalAmount, storeCount }) => {
                const categoryScore = user?.categoryScores[category.id] || 50;
                return (
                  <Card
                    key={category.id}
                    onClick={() => onCategorySelect(category)}
                    className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 bg-white rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl">
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-slate-900 truncate mb-1">{category.name}</h4>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-purple-600" />
                            <p className="text-xs text-slate-600">${totalAmount.toLocaleString()} • {storeCount} {storeCount === 1 ? 'store' : 'stores'}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`ml-3 px-3 py-1.5 rounded-full ${getScoreColor(categoryScore)} bg-slate-50`}>
                        <span className="text-sm">{categoryScore}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Categories</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-full px-3">
                {visibleCategories.length}/{categories.length} visible
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {visibleCategories.map((category) => {
              const userScore = user?.categoryScores[category.id];
              const hasScore = userScore !== undefined;
              const isVisible = !user || user.categoryVisibility[category.id] !== false;

              return (
                <Card
                  key={category.id}
                  className="p-4 border-slate-200 bg-white rounded-2xl relative group"
                >
                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCategoryVisibility(category.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-slate-50"
                  >
                    {isVisible ? (
                      <Eye className="w-4 h-4 text-slate-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div 
                    onClick={() => onCategorySelect(category)}
                    className="flex flex-col h-full cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      {hasScore && (
                        <div className={`px-2 py-1 rounded-full text-xs ${getScoreColor(userScore)} bg-slate-50`}>
                          {userScore}
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm text-slate-900 mb-1">{category.name}</h4>
                    <p className="text-xs text-slate-500">
                      {category.companies.length} companies
                    </p>
                    <div className="mt-3 flex items-center text-xs text-teal-600 group-hover:text-teal-700">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Hidden categories section */}
          {user && hiddenCategories.length > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowHiddenCategories(!showHiddenCategories)}
                className="w-full text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                {showHiddenCategories ? 'Hide' : 'Show'} {hiddenCategories.length} Hidden {hiddenCategories.length === 1 ? 'Category' : 'Categories'}
              </Button>

              {showHiddenCategories && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {hiddenCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="p-4 border-slate-200 bg-slate-50 rounded-2xl relative group opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCategoryVisibility(category.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center z-10 hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        <Eye className="w-4 h-4 text-emerald-600" />
                      </button>

                      <div 
                        onClick={() => {
                          onToggleCategoryVisibility(category.id);
                          onCategorySelect(category);
                        }}
                        className="flex flex-col h-full cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl mb-3">
                          {category.icon}
                        </div>
                        <h4 className="text-sm text-slate-700 mb-1">{category.name}</h4>
                        <p className="text-xs text-slate-500">
                          {category.companies.length} companies
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Rated Companies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-slate-900">Top Rated Companies</h3>
          </div>

          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <Card
                key={company.id}
                onClick={() => onCompanySelect(company)}
                className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 bg-white rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">{company.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900 truncate">{company.name}</h4>
                        {index === 0 && (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs px-2 py-0">
                            #1
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{company.description}</p>
                    </div>
                  </div>
                  <div className={`ml-3 px-3 py-1.5 rounded-full ${getScoreColor(company.score)} bg-emerald-50`}>
                    <span className="text-sm">{company.score}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
