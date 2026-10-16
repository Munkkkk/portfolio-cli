import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Terminal } from "./Terminal";
import { Welcome } from "./Welcome";
import type { Registry } from "@/core/registry";
import type { CommandContext } from "@/core/types";

const registry: Registry = {
  list: () => [],
  execute: (input, ctx: CommandContext) => {
    if (input.name === "echo") return <p>{input.args.join(" ")}</p>;
    if (input.name === "clear") {
      ctx.clear();
      return null;
    }
    return null;
  },
};

function setup() {
  render(
    <Terminal
      registry={registry}
      welcome={(run) => (
        <Welcome name="Test" suggestions={["echo hi"]} onRun={run} />
      )}
    />,
  );
  return userEvent.setup();
}

const input = () => screen.getByRole("textbox", { name: "Terminal command" });

describe("Terminal", () => {
  it("has an accessible input and log", () => {
    setup();
    expect(input()).toBeInTheDocument();
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("runs a command and clears the input", async () => {
    const user = setup();
    await user.type(input(), "echo hello{Enter}");
    const log = screen.getByRole("log");
    expect(log).toHaveTextContent("visitor@portfolio:~$ echo hello");
    expect(within(log).getByText("hello")).toBeInTheDocument();
    expect(input()).toHaveValue("");
  });

  it("adds a bare prompt line for empty input", async () => {
    const user = setup();
    await user.type(input(), "{Enter}{Enter}");
    const log = screen.getByRole("log");
    expect(log.textContent?.match(/visitor@portfolio:~\$/g)).toHaveLength(2);
  });

  it("clear empties the log and hides the welcome", async () => {
    const user = setup();
    expect(screen.getByText('Type "help" to get started.')).toBeInTheDocument();
    await user.type(input(), "echo a{Enter}clear{Enter}");
    expect(screen.getByRole("log")).toBeEmptyDOMElement();
    expect(
      screen.queryByText('Type "help" to get started.'),
    ).not.toBeInTheDocument();
  });

  it("runs a suggestion on click", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "echo hi" }));
    expect(screen.getByRole("log")).toHaveTextContent("hi");
  });
});
