import { create } from "zustand";
import AIService from '../api/ia'

export const useStore = create((set) => ({
  //prompt que recibe
  pregunta: "",
  isGenerating: false,
  generarPregunta: async (prompt) => {
    set({ pregunta: "", isGenerating: true });
    const data = await AIService.generateRecipe(prompt);

    for await (const textPart of data) {
      // esto es por que es string iterable ya que entrega los datos poco a poco
      // console.log(textPart)
      set((state) => ({
        pregunta: state.pregunta + textPart,
      }));
    }
    set({
      isGenerating: false,
    });
  },
}));
