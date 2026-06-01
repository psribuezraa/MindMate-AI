import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../services/authFetch';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Brain,
  Users,
  Sparkles,
  Heart,
  Check,
  Loader2,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ────────────────────────────────────────────
   Step configuration
   ──────────────────────────────────────────── */
const STEPS = [
  { id: 'demographics', label: 'About You', icon: User },
  { id: 'mental', label: 'Mental State', icon: Brain },
  { id: 'environment', label: 'Support System', icon: Users },
  { id: 'expectations', label: 'Your Goals', icon: Sparkles },
];

const EXPECTATION_OPTIONS = [
  'Venting',
  'Stress Relief',
  'Tracking Mood',
  'Self-Improvement',
  'Finding Calm',
  'Professional Guidance',
  'Other',
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { markSurveyComplete, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    gender: '',
    age: '',
    currentStatus: '',
    feelsSadOrLostInterest: null,
    feelsAnxious: null,
    experiencedPanicAttack: null,
    experiencedDepression: null,
    difficultySleeping: null,
    troubleConcentrating: 3,
    consultedProfessional: null,
    workAffectsMentalHealth: 3,
    supportiveEnvironment: null,
    hasSupportPerson: null,
    feelingToday: '',
    expectations: [],
  });

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleExpectation = (option) => {
    setForm((prev) => ({
      ...prev,
      expectations: prev.expectations.includes(option)
        ? prev.expectations.filter((e) => e !== option)
        : [...prev.expectations, option],
    }));
  };

  /* ─── Validation per step ─── */
  const validateStep = () => {
    setError('');
    switch (step) {
      case 0:
        if (!form.gender) return setError('Please select your gender.'), false;
        if (!form.age || form.age < 10 || form.age > 120)
          return setError('Please enter a valid age (10–120).'), false;
        if (!form.currentStatus)
          return setError('Please select your current status.'), false;
        return true;
      case 1:
        if (form.feelsSadOrLostInterest === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.feelsAnxious === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.experiencedPanicAttack === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.experiencedDepression === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.difficultySleeping === null)
          return setError('Please answer all questions in this step.'), false;
        return true;
      case 2:
        if (form.consultedProfessional === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.supportiveEnvironment === null)
          return setError('Please answer all questions in this step.'), false;
        if (form.hasSupportPerson === null)
          return setError('Please answer all questions in this step.'), false;
        return true;
      case 3:
        if (!form.feelingToday.trim())
          return setError('Please tell us how you are feeling today.'), false;
        if (form.expectations.length === 0)
          return setError('Please select at least one goal.'), false;
        return true;
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      const res = await authFetch(`${API_URL}/api/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika backend merespons bahwa survey sudah pernah diisi, langsung anggap sukses dan arahkan ke dashboard.
        if (data.message === 'Survey already completed') {
          markSurveyComplete();
          navigate('/dashboard', { replace: true });
          return;
        }
        setError(data.message || 'Failed to submit survey.');
        return;
      }

      // Update local auth state
      markSurveyComplete();
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Reusable UI helpers ─── */
  const RadioGroup = ({ label, field, options }) => (
    <div className="onboarding-field">
      <label className="onboarding-label">{label}</label>
      <div className="onboarding-radio-group">
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const display = typeof opt === 'object' ? opt.label : opt;
          return (
            <button
              key={String(value)}
              type="button"
              className={`onboarding-radio-btn ${form[field] === value ? 'selected' : ''}`}
              onClick={() => set(field, value)}
            >
              {form[field] === value && <Check size={14} />}
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );

  const BooleanField = ({ label, field }) => (
    <RadioGroup
      label={label}
      field={field}
      options={[
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]}
    />
  );

  const SliderField = ({ label, field, lowLabel, highLabel }) => (
    <div className="onboarding-field">
      <label className="onboarding-label">{label}</label>
      <div className="onboarding-slider-wrapper">
        <span className="onboarding-slider-label">{lowLabel}</span>
        <input
          type="range"
          min="1"
          max="5"
          value={form[field]}
          onChange={(e) => set(field, Number(e.target.value))}
          className="onboarding-slider"
        />
        <span className="onboarding-slider-label">{highLabel}</span>
      </div>
      <div className="onboarding-slider-value">{form[field]} / 5</div>
    </div>
  );

  /* ─── Step content ─── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step-content">
            <div className="onboarding-step-intro">
              <Heart className="onboarding-step-intro-icon" size={24} />
              <p>Let's start by getting to know you a little better.</p>
            </div>
            <RadioGroup
              label="What is your gender?"
              field="gender"
              options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
            />
            <div className="onboarding-field">
              <label className="onboarding-label">How old are you?</label>
              <input
                type="number"
                min="10"
                max="120"
                value={form.age}
                onChange={(e) => set('age', e.target.value)}
                className="onboarding-input"
                placeholder="e.g. 21"
              />
            </div>
            <RadioGroup
              label="What is your current status?"
              field="currentStatus"
              options={['Student', 'Employed', 'Unemployed', 'Other']}
            />
          </div>
        );

      case 1:
        return (
          <div className="onboarding-step-content">
            <div className="onboarding-step-intro">
              <Brain className="onboarding-step-intro-icon" size={24} />
              <p>These questions help us understand your mental well-being. There are no right or wrong answers.</p>
            </div>
            <BooleanField
              label="Have you frequently felt sad or lost interest recently?"
              field="feelsSadOrLostInterest"
            />
            <BooleanField
              label="Do you often feel excessively anxious or worried?"
              field="feelsAnxious"
            />
            <BooleanField
              label="Have you ever experienced a panic attack?"
              field="experiencedPanicAttack"
            />
            <BooleanField
              label="Have you ever experienced prolonged sadness or depression?"
              field="experiencedDepression"
            />
            <BooleanField
              label="Do you experience difficulty sleeping?"
              field="difficultySleeping"
            />
            <SliderField
              label="How often do you have trouble concentrating?"
              field="troubleConcentrating"
              lowLabel="Rarely"
              highLabel="Very often"
            />
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step-content">
            <div className="onboarding-step-intro">
              <Users className="onboarding-step-intro-icon" size={24} />
              <p>Let's understand your environment and support system.</p>
            </div>
            <BooleanField
              label="Have you ever consulted a mental health professional?"
              field="consultedProfessional"
            />
            <SliderField
              label="Does your work or study frequently affect your mental health?"
              field="workAffectsMentalHealth"
              lowLabel="Not at all"
              highLabel="Very much"
            />
            <BooleanField
              label="Do you feel your current environment is supportive of your mental health?"
              field="supportiveEnvironment"
            />
            <BooleanField
              label="Do you have someone to talk to when you face problems?"
              field="hasSupportPerson"
            />
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step-content">
            <div className="onboarding-step-intro">
              <Sparkles className="onboarding-step-intro-icon" size={24} />
              <p>Almost done! Tell us what brought you here.</p>
            </div>
            <div className="onboarding-field">
              <label className="onboarding-label">How are you feeling today?</label>
              <textarea
                value={form.feelingToday}
                onChange={(e) => set('feelingToday', e.target.value)}
                className="onboarding-textarea"
                placeholder="Take your time — share as much or as little as you'd like..."
                rows={4}
                maxLength={1000}
              />
              <div className="onboarding-char-count">
                {form.feelingToday.length} / 1000
              </div>
            </div>
            <div className="onboarding-field">
              <label className="onboarding-label">
                What do you hope to achieve using MindMate?
              </label>
              <p className="onboarding-field-hint">Select all that apply</p>
              <div className="onboarding-checklist">
                {EXPECTATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`onboarding-check-btn ${form.expectations.includes(opt) ? 'selected' : ''}`}
                    onClick={() => toggleExpectation(opt)}
                  >
                    {form.expectations.includes(opt) && <Check size={14} />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      {/* Decorative background orbs */}
      <div className="onboarding-bg-orb onboarding-bg-orb-1" />
      <div className="onboarding-bg-orb onboarding-bg-orb-2" />
      <div className="onboarding-bg-orb onboarding-bg-orb-3" />

      <div className="onboarding-card">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <div className="onboarding-logo-icon">🌿</div>
            <div>
              <h1 className="onboarding-title">Welcome to MindMate</h1>
              <p className="onboarding-subtitle">
                Let's personalize your experience
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="onboarding-stepper">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`onboarding-step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              >
                <div className="onboarding-step-circle">
                  {i < step ? <Check size={14} /> : <Icon size={16} />}
                </div>
                <span className="onboarding-step-label">{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={`onboarding-step-line ${i < step ? 'filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="onboarding-error">
            {error}
          </div>
        )}

        {/* Dynamic step content */}
        {renderStep()}

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 ? (
            <button
              type="button"
              className="onboarding-nav-btn secondary"
              onClick={prev}
              disabled={isSubmitting}
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <button
              type="button"
              className="onboarding-nav-btn secondary"
              onClick={() => {
                logout();
                navigate('/');
              }}
              disabled={isSubmitting}
            >
              <ChevronLeft size={18} />
              Cancel & Logout
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="onboarding-nav-btn primary"
              onClick={next}
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="onboarding-nav-btn primary submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="onboarding-spinner" />
                  Submitting…
                </>
              ) : (
                <>
                  Complete Setup
                  <Sparkles size={18} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Privacy note */}
        <p className="onboarding-privacy">
          🔒 Your responses are private and only used to personalize your MindMate experience.
        </p>
      </div>
    </div>
  );
}
