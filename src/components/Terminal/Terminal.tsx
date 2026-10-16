"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { parse } from "@/core/parser";
import type { Registry } from "@/core/registry";
import type { CommandContext, HistoryEntry } from "@/core/types";
import { OutputLine } from "./OutputLine";
import { Prompt } from "./Prompt";
import styles from "./Terminal.module.css";

interface TerminalProps {
  registry: Registry;
  welcome: (run: (input: string) => void) => ReactNode;
}

function WelcomeSlot({ render, run }: { render: TerminalProps["welcome"]; run: (input: string) => void }) {
  return <>{render(run)}</>;
}

export function Terminal({ registry, welcome }: TerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [value, setValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [history]);

  function run(raw: string) {
    let cleared = false;
    const ctx: CommandContext = {
      commands: registry.list(),
      clear: () => {
        cleared = true;
      },
    };
    const output = registry.execute(parse(raw), ctx);
    if (cleared) {
      setHistory([]);
      setShowWelcome(false);
    } else {
      const id = nextId.current++;
      setHistory((h) => [...h, { id, input: raw, output }]);
    }
    inputRef.current?.focus();
  }

  function submit() {
    run(value);
    setValue("");
  }

  function handleClick() {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <div className={styles.terminal} onClick={handleClick}>
      {showWelcome && <WelcomeSlot render={welcome} run={run} />}
      <div role="log" aria-live="polite">
        {history.map((entry) => (
          <OutputLine key={entry.id} entry={entry} />
        ))}
      </div>
      <Prompt value={value} onChange={setValue} onSubmit={submit} inputRef={inputRef} />
      <div ref={endRef} className={styles.end} />
    </div>
  );
}
