import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface CodeImageProps {
  code: string;
  language: string;
  onImageGenerated: (imageUrl: string) => void;
}

export function CodeImage({ code, language, onImageGenerated }: CodeImageProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const renderImage = async () => {
        try {
          const canvas = await html2canvas(codeRef.current!, {
            backgroundColor: '#1f2937', // dark background
            scale: 2, // higher quality
          });
          const imageUrl = canvas.toDataURL();
          onImageGenerated(imageUrl);
        } catch (error) {
          console.error('Failed to generate code image:', error);
        }
      };
      
      renderImage();
    }
  }, [code, onImageGenerated]);

  return (
    <div className="hidden">
      <pre
        ref={codeRef}
        className="p-4 rounded-md bg-gray-800 text-gray-300 overflow-x-auto"
        style={{ 
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          maxWidth: '800px' 
        }}
      >
        <div className="px-4 py-2 bg-gray-900 text-gray-200 mb-2 rounded-t-md">
          {language} Implementation
        </div>
        <code>{code}</code>
      </pre>
    </div>
  );
}