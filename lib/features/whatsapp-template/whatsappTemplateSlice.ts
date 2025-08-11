import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { WhatsappTemplate } from "@/types/whatsapp-template";

interface WhatsappTemplateState {
  template: WhatsappTemplate | null;
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
}

const initialState: WhatsappTemplateState = {
  template: null,
  isLoading: false,
  error: null,
  isLoaded: false,
};

// Async thunk to fetch WhatsApp template
export const fetchWhatsappTemplate = createAsyncThunk(
  "whatsappTemplate/fetchTemplate",
  async () => {
    const response = await fetch("/api/whatsapp-template");
    if (!response.ok) {
      throw new Error("Failed to fetch WhatsApp template");
    }
    const data = await response.json();
    return data as WhatsappTemplate;
  }
);

const whatsappTemplateSlice = createSlice({
  name: "whatsappTemplate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTemplate: (state) => {
      state.template = null;
      state.isLoaded = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhatsappTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWhatsappTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.template = action.payload;
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(fetchWhatsappTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch WhatsApp template";
      });
  },
});

export const { clearError, resetTemplate } = whatsappTemplateSlice.actions;
export default whatsappTemplateSlice.reducer; 