
import React, { useState, useCallback } from 'react';
import { DocumentTextIcon } from './Icons';

declare const pdfjsLib: any;

interface FileUploadProps {
  onPdfProcessed: (text: string, fileName: string) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onPdfProcessed, disabled }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) { // 20 MB limit
      setError('File size must not exceed 20 MB.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      if (typeof pdfjsLib === 'undefined') {
        throw new Error('pdf.js library is not loaded.');
      }
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.mjs`;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        onPdfProcessed(fullText, file.name);
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
        setIsProcessing(false);
      }
      reader.readAsArrayBuffer(file);

    } catch (err) {
      console.error(err);
      setError('Failed to process PDF. Make sure it is a text-based PDF.');
      setIsProcessing(false);
    } finally {
        // The parent component will set its own loading state, so we can turn this off
        // once the text is extracted.
        setIsProcessing(false);
    }

  }, [onPdfProcessed]);

  return (
    <div className="w-full max-w-lg mx-auto">
        <label htmlFor="file-upload" className="relative block w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200 bg-white dark:bg-slate-800">
            <div className="flex flex-col items-center">
                <DocumentTextIcon className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500" />
                <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {isProcessing ? 'Processing PDF...' : 'Upload your PDF'}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Max 20MB</span>
            </div>
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={disabled || isProcessing}
            />
        </label>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FileUpload;
