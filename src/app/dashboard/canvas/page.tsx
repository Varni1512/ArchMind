import React from 'react';
import ExcalidrawWrapper from '@/components/canvas/ExcalidrawWrapper';

export default function CanvasPage() {
  return (
    <div className="absolute inset-0 bg-[#faf9f6] overflow-hidden">
      <ExcalidrawWrapper />
    </div>
  );
}
