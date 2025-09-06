
import React from 'react';
import { ActionType } from '../types';
import { BookOpenIcon, CalendarIcon, QuestionMarkCircleIcon } from './Icons';

interface ActionButtonsProps {
  onActionSelect: (action: ActionType) => void;
  disabled: boolean;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, title, description, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white rounded-lg shadow-md dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-indigo-600 rounded-full">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </button>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({ onActionSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <ActionButton
        icon={<BookOpenIcon className="w-8 h-8" />}
        title="Generate Summary"
        description="Get a concise overview of the key points in your document."
        onClick={() => onActionSelect(ActionType.SUMMARY)}
        disabled={disabled}
      />
      <ActionButton
        icon={<CalendarIcon className="w-8 h-8" />}
        title="Create Study Plan"
        description="Receive a structured 4-week plan to master the material."
        onClick={() => onActionSelect(ActionType.STRATEGY)}
        disabled={disabled}
      />
      <ActionButton
        icon={<QuestionMarkCircleIcon className="w-8 h-8" />}
        title="Generate Quiz"
        description="Test your knowledge with randomly generated questions."
        onClick={() => onActionSelect(ActionType.QUIZ)}
        disabled={disabled}
      />
    </div>
  );
};

export default ActionButtons;
