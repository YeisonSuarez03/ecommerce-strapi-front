import { useGetCategories } from "@/hooks/use-api-server";
import { use } from "react";
import { HomeCategories } from "./home-categories";
import { Category } from "@/types/category";

export function HomeCategoriesServer() {
  const getCategories = useGetCategories(true); // true to get images
  const categoriesData = use(getCategories());
  
  // Extract only parent categories for display
  const parentCategories: Category[] = categoriesData?.data || [];

  // Don't render if no categories
  if (!parentCategories || parentCategories.length === 0) {
    return null;
  }

  return <HomeCategories categories={parentCategories} />;
} 