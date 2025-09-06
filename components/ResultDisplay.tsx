import React, { useState } from 'react';
import { ActionType, ActionResult, StudyPlan, QuizQuestion } from '../types';
import Loader from './Loader';
import { BookOpenIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: ActionResult;
  actionType: ActionType | null;
}

const QuizView: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [score, setScore] = useState(0);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (selectedAnswers[questionIndex] !== null) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = option;
    setSelectedAnswers(newSelectedAnswers);

    if (option === questions[questionIndex].answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setScore(0);
  };

  const isQuizFinished = selectedAnswers.every(answer => answer !== null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Quiz Time!</h3>
        <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Score: <span className="text-indigo-600 dark:text-indigo-400">{score}</span> / {questions.length}
        </div>
      </div>
      {questions.map((q, questionIndex) => {
        const userAnswer = selectedAnswers[questionIndex];
        const isAnswered = userAnswer !== null;
        const correctAnswer = q.answer;

        return (
          <div key={questionIndex} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="font-semibold text-slate-700 dark:text-slate-300">{questionIndex + 1}. {q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((option, optionIndex) => {
                let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors duration-200 flex items-center justify-between text-slate-700 dark:text-slate-300 ";
                let icon = null;

                if (!isAnswered) {
                  buttonClass += "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600/50 cursor-pointer";
                } else {
                  buttonClass += " cursor-not-allowed";
                  const isCorrect = option === correctAnswer;
                  const isSelected = option === userAnswer;

                  if (isCorrect) {
                    buttonClass += " bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300 font-semibold";
                    icon = <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
                  } else if (isSelected && !isCorrect) {
                    buttonClass += " bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 font-semibold";
                    icon = <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />;
                  } else {
                    buttonClass += " bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-70";
                  }
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleOptionSelect(questionIndex, option)}
                    disabled={isAnswered}
                    className={buttonClass}
                    aria-label={`Option ${optionIndex + 1}: ${option}`}
                  >
                    <span>{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {isQuizFinished && (
        <div className="pt-4 text-center">
          <button
            onClick={resetQuiz}
            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

const StudyPlanView: React.FC<{ plan: StudyPlan }> = ({ plan }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg dark:bg-slate-700">
                <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your 4-Week Study Plan</h3>
        </div>
        {plan.map(week => (
        <div key={week.week} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">Week {week.week}: {week.title}</h4>
            <ul className="mt-3 list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            {week.goals.map((goal, i) => <li key={i}>{goal}</li>)}
            </ul>
        </div>
        ))}
    </div>
);

const SummaryView: React.FC<{ summary: string }> = ({ summary }) => (
    <div>
        <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg dark:bg-slate-700">
                <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Document Summary</h3>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-slate-600 dark:text-slate-300 leading-relaxed">
            {summary}
        </div>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result, actionType }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-4 text-center text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">{error}</div>;
  }
  
  if (!result) {
    return (
        <div className="p-8 text-center border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Your results will appear here</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose an action above to get started.</p>
        </div>
    );
  }

  const renderResult = () => {
    switch (actionType) {
      case ActionType.SUMMARY:
        return <SummaryView summary={result as string} />;
      case ActionType.STRATEGY:
        return <StudyPlanView plan={result as StudyPlan} />;
      case ActionType.QUIZ:
        return <QuizView questions={result as QuizQuestion[]} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700 min-h-[200px]">
        {renderResult()}
    </div>
    );
};

export default ResultDisplay;
