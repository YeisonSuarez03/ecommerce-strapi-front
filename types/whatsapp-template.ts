export interface WhatsappTemplate {
  id: number;
  Greetings: string;
  ProductsVariables: string;
  FinalSummary: string;
  phoneNumer: string; // Note: "phoneNumer" (typo in Strapi)
}

export interface GlobalWhatsappTemplate {
  WhatsappTemplate: WhatsappTemplate;
} 