import {streamText} from 'ai'

import { openrouter } from '../libs/ai.js'

export default{
    async generateRecipe(prompt){
         const result = streamText({
            // model:openrouter('meta-llama/llama-3.3-70b-instruct:free'),
            // meta-llama/llama-3.3-8b-instruct:free
            model:openrouter('meta-llama/llama-3.3-8b-instruct:free'),
            // model:openrouter('google/gemini-2.0-flash-thinking-exp-1219:free'), //Modelo freee open router,
            prompt,
      system:'Tienes que hablarme como un especialista en Herramientas y Ferreteria.',    //Define el comportamiento de la IA
            temperature:1 // Valores mas altos signfican mas deterministas
         })
        //  console.log(result)
        return result.textStream
        
    }
}