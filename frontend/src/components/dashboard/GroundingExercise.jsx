import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Eye,
  Hand,
  Ear,
  Wind,
  Coffee,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  {
    sense: "See",
    count: 5,
    prompt: "Name 5 things you can see right now.",
    icon: Eye,
    color: "var(--color-accent-sage)",
    bgColor: "var(--color-bg-sage-light)",
    placeholder: "e.g. My desk lamp",
  },
  {
    sense: "Touch",
    count: 4,
    prompt: "Name 4 things you can physically feel.",
    icon: Hand,
    color: "var(--color-accent-blush-dark)",
    bgColor: "var(--color-bg-blush-light)",
    placeholder: "e.g. Warm cup of tea",
  },
  {
    sense: "Hear",
    count: 3,
    prompt: "Name 3 things you can hear.",
    icon: Ear,
    color: "#6B8A6B",
    bgColor: "#E8EDE8",
    placeholder: "e.g. Birds chirping",
  },
  {
    sense: "Smell",
    count: 2,
    prompt: "Name 2 things you can smell.",
    icon: Wind,
    color: "#9B7EA4",
    bgColor: "#F0E8F4",
    placeholder: "e.g. Fresh coffee",
  },
  {
    sense: "Taste",
    count: 1,
    prompt: "Name 1 thing you can taste.",
    icon: Coffee,
    color: "#C08B76",
    bgColor: "#FAF0EC",
    placeholder: "e.g. Mint toothpaste",
  },
];

const TOTAL_TIME = 300; // 5 minutes in seconds

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function GroundingExercise({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState(() =>
    STEPS.map((step) => Array(step.count).fill("")),
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [fadeClass, setFadeClass] = useState("grounding-fade-in");
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  // Timer logic
  useEffect(() => {
    if (!isStarted || isComplete) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isStarted, isComplete]);

  // Auto-focus first empty input when step changes
  useEffect(() => {
    if (isStarted && !isComplete) {
      const firstEmptyIdx = inputs[currentStep].findIndex((v) => v === "");
      const targetIdx = firstEmptyIdx === -1 ? 0 : firstEmptyIdx;
      setTimeout(() => {
        inputRefs.current[targetIdx]?.focus();
      }, 350);
    }
  }, [currentStep, isStarted, isComplete]);

  const handleInputChange = useCallback(
    (inputIndex, value) => {
      setInputs((prev) => {
        const next = prev.map((arr) => [...arr]);
        next[currentStep][inputIndex] = value;
        return next;
      });
    },
    [currentStep],
  );

  const canAdvance = inputs[currentStep].every((v) => v.trim() !== "");

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setFadeClass("grounding-fade-out");
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setFadeClass("grounding-fade-in");
      }, 250);
    } else {
      clearInterval(timerRef.current);
      setFadeClass("grounding-fade-out");
      setTimeout(() => {
        setIsComplete(true);
        setFadeClass("grounding-fade-in");
      }, 250);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setInputs(STEPS.map((step) => Array(step.count).fill("")));
    setTimeLeft(TOTAL_TIME);
    setIsComplete(false);
    setIsStarted(false);
    setFadeClass("grounding-fade-in");
  };

  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  // --- Intro Screen ---
  if (!isStarted) {
    return (
      <div className="grounding-overlay" id="grounding-overlay">
        <div className="grounding-modal grounding-fade-in">
          <button
            className="grounding-close-btn"
            onClick={onClose}
            aria-label="Close meditation"
          >
            <X size={20} />
          </button>

          <div className="grounding-intro">
            <div className="grounding-intro-icon">🧘</div>
            <h2>5-4-3-2-1 Grounding</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.65', maxWidth: '420px', textAlign: 'center', margin: '0 auto 8px' }}>
              <p>
                When anxiety hits, your mind can feel like it's racing out of control. This clinically-proven exercise acts as an anchor. By consciously focusing on your physical senses, you interrupt negative thought loops and bring your brain back to the safe, present moment.
              </p>
              <p>
                Over the next 5 minutes, we will guide you through your surroundings. You'll simply look around and type out what you notice. Take a deep breath. There is no rush, and there are no wrong answers.
              </p>
            </div>
            <div className="grounding-intro-steps">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="grounding-intro-step-pill">
                    <Icon size={14} />
                    <span>
                      {s.count} {s.sense}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              className="grounding-start-btn"
              onClick={() => setIsStarted(true)}
            >
              Begin Exercise
            </button>
            <span className="grounding-duration-label">
              ⏱ Takes about 5 minutes
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- Completion Screen ---
  if (isComplete) {
    return (
      <div className="grounding-overlay" id="grounding-overlay">
        <div className="grounding-modal grounding-fade-in">
          <button
            className="grounding-close-btn"
            onClick={onClose}
            aria-label="Close meditation"
          >
            <X size={20} />
          </button>

          <div className="grounding-complete">
            <div className="grounding-complete-icon">
              <CheckCircle2 size={56} />
            </div>
            <h2>You did it. 💚</h2>
            <p>
              Take a moment to notice how you feel. You're present, you're
              grounded, and you're safe. Come back to this exercise whenever the
              world feels too loud.
            </p>
            <div className="grounding-complete-actions">
              <button className="grounding-restart-btn" onClick={handleRestart}>
                <RotateCcw size={16} /> Try Again
              </button>
              <button className="grounding-done-btn" onClick={onClose}>
                Return to Sanctuary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Active Exercise ---
  return (
    <div className="grounding-overlay" id="grounding-overlay">
      <div className="grounding-modal">
        <button
          className="grounding-close-btn"
          onClick={onClose}
          aria-label="Close meditation"
        >
          <X size={20} />
        </button>

        {/* Timer Bar */}
        <div className="grounding-timer-bar">
          <div
            className="grounding-timer-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grounding-timer-text">
          <span>{formatTime(timeLeft)} remaining</span>
          <span>
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Step Content */}
        <div className={`grounding-step-content ${fadeClass}`}>
          {/* Step Badge */}
          <div
            className="grounding-step-badge"
            style={{ background: step.bgColor, color: step.color }}
          >
            <StepIcon size={18} />
            <span>
              {step.count} — {step.sense}
            </span>
          </div>

          <h3 className="grounding-step-prompt">{step.prompt}</h3>

          {/* Input Fields */}
          <div className="grounding-inputs">
            {inputs[currentStep].map((value, i) => (
              <div className="grounding-input-row" key={i}>
                <span className="grounding-input-number">{i + 1}</span>
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  className="grounding-input"
                  placeholder={step.placeholder}
                  value={value}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const nextIdx = i + 1;
                      if (nextIdx < inputs[currentStep].length) {
                        inputRefs.current[nextIdx]?.focus();
                      } else if (canAdvance) {
                        goToNextStep();
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          className="grounding-next-btn"
          disabled={!canAdvance}
          onClick={goToNextStep}
        >
          {currentStep < STEPS.length - 1 ? (
            <>
              Next Sense <ChevronRight size={18} />
            </>
          ) : (
            <>
              Finish <CheckCircle2 size={18} />
            </>
          )}
        </button>

        {/* Step Dots */}
        <div className="grounding-dots">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`grounding-dot ${
                i === currentStep
                  ? "active"
                  : i < currentStep
                    ? "completed"
                    : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
