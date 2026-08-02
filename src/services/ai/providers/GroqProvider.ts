import { AIProvider, AIEvaluationResponse, ChatMessage, AIGeneratedArchitecture } from '../types';
import { getLLDReviewPrompt } from '../prompts/LLDReviewPrompt';
import { getAIGenerationPrompt } from '../prompts/AIGenerationPrompt';
export class GroqProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    this.model = "llama-3.3-70b-versatile";
  }

  async evaluateDesign(ast: any, diagramType: string, customSystemPrompt?: string): Promise<AIEvaluationResponse> {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing. Please set GROQ_API_KEY or NEXT_PUBLIC_GROQ_API_KEY.");
    }

    const systemPrompt = customSystemPrompt || getLLDReviewPrompt(diagramType);
    
    // We specify a highly detailed base JSON schema, Groq will try to conform to it.
    // Llama 3.3 supports JSON mode by adding response_format: { type: "json_object" }
    
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Evaluate the following AST:\n\n${JSON.stringify(ast, null, 2)}\n\nReturn the evaluation in the requested JSON format.`
      }
    ];

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.1, // Low temperature for more deterministic review
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Groq API Error:", errBody);
        throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return parsed as AIEvaluationResponse;
      } catch (parseError) {
        console.error("Failed to parse Groq output as JSON:", content);
        throw new Error("Failed to parse AI response. The model did not return valid JSON.");
      }
    } catch (error: any) {
      console.error("Error in GroqProvider:", error);
      throw error;
    }
  }
  
  async chatWithDesign(messages: any[], ast: any, diagramType: string, customSystemPrompt?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing. Please set NEXT_PUBLIC_GROQ_API_KEY.");
    }

    const systemPrompt = customSystemPrompt || (await import('../prompts/LLDChatPrompt')).getLLDChatPrompt(diagramType);

    // Prepare the payload: system prompt + hidden AST context + user conversation
    const payloadMessages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `CURRENT DIAGRAM AST CONTEXT:\n${JSON.stringify(ast, null, 2)}\nUse this context to answer the user's questions.` },
      ...messages
    ];

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages: payloadMessages,
          temperature: 0.5, // Slightly higher for chat
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Groq API Error:", errBody);
        throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error("Error in GroqProvider chat:", error);
      throw error;
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    model?: string,
    temperature?: number
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing. Please set NEXT_PUBLIC_GROQ_API_KEY.");
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model || this.model,
          messages,
          temperature: temperature ?? 0.2,
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Groq API Error:", errBody);
        throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error("Error in GroqProvider generateResponse:", error);
      throw error;
    }
  }

  async generateArchitecture(
    prompt: string,
    complexity?: string,
    cloudProvider?: string
  ): Promise<AIGeneratedArchitecture> {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing. Please set NEXT_PUBLIC_GROQ_API_KEY.");
    }

    const systemPrompt = getAIGenerationPrompt(complexity, cloudProvider);
    
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Generate an architecture for the following prompt:\n\n${prompt}`
      }
    ];

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3, 
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Groq API Error:", errBody);
        throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return parsed as AIGeneratedArchitecture;
      } catch (parseError) {
        console.error("Failed to parse Groq output as JSON:", content);
        throw new Error("Failed to parse AI response. The model did not return valid JSON.");
      }
    } catch (error: any) {
      console.error("Error in GroqProvider generateArchitecture:", error);
      throw error;
    }
  }
}
