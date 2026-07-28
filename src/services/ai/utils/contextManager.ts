import { ChatMessage, Attachment } from '@/store/useMentorStore';

export interface AIContextPayload {
  systemPrompt: string;
  messages: any[]; // The structured messages to pass to the provider
}

/**
 * Context Manager for AI Design Mentor
 * Handles summarization of old messages and injection of active attachments.
 */
export class ContextManager {
  /**
   * Prepares the final message array to be sent to the AI API.
   */
  static buildPayload(
    systemPrompt: string,
    history: ChatMessage[],
    activeAttachments: Attachment[],
    maxRecentMessages: number = 10
  ): AIContextPayload {
    const formattedMessages: any[] = [];
    
    // Always start with the system prompt
    formattedMessages.push({
      role: 'system',
      content: systemPrompt
    });

    // Strategy: If history is too long, we simulate a 'summarized context' 
    // (In a real massive system, we'd call an AI model asynchronously to summarize old chunks and save it to the DB)
    let messagesToInclude = history;
    let summaryMessage = '';

    if (history.length > maxRecentMessages) {
      const olderMessages = history.slice(0, history.length - maxRecentMessages);
      messagesToInclude = history.slice(history.length - maxRecentMessages);
      
      summaryMessage = `[SYSTEM CONTEXT: The conversation has been long. Earlier messages discussed various system design concepts. Continue from the recent messages below.]\n\n`;
    }

    // Add active attachments to context
    let attachmentsContext = '';
    const imageAttachments: any[] = [];

    if (activeAttachments.length > 0) {
      activeAttachments.forEach(att => {
        if (att.type === 'pdf' && att.extractedText) {
          attachmentsContext += `\n--- PDF Context (${att.fileName}) ---\n${att.extractedText}\n--- End PDF ---\n`;
        } else if (att.type === 'image') {
          // Add to image attachments to be injected as multi-modal content later
          imageAttachments.push({
            type: 'image_url',
            image_url: { url: att.url }
          });
        }
      });
    }

    if (summaryMessage || attachmentsContext) {
      formattedMessages.push({
        role: 'system',
        content: summaryMessage + attachmentsContext
      });
    }

    // Format remaining recent history
    messagesToInclude.forEach(msg => {
      // If this specific message has attachments (historical), we could inject them here.
      // But for vision models, we only send the *current* images as multi-modal to save tokens, 
      // or we send them if they are small. For now, text is passed.
      
      if (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system') {
        formattedMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    // If there are active images for the current turn, we must append them to the LAST user message
    if (imageAttachments.length > 0) {
      const lastMsg = formattedMessages[formattedMessages.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        const textContent = lastMsg.content;
        lastMsg.content = [
          { type: 'text', text: textContent },
          ...imageAttachments
        ];
      }
    }

    return {
      systemPrompt,
      messages: formattedMessages
    };
  }
}
