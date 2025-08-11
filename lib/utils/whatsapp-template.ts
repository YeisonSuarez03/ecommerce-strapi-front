import { CartItem } from "@/lib/features/cart/cartSlice";
import { formatPrice } from "@/lib/utils";

interface TemplateReplacementData {
  name: string;
  reference: string;
  quantity: number;
  price: number;
}

// Function to decode escaped characters and handle emojis
function decodeTemplateString(template: string): string {
  return template
    .replace(/\\n/g, '\n') // Convert escaped \n to actual line breaks
    .replace(/\\t/g, '\t') // Convert escaped \t to actual tabs
    .replace(/\\"/g, '"')  // Convert escaped quotes
    .replace(/\\'/g, "'"); // Convert escaped single quotes
}

export function replaceTemplateVariables(
  template: string,
  data: TemplateReplacementData
): string {
  const decodedTemplate = decodeTemplateString(template);
  
  return decodedTemplate
    .replace(/\{\{name\}\}/g, data.name)
    .replace(/\{\{reference\}\}/g, data.reference)
    .replace(/\{\{quantity\}\}/g, data.quantity.toString())
    .replace(/\{\{price\}\}/g, formatPrice(data.price));
}

export function formatWhatsAppMessage(
  template: {
    phoneNumer: string; // Note: typo in Strapi field name
    Greetings: string;
    ProductsVariables: string;
    FinalSummary: string;
  },
  items: CartItem[],
  total: number,
  itemCount: number
): { phoneNumber: string; message: string } {
  // Decode and format each product using the template
  const productsList = items.map(item => {
    const productData: TemplateReplacementData = {
      name: item.name,
      reference: item.reference,
      quantity: item.quantity,
      price: item.price * item.quantity,
    };
    
    return replaceTemplateVariables(template.ProductsVariables, productData);
  }).join("\n\n");

  // Decode template strings
  const decodedGreetings = decodeTemplateString(template.Greetings);
  const decodedFinalSummary = decodeTemplateString(template.FinalSummary);

  // Build the complete message
  const fullMessage = 
    decodedGreetings + "\n\n" +
    productsList + "\n\n" +
    decodedFinalSummary
      .replace(/\{\{total\}\}/g, formatPrice(total))
      .replace(/\{\{itemCount\}\}/g, itemCount.toString());

  // Ensure emojis work properly on desktop WhatsApp
  const encodedMessage = fullMessage;

  return {
    phoneNumber: template.phoneNumer, // Use the typo field name from Strapi
    message: encodedMessage
  };
} 