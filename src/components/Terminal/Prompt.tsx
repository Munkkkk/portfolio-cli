import type { KeyboardEvent, Ref } from "react";
import styles from "./Terminal.module.css";

export const PROMPT_LABEL = "visitor@portfolio:~$";

interface PromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: Ref<HTMLInputElement>;
}

export function Prompt({ value, onChange, onSubmit, inputRef }: PromptProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className={styles.promptRow}>
      <span className={styles.promptLabel} aria-hidden="true">
        {PROMPT_LABEL}
      </span>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Commande du terminal"
        autoComplete="off"
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        enterKeyHint="send"
      />
    </div>
  );
}
