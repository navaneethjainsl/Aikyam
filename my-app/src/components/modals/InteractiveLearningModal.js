import React, { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { toast } from "sonner";

const InteractiveLearningModal = ({ onClose }) => {
  const [quizOn, setQuizOn] = useState(false);

  const toggleQuiz = () => {
    setQuizOn((prev) => !prev);
    window.open(`http://localhost:8501/?routes=${quizOn ? "stop" : "start_quiz"}`, "_blank");
    toast[quizOn ? "info" : "success"](quizOn ? "Quiz stopped" : "Quiz started");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl font-bold">Interactive Learning</h2>
        </div>
        <p className="mb-6 text-gray-300">
          Access personalized content and quizzes designed for different learning styles.
        </p>
        <button
          onClick={toggleQuiz}
          className={`px-6 py-2 rounded text-white ${
            quizOn ? "bg-red-600 hover:bg-red-700" : "bg-[#7E69AB] hover:bg-[#6E59A5]"
          }`}
        >
          {quizOn ? "Stop Quiz" : "Start Interactive Quiz"}
        </button>
      </div>
    </div>
  );
};

export default InteractiveLearningModal;
