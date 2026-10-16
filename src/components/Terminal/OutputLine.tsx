import type { HistoryEntry } from "@/core/types";
import { PROMPT_LABEL } from "./Prompt";
import styles from "./Terminal.module.css";

export function OutputLine({ entry }: { entry: HistoryEntry }) {
  return (
    <div className={styles.entry}>
      <div className={styles.echo}>
        <span className={styles.promptLabel}>{PROMPT_LABEL}</span>{" "}
        <span>{entry.input}</span>
      </div>
      {entry.output !== null && entry.output !== undefined && (
        <div className={styles.output}>{entry.output}</div>
      )}
    </div>
  );
}
