import { NextRequest, NextResponse } from "next/server";
import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi";
import { GlobalWhatsappTemplate } from "@/types/whatsapp-template";

export async function GET(request: NextRequest) {
  try {
    // Fetch WhatsApp template from Strapi global endpoint
    const url = buildStrapiUrl("/global", {
      "populate[WhatsappTemplate]": "true"
    });
    
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const templateData: GlobalWhatsappTemplate = data.data;

    if (!templateData?.WhatsappTemplate) {
      throw new Error("WhatsApp template data not found");
    }

    return NextResponse.json(templateData.WhatsappTemplate);

  } catch (error: any) {
    console.error("Error fetching WhatsApp template:", error?.message || error);
    handleStrapiError(error);
    
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp template" }, 
      { status: 500 }
    );
  }
} 