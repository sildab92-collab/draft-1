import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Category, Company, User } from '../App';

interface CategoryDetailPageProps {
  category: Category;
  user: User | null;
  onBack: () => void;
  onCompanySelect: (company: Company) => void;
  onLogin: () => void;
}

export function CategoryDetailPage({
  category,
  user,
  onBack,
  onCompanySelect,
  onLogin
}: CategoryDetailPageProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  // Calculate category average score
  const categoryScore = category.companies.length > 0
    ? Math.round(category.companies.reduce((sum, c) => sum + c.score, 0) / category.companies.length)
    : 0;

  // Get user's spending in this category
  const userSpendingInCategory = user?.userSpending.filter(s => s.categoryId === category.id) || [];
  const totalSpent = userSpendingInCategory.reduce((sum, s) => sum + s.amount, 0);

  // Sort companies by score
  const sortedCompanies = [...category.companies].sort((a, b) => b.score - a.score);

  const renderCompanyCard = (company: Company) => {
    const userSpentOnCompany = userSpendingInCategory
      .filter(s => s.companyId === company.id)
      .reduce((sum, s) => sum + s.amount, 0);

    return (
      <Card key={company.id} className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 rounded-2xl">
        <div
          onClick={() => onCompanySelect(company)}
          className="flex items-start justify-between mb-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm text-slate-900">{company.name}</h3>
              {userSpentOnCompany > 0 && (
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                  ${userSpentOnCompany.toLocaleString()}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-600 mb-2">
              {company.description}
            </p>
          </div>
          <div
            className={`ml-3 px-3 py-1.5 rounded-full border ${getScoreBgColor(company.score)}`}
          >
            <span className={`text-xs ${getScoreColor(company.score)}`}>
              {company.score}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onCompanySelect(company)}
          className="text-xs w-full border-slate-200 hover:bg-slate-50 rounded-xl"
        >
          View Details
        </Button>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white px-6 py-8 border-b border-slate-200 sticky top-0 z-10 shadow-soft">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center text-3xl">
              {category.icon}
            </div>
            <div className="flex-1">
              <h1 className="mb-1 text-slate-900">{category.name}</h1>
              <p className="text-xs text-slate-600">
                {category.companies.length} companies available
              </p>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        {user && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <p className="text-xs text-purple-900 mb-1">Your Spending</p>
              <p className="text-lg text-purple-900">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <p className="text-xs text-emerald-900 mb-1">Avg. Score</p>
              <div className="flex items-center gap-2">
                <p className={`text-lg ${getScoreColor(categoryScore)}`}>{categoryScore}</p>
                <TrendingUp className={`w-4 h-4 ${categoryScore >= 70 ? 'text-emerald-600' : categoryScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-6">
        {/* All Companies Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900">All Companies</h2>
            <Badge className="bg-slate-100 text-slate-700 border-0 rounded-full">
              Sorted by score
            </Badge>
          </div>
          <div className="space-y-3">
            {sortedCompanies.map(renderCompanyCard)}
          </div>
        </div>
      </div>

      {/* Guest CTA */}
      {user?.isGuest && (
        <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-20">
          <Card className="p-4 bg-gradient-to-br from-teal-500 to-blue-600 text-white border-0 rounded-2xl shadow-strong">
            <p className="text-sm mb-2">
              <strong>Sign in to track spending</strong>
            </p>
            <p className="text-xs text-teal-50 mb-3">
              Track your spending and see your personalized democracy score
            </p>
            <Button
              size="sm"
              onClick={onLogin}
              className="w-full bg-white text-teal-600 hover:bg-teal-50 rounded-xl"
            >
              Sign In
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
