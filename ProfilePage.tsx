import { Share, TrendingUp, Award, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import type { User, Category, Company } from '../App';

interface ProfilePageProps {
  user: User | null;
  categories: Category[];
  onLogin: () => void;
  onCompanySelect: (company: Company) => void;
  onCategorySelect?: (category: Category) => void;
}

export function ProfilePage({ user, categories, onLogin, onCompanySelect, onCategorySelect }: ProfilePageProps) {
  if (!user || user.isGuest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">👤</span>
          </div>
          <h2 className="mb-2">Join White Label</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Create an account to track your democracy score and see how your spending aligns with your values
          </p>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white w-full rounded-xl"
            onClick={onLogin}
          >
            Sign Up / Login
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  // Get spending by category
  const spendingByCategory = user.userSpending.reduce((acc, spending) => {
    if (!acc[spending.categoryId]) {
      acc[spending.categoryId] = {
        totalAmount: 0,
        companies: new Set<string>()
      };
    }
    acc[spending.categoryId].totalAmount += spending.amount;
    acc[spending.categoryId].companies.add(spending.companyId);
    return acc;
  }, {} as Record<string, { totalAmount: number; companies: Set<string> }>);

  const totalSpending = user.userSpending.reduce((sum, s) => sum + s.amount, 0);
  const uniqueCompanies = new Set(user.userSpending.map(s => s.companyId)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user.name}</h2>
              <p className="text-sm text-gray-600">Conscious Consumer</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="px-4 py-6">
        <Card className={`p-6 bg-gradient-to-br ${getScoreGradient(user.overallScore)} text-white overflow-hidden relative`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Your Democracy Score</p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-white">{user.overallScore}</h1>
                  <span className="text-white/80">/100</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/90">
              🎉 Living your democracy values
            </p>
            <p className="text-xs text-white/70 mt-1">
              Based on your spending patterns and company alignments
            </p>
          </div>
          {/* Decorative background */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -left-4 top-0 w-24 h-24 bg-white/10 rounded-full"></div>
        </Card>
      </div>

      {/* Spending Overview */}
      <div className="px-4 py-6">
        <h2 className="mb-4">Spending Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-purple-900">Total Tracked</p>
            </div>
            <p className="text-2xl text-purple-900">${totalSpending.toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 border-0">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-blue-900">Companies</p>
            </div>
            <p className="text-2xl text-blue-900">{uniqueCompanies}</p>
          </Card>
        </div>
      </div>

      {/* Category Scores */}
      <div className="px-4 py-6">
        <h2 className="mb-4">Spending by Category</h2>
        <p className="text-sm text-gray-600 mb-6">
          Track how your spending aligns with your values in each category
        </p>
        
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryScore = user.categoryScores[category.id];
            const categorySpending = spendingByCategory[category.id];
            
            if (!categorySpending) return null;

            return (
              <Card key={category.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <h4 className="text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-600">
                        ${categorySpending.totalAmount.toLocaleString()} • {categorySpending.companies.size} stores
                      </p>
                    </div>
                  </div>
                  {categoryScore !== undefined && (
                    <div className={`text-xl ${getScoreColor(categoryScore)}`}>
                      {categoryScore}
                    </div>
                  )}
                </div>
                
                {categoryScore !== undefined && (
                  <div className="space-y-2">
                    <Progress 
                      value={categoryScore} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500">
                      Category alignment score
                    </p>
                  </div>
                )}

                {/* List companies in this category where user has spent */}
                <div className="mt-4 space-y-2">
                  {user.userSpending
                    .filter(s => s.categoryId === category.id)
                    .reduce((acc, spending) => {
                      if (!acc.find(s => s.companyId === spending.companyId)) {
                        const company = category.companies.find(c => c.id === spending.companyId);
                        if (company) {
                          const totalSpent = user.userSpending
                            .filter(s => s.companyId === spending.companyId)
                            .reduce((sum, s) => sum + s.amount, 0);
                          acc.push({ company, totalSpent });
                        }
                      }
                      return acc;
                    }, [] as { company: Company; totalSpent: number }[])
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map(({ company, totalSpent }) => (
                      <div
                        key={company.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompanySelect(company);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm block truncate">{company.name}</span>
                          <span className="text-xs text-gray-500">${totalSpent.toLocaleString()}</span>
                        </div>
                        <span className={`text-xs ml-2 ${getScoreColor(company.score)}`}>
                          {company.score}
                        </span>
                      </div>
                    ))}
                </div>

                {/* View All Button */}
                {onCategorySelect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategorySelect(category);
                    }}
                    className="w-full mt-4 text-xs"
                  >
                    View All Companies in {category.name}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(spendingByCategory).length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Start Tracking Your Spending</h3>
            <p className="text-sm text-gray-600 mb-4">
              Browse companies and track your spending to see your democracy score
            </p>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              Browse Companies
            </Button>
          </Card>
        )}
      </div>

      {/* Impact Summary */}
      <div className="px-4 py-6">
        <h3 className="mb-4">Your Impact</h3>
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Companies Tracked</span>
              <span>{uniqueCompanies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Categories Engaged</span>
              <span>
                {Object.keys(spendingByCategory).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Company Score</span>
              <span className={getScoreColor(user.overallScore)}>
                {user.overallScore}/100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Values Alignment</span>
              <span className={user.overallScore >= 70 ? 'text-green-600' : user.overallScore >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                {user.overallScore >= 70 ? 'Strong' : user.overallScore >= 40 ? 'Moderate' : 'Developing'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
