"use client";

import { Category } from "@/types/category";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { hasValidUrl } from "@/lib/utils";

interface CategoryAccordionProps {
  categories: Category[];
  selectedCategories: number[];
  onCategoryChange: (categoryId: number, checked: boolean) => void;
  level?: number;
}

export function CategoryAccordion({
  categories,
  selectedCategories,
  onCategoryChange,
  level = 0,
}: CategoryAccordionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const hasChildren = (category: Category) => {
    return category.child_categories && category.child_categories.length > 0;
  };

  const isExpanded = (categoryId: number) => {
    return expandedCategories.has(categoryId);
  };

  const getIndentClass = (level: number) => {
    return level != 0 ? `ml-10` : "";
  };

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          {/* Parent category */}
          <div className={`flex items-center space-x-2 gap-2 ${getIndentClass(level)}`}>
            {/* Checkbox */}
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => onCategoryChange(category.id, e.target.checked)}
              className="cursor-pointer"
            />
            
            {/* Label */}
            <label
              htmlFor={`category-${category.id}`}
              className="text-sm text-muted flex items-center gap-2 cursor-pointer"
            >
              {category.name}
            </label>

            {/* Expand/collapse arrow - moved to the right */}
            {hasChildren(category) && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted hover:text-main transition-colors ml-auto"
              >
                {isExpanded(category.id) ? (
                  <ChevronDown className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </button>
            )}
          </div>

          {/* Child categories */}
          {hasChildren(category) && isExpanded(category.id) && (
            <div className="mt-1">
              <CategoryAccordion
                categories={category.child_categories!}
                selectedCategories={selectedCategories}
                onCategoryChange={onCategoryChange}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 