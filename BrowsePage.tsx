import { useState } from 'react';
import { GripVertical, Plus, Minus, Search, X, TrendingUp, DollarSign, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { Category, Company, User } from '../App';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BrowsePageProps {
  categories: Category[];
  user: User | null;
  onCompanySelect: (company: Company) => void;
  onAddStore: (categoryId: string, storeName: string) => void;
  onRemoveStore: (categoryId: string, storeId: string) => void;
  onUpdateCategoryOrder: (newOrder: string[]) => void;
}

function SortableCategoryCard({
  category,
  user,
  onCompanySelect,
  onAddStore,
  onRemoveStore,
  isExpanded,
  onToggleExpand
}: {
  category: Category;
  user: User | null;
  onCompanySelect: (company: Company) => void;
  onAddStore: (categoryId: string, storeName: string) => void;
  onRemoveStore: (categoryId: string, storeId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSelector, setShowAddSelector] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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

  // Get top 3 shops user has spent money on in this category
  const topSpendingShops = user?.userSpending
    .filter(s => s.categoryId === category.id)
    .reduce((acc, spending) => {
      const existing = acc.find(s => s.companyId === spending.companyId);
      if (existing) {
        existing.totalAmount += spending.amount;
      } else {
        acc.push({
          companyId: spending.companyId,
          companyName: spending.companyName,
          totalAmount: spending.amount
        });
      }
      return acc;
    }, [] as { companyId: string; companyName: string; totalAmount: number }[])
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 3) || [];

  // Calculate category score based on companies
  const categoryScore = category.companies.length > 0
    ? Math.round(category.companies.reduce((sum, c) => sum + c.score, 0) / category.companies.length)
    : 0;

  // Filter companies based on search - searches ALL companies in the category
  const filteredCompanies = searchQuery.trim()
    ? category.companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : category.companies;

  // Get companies that are not yet added by user (for add selector)
  const addableCompanies = category.companies.filter(company => 
    !category.userStores?.includes(company.id) &&
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserStore = (companyId: string) => {
    return category.userStores?.includes(companyId) || false;
  };

  const handleAddStore = (company: Company) => {
    onAddStore(category.id, company.id);
    setShowAddSelector(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <Card className="overflow-hidden border-slate-200 rounded-2xl shadow-soft bg-white">
      {/* Category Header */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded-lg transition-colors touch-none"
          >
            <GripVertical className="w-5 h-5 text-slate-400" />
          </button>

          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
            {category.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm text-slate-900">{category.name}</h3>
              <Badge className={`text-xs border ${getScoreBgColor(categoryScore)} ${getScoreColor(categoryScore)}`}>
                {categoryScore}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {category.companies.length} stores available
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Search Bar - Only show when expanded */}
        {isExpanded && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder={`Search all ${category.name.toLowerCase()} stores...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 text-sm rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Top 3 Spending Shops */}
          {topSpendingShops.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs text-purple-900">Your Top Spending</h4>
              </div>
              <div className="space-y-2">
                {topSpendingShops.map((shop, index) => {
                  const company = category.companies.find(c => c.id === shop.companyId);
                  if (!company) return null;

                  return (
                    <div
                      key={shop.companyId}
                      onClick={() => onCompanySelect(company)}
                      className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:shadow-soft transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Badge className="bg-purple-500 text-white border-0 text-xs w-6 h-6 flex items-center justify-center p-0 shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 truncate">{company.name}</p>
                          <p className="text-xs text-slate-500">${shop.totalAmount.toLocaleString()} spent</p>
                        </div>
                      </div>
                      <div className={`ml-2 px-2 py-1 rounded-full text-xs ${getScoreBgColor(company.score)} ${getScoreColor(company.score)}`}>
                        {company.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Store Selector */}
          {showAddSelector && searchQuery.trim() && (
            <div className="p-4 bg-teal-50 border-b border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-teal-900">Select store to add</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddSelector(false);
                    setSearchQuery('');
                  }}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {addableCompanies.length > 0 ? (
                  addableCompanies.slice(0, 5).map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleAddStore(company)}
                      className="w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-teal-50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 truncate">{company.name}</p>
                        <p className="text-xs text-slate-600 truncate">{company.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge className={`text-xs ${getScoreBgColor(company.score)} ${getScoreColor(company.score)}`}>
                          {company.score}
                        </Badge>
                        <Plus className="w-4 h-4 text-teal-600" />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 text-center py-4">
                    No stores found matching "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Companies List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-4 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onCompanySelect(company)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900 truncate">{company.name}</h4>
                        {isUserStore(company.id) && (
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Added
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {company.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-1.5 rounded-full border ${getScoreBgColor(company.score)}`}>
                        <span className={`text-xs ${getScoreColor(company.score)}`}>
                          {company.score}
                        </span>
                      </div>

                      {/* Remove button for user-added stores */}
                      {isUserStore(company.id) ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveStore(category.id, company.id)}
                          className="w-8 h-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAddStore(category.id, company.id)}
                          className="w-8 h-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No stores found</p>
              </div>
            )}
          </div>

          {/* Add Store Button */}
          {!showAddSelector && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setShowAddSelector(true)}
                className="w-full rounded-xl border-slate-300 hover:bg-white hover:border-teal-500 text-slate-700 hover:text-teal-600 gap-2"
              >
                <Plus className="w-4 h-4" />
                Search & Add Stores
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
    </div>
  );
}

export function BrowsePage({
  categories,
  user,
  onCompanySelect,
  onAddStore,
  onRemoveStore,
  onUpdateCategoryOrder
}: BrowsePageProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([categories[0]?.id]));

  // Order categories based on user preference
  const orderedCategoryIds = user?.categoryOrder || categories.map(c => c.id);
  const orderedCategories = orderedCategoryIds
    .map(id => categories.find(c => c.id === id))
    .filter(Boolean) as Category[];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedCategoryIds.indexOf(active.id as string);
      const newIndex = orderedCategoryIds.indexOf(over.id as string);
      const newOrder = arrayMove(orderedCategoryIds, oldIndex, newIndex);
      onUpdateCategoryOrder(newOrder);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(orderedCategoryIds));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white px-6 py-8 border-b border-slate-200 sticky top-0 z-10 shadow-soft">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h1 className="mb-2 text-slate-900">Browse by Category</h1>
            <p className="text-sm text-slate-600">
              Drag to reorder • Search & add stores • Track spending
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              Top spending tracked
            </Badge>
            <Badge className="bg-teal-100 text-teal-700 border-0 rounded-full">
              {categories.length} categories
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={expandAll}
              className="text-xs h-8"
            >
              Expand All
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={collapseAll}
              className="text-xs h-8"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Categories List with Drag and Drop */}
      <div className="px-6 py-8 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedCategoryIds}
            strategy={verticalListSortingStrategy}
          >
            {orderedCategories.map((category) => (
              <SortableCategoryCard
                key={category.id}
                category={category}
                user={user}
                onCompanySelect={onCompanySelect}
                onAddStore={onAddStore}
                onRemoveStore={onRemoveStore}
                isExpanded={expandedCategories.has(category.id)}
                onToggleExpand={() => toggleCategoryExpansion(category.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
