import React from 'react';
import type { Metadata } from 'next';
import { AIGeneratorLayout } from '@/components/canvas/plugins/ai-generator/AIGeneratorLayout';

export const metadata: Metadata = {
  title: 'AI System Design Generator | ArchMind',
  description:
    'Generate production-ready High-Level and Low-Level architecture diagrams and technical documentation from natural language prompts instantly with ArchMind AI.',
  keywords: [
    'ai architecture generator',
    'ai system design generator',
    'archmind system design',
    'hld generator',
    'system design practice',
  ],
};

export default function AIGeneratorPage() {
  return (
    <AIGeneratorLayout />
  );
}
