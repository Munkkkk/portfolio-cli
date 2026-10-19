import styles from "./Terminal.module.css";

interface WelcomeProps {
  name: string;
  suggestions: string[];
  onRun: (input: string) => void;
}

export function Welcome({ name, suggestions, onRun }: WelcomeProps) {
  return (
    <section className={styles.welcome}>
      <h1 className={styles.welcomeName}>{name}</h1>
      <p>Tapez &quot;help&quot; pour commencer.</p>
      <ul className={styles.suggestions}>
        {suggestions.map((s) => (
          <li key={s}>
            <button
              type="button"
              className={styles.suggestion}
              onClick={() => onRun(s)}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
