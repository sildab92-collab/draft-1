import { X, ExternalLink, DollarSign, Scale, MessageSquare, ArrowRight, AlertTriangle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { Company, User, Category } from '../App';

interface CompanyDetailProps {
  company: Company;
  onClose: () => void;
  allCompanies: Company[];
  onCompanySelect: (company: Company) => void;
}

export function CompanyDetail({ company, onClose, allCompanies, onCompanySelect }: CompanyDetailProps) {
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

  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'support':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full px-3">
            <Check className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        );
      case 'boycott':
        return (
          <Badge className="bg-rose-100 text-rose-700 border-0 rounded-full px-3">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Consider Avoiding
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-0 rounded-full px-3">
            Neutral
          </Badge>
        );
    }
  };

  // Get alternative companies in the same category with higher scores
  const alternatives = allCompanies
    .filter(c => c.category === company.category && c.id !== company.id && c.score > company.score)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-3xl max-w-2xl mx-auto overflow-hidden shadow-strong">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-50 shadow-soft transition-all hover:scale-105"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${company.score >= 70 ? 'from-emerald-100 to-teal-100' : company.score >= 40 ? 'from-amber-100 to-orange-100' : 'from-rose-100 to-red-100'} rounded-2xl flex items-center justify-center shadow-soft`}>
                <span className="text-3xl">{company.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-slate-900">{company.name}</h2>
                <p className="text-sm text-slate-600 mb-3">{company.description}</p>
                {getStatusBadge(company.status)}
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <p className="text-sm text-slate-600 mb-3">Democracy Score</p>
              <div className="flex items-center gap-4 mb-3">
                <div className={`text-4xl ${getScoreColor(company.score)}`}>
                  {company.score}
                </div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreGradient(company.score)} rounded-full transition-all`}
                    style={{ width: `${company.score}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {company.score >= 70 ? 'Strong alignment with democratic values' : 
                 company.score >= 40 ? 'Mixed record on democratic values' : 
                 'Significant concerns about democratic values'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Action Buttons */}
            {company.website && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 rounded-xl border-slate-200 hover:bg-slate-50"
                  onClick={() => window.open(company.website, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Company Website
                </Button>
              </div>
            )}

            <Separator className="bg-slate-100" />

            {/* Political Donations */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Political Donations</h3>
                  <p className="text-xs text-slate-500">Campaign contributions and PAC funding</p>
                </div>
              </div>
              {company.politicalInfo.donations.length > 0 ? (
                <div className="space-y-3">
                  {company.politicalInfo.donations.map((donation, index) => (
                    <Card key={index} className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-transparent">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-900">{donation.recipient}</span>
                        <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 rounded-full">
                          {donation.year}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{donation.amount}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl">No political donation data available</p>
              )}
            </div>

            <Separator className="bg-slate-100" />

            {/* Lobbying Activities */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Lobbying Activities</h3>
                  <p className="text-xs text-slate-500">Legislative influence and advocacy</p>
                </div>
              </div>
              {company.politicalInfo.lobbying.length > 0 ? (
                <div className="space-y-3">
                  {company.politicalInfo.lobbying.map((lobby, index) => (
                    <Card key={index} className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-transparent">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-900">{lobby.issue}</span>
                        <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 rounded-full">
                          {lobby.year}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{lobby.amount}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl">No lobbying data available</p>
              )}
            </div>

            <Separator className="bg-slate-100" />

            {/* Statements & Actions */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-slate-900">Public Statements & Actions</h3>
                  <p className="text-xs text-slate-500">Corporate positions and initiatives</p>
                </div>
              </div>
              {company.politicalInfo.statements.length > 0 ? (
                <ul className="space-y-2">
                  {company.politicalInfo.statements.map((statement, index) => (
                    <li key={index} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span className="text-sm text-slate-700">{statement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl">No statement data available</p>
              )}
            </div>

            {/* Alternative Suggestions for Low Score Companies */}
            {company.score < 50 && alternatives.length > 0 && (
              <>
                <Separator className="bg-slate-100" />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-slate-900">Companies to Consider Instead</h3>
                      <p className="text-xs text-slate-500">Higher-scoring alternatives in this category</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {alternatives.map((alt) => (
                        <Card 
                          key={alt.id} 
                          className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50"
                          onClick={() => onCompanySelect(alt)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-slate-900">{alt.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-emerald-600 text-white border-0 text-xs rounded-full">
                                {alt.score}
                              </Badge>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-600">{alt.description}</p>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* Data Source Note */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200 rounded-xl">
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">Data Sources:</strong> This information is compiled from publicly available records including FEC filings, 
                lobbying disclosure reports, corporate statements, and verified news sources. Last updated: Oct 2024
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
