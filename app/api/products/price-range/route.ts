import { NextResponse } from "next/server";
import { buildStrapiUrl, getStrapiHeaders } from "@/lib/strapi";

export async function GET() {
  const defaultMin = 0;
  const defaultMax = 1500000;
  
  try {
    const baseUrl = "/products";
    const minUrl = buildStrapiUrl(baseUrl, {
      "sort[0]": "price:asc",
      "fields[0]": "price",
      "pagination[limit]": 1
    });
    const maxUrl = buildStrapiUrl(baseUrl, {
      "sort[0]": "price:desc",
      "fields[0]": "price",
      "pagination[limit]": 1
    });

    const [minRes, maxRes] = await Promise.all([
      fetch(minUrl, { headers: getStrapiHeaders() }),
      fetch(maxUrl, { headers: getStrapiHeaders() }),
    ]);
    
    if (!minRes.ok || !maxRes.ok) throw new Error("Strapi fetch failed");
    
    const minData = await minRes.json();
    const maxData = await maxRes.json();
    const minPriceRaw = minData?.data?.[0]?.price ?? defaultMin;
    const maxPriceRaw = maxData?.data?.[0]?.price ?? defaultMax;
    const min = Math.max(0, minPriceRaw - 10000);
    const max = maxPriceRaw + 10000;
    
    return NextResponse.json({ min, max });
  } catch (e) {
    return NextResponse.json({ min: defaultMin, max: defaultMax });
  }
} 