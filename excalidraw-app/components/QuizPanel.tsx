import { useState } from "react";
import "./QuizPanel.scss";

const QUESTIONS = [
  {
    question: "Phím tắt nào dùng để chọn tất cả phần tử trong Excalidraw?",
    options: ["Ctrl+A", "Ctrl+S", "Ctrl+D", "Ctrl+E"],
    answer: 0,
  },
  {
    question: "File Excalidraw được lưu với định dạng nào?",
    options: [".svg", ".png", ".excalidraw", ".json"],
    answer: 2,
  },
  {
    question: "Công cụ nào cho phép vẽ tự do (freehand) trong Excalidraw?",
    options: ["Pencil", "Freedraw", "Brush", "Pen"],
    answer: 1,
  },
  {
    question: "Excalidraw sử dụng thư viện nào để quản lý trạng thái UI?",
    options: ["Redux", "Zustand", "Jotai", "Recoil"],
    answer: 2,
  },
  {
    question: "Phím tắt nào giúp hoàn tác (undo) thao tác vừa thực hiện?",
    options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+U", "Ctrl+R"],
    answer: 0,
  },
];

export const QuizPanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;

  const handleSelect = (index: number) => {
    if (answered) {
      return;
    }
    setSelectedOption(index);
    setAnswered(true);
    if (index === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const getResultEmoji = () => {
    if (score === QUESTIONS.length) {
      return "🏆";
    }
    if (score >= QUESTIONS.length / 2) {
      return "👍";
    }
    return "📚";
  };

  const getResultMessage = () => {
    if (score === QUESTIONS.length) {
      return "Xuất sắc! Bạn biết rất nhiều về Excalidraw!";
    }
    if (score >= QUESTIONS.length / 2) {
      return "Tốt lắm! Hãy tiếp tục học hỏi thêm nhé!";
    }
    return "Hãy khám phá thêm về Excalidraw bạn nhé!";
  };

  if (finished) {
    return (
      <div className="quiz-panel">
        <div className="quiz-panel__header">Quiz Excalidraw</div>
        <div className="quiz-panel__result">
          <div className="quiz-panel__result-emoji">{getResultEmoji()}</div>
          <div className="quiz-panel__result-score">
            {score} / {QUESTIONS.length}
          </div>
          <div className="quiz-panel__result-message">{getResultMessage()}</div>
        </div>
        <div className="quiz-panel__actions">
          <button className="quiz-panel__btn quiz-panel__btn--primary" onClick={handleRestart}>
            Chơi lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <div className="quiz-panel__header">Quiz Excalidraw</div>
      <div className="quiz-panel__progress">
        Câu {currentIndex + 1} / {QUESTIONS.length} · Điểm: {score}
      </div>
      <div className="quiz-panel__question">{question.question}</div>
      <div className="quiz-panel__options">
        {question.options.map((opt, idx) => {
          let cls = "quiz-panel__option";
          if (answered) {
            if (idx === question.answer) {
              cls += " quiz-panel__option--correct";
            } else if (idx === selectedOption) {
              cls += " quiz-panel__option--wrong";
            }
          } else if (idx === selectedOption) {
            cls += " quiz-panel__option--selected";
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              <span style={{ fontWeight: 700, minWidth: 20 }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={`quiz-panel__feedback ${
            selectedOption === question.answer
              ? "quiz-panel__feedback--correct"
              : "quiz-panel__feedback--wrong"
          }`}
        >
          {selectedOption === question.answer
            ? "✓ Chính xác!"
            : `✗ Sai rồi! Đáp án đúng là: ${question.options[question.answer]}`}
        </div>
      )}
      <div className="quiz-panel__actions">
        {answered && (
          <button
            className="quiz-panel__btn quiz-panel__btn--primary"
            onClick={handleNext}
          >
            {isLast ? "Xem kết quả" : "Câu tiếp theo →"}
          </button>
        )}
      </div>
    </div>
  );
};
