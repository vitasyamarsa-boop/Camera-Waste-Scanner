import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-duriat-green-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-duriat-green-800 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-duriat-green-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-duriat-green-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Kuis Edukasi Pemilahan Sampah
            </h2>
          </div>
          {!isCompleted && (
            <div className="text-xs font-semibold text-gray-500">
              Soal {currentIndex + 1} dari {QUIZ_QUESTIONS.length}
            </div>
          )}
        </div>

        {isCompleted ? (
          /* Completion Screen */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-duriat-green-100 dark:bg-duriat-green-950/60 text-duriat-green-600 flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Kuis Selesai!
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Skor Anda:{' '}
              <strong className="text-duriat-green-600 font-bold text-lg">
                {score} / {QUIZ_QUESTIONS.length}
              </strong>
            </p>

            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              {score === QUIZ_QUESTIONS.length
                ? 'Luar biasa! Pemahaman Anda tentang pemilahan sampah dan standar tempat sampah di Indonesia sangat sempurna.'
                : 'Terus berlatih dan terapkan kebiasaan memilah sampah setiap hari untuk lingkungan Indonesia yang lebih bersih.'}
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white font-medium text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          </div>
        ) : (
          /* Question Form */
          <div className="space-y-6">
            <div className="inline-block px-2.5 py-1 rounded-md bg-gray-100 dark:bg-duriat-green-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Topik: {currentQ.categoryHint}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle =
                  'bg-white dark:bg-duriat-green-800/60 border-gray-200 dark:border-duriat-green-700 hover:border-duriat-green-400 text-gray-800 dark:text-gray-200';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-duriat-green-50 dark:bg-duriat-green-950/40 border-duriat-green-500 text-duriat-green-900 dark:text-duriat-green-200 font-semibold';
                  } else if (isSelected) {
                    btnStyle =
                      'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                  } else {
                    btnStyle = 'opacity-50 border-gray-200 dark:border-duriat-green-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-duriat-green-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answer */}
            {isAnswered && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-duriat-green-800/40 border border-gray-200 dark:border-duriat-green-700/80 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <Sparkles className="w-3.5 h-3.5 text-duriat-green-600" />
                  <span>Penjelasan Edukasi:</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {currentQ.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-duriat-orange-500 hover:bg-duriat-orange-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>
                      {currentIndex + 1 < QUIZ_QUESTIONS.length
                        ? 'Lanjut ke Soal Berikutnya'
                        : 'Lihat Hasil Akhir'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
