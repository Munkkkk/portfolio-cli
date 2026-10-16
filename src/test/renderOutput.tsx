import { render, type RenderResult } from "@testing-library/react";
import type { CommandOutput } from "@/core/types";

export function renderOutput(output: CommandOutput): RenderResult {
  return render(<>{output}</>);
}
