import { useState, useRef } from 'react';
import { Trash2, FileText } from 'lucide-react';

export default function ThoughtShredder() {
  const [text, setText] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const textareaRef = useRef(null);

  const handleShred = () => {
    if (!text.trim()) return;
    setIsShredding(true);

    // After animation completes, clear and reset
    setTimeout(() => {
      setText('');
      setIsShredding(false);
      textareaRef.current?.focus();
    }, 650);
  };

  return (
    <div className="card thought-shredder" id="thought-shredder">
      <div className="thought-shredder-header">
        <FileText size={20} />
        <h3>Thought Shredder</h3>
      </div>
      <p>Type out worries, stresses, or lingering thoughts, then let them go.</p>

      <div className={isShredding ? 'shred-animation' : ''}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I am holding onto…"
          disabled={isShredding}
          rows={4}
        />
      </div>

      <button
        className="shred-btn"
        onClick={handleShred}
        disabled={!text.trim() || isShredding}
        id="shred-thoughts-btn"
      >
        Shred Thoughts <Trash2 size={16} />
      </button>
    </div>
  );
}
