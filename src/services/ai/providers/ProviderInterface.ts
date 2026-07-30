import { AIEvaluationResponse, ChatMessage } from '../types';

export interface AIProvider {
  /**
   * Evaluate a design architecture AST
   */
  evaluateDesign(ast: any, diagramType: string): Promise<AIEvaluationResponse>;

  /**
   * Generate a one-off response string based on a prompt
   */
  generateResponse(messages: { role: string; content: string }[], model: string, temperature?: number): Promise<string>;

  /**
   * Stream a chat response back. Needs to return a readable stream (e.g. from Vercel AI SDK or fetch)
   */
  streamChat(messages: any[], model: string, temperature?: number): Promise<ReadableStream>;

  /**
   * Generate an architecture from a natural language prompt
   */
  generateArchitecture?(prompt: string, complexity?: string, cloudProvider?: string): Promise<any>;
}
