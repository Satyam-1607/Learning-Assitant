
import React, { useState, useCallback } from 'react';
import { ActionType, ActionResult } from './types';
import * as geminiService from './services/geminiService';
import FileUpload from './components/FileUpload';
import ActionButtons from './components/ActionButtons';
import ResultDisplay from './components/ResultDisplay';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult>(null);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const handlePdfProcessed = useCallback((text: string, name: string) => {
    setPdfText(text);
    setFileName(name);
    setResult(null);
    setError(null);
    setActiveAction(null);
  }, []);

  const handleActionSelect = useCallback(async (action: ActionType) => {
    if (!pdfText) {
      setError('Please upload a PDF first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveAction(action);

    try {
      let response: ActionResult = null;
      switch (action) {
        case ActionType.SUMMARY:
          response = await geminiService.generateSummary(pdfText);
          break;
        case ActionType.STRATEGY:
          response = await geminiService.generateStudyPlan(pdfText);
          break;
        case ActionType.QUIZ:
          response = await geminiService.generateQuiz(pdfText);
          break;
      }
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [pdfText]);

  const handleReset = () => {
    setPdfText(null);
    setFileName(null);
    setIsLoading(false);
    setError(null);
    setResult(null);
    setActiveAction(null);
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-slate-200">
      <header className="py-4 text-center border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto flex items-center justify-center gap-2">
            <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                AI PDF Study Assistant
            </h1>
        </div>
      </header>
      
      <main className="container p-4 mx-auto md:p-8">
        <div className="max-w-4xl mx-auto">
          {!pdfText ? (
            <FileUpload onPdfProcessed={handlePdfProcessed} disabled={isLoading} />
          ) : (
            <div className="space-y-8">
              <div className="p-4 text-center bg-white border border-green-200 rounded-lg shadow-sm dark:bg-slate-800 dark:border-green-700/50">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Ready to analyze: <span className="font-bold text-indigo-600 dark:text-indigo-400">{fileName}</span>
                </p>
                <button onClick={handleReset} className="mt-2 text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
                  Upload a different file
                </button>
              </div>
              <ActionButtons onActionSelect={handleActionSelect} disabled={isLoading} />
              <ResultDisplay
                isLoading={isLoading}
                error={error}
                result={result}
                actionType={activeAction}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 mt-8 text-center border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Powered by Gemini API. Built with React & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
