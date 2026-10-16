import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Terminal } from "./Terminal";
import { Welcome } from "./Welcome";
import { createRegistry, type Registry } from "@/core/registry";
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

describe("Terminal error handling", () => {
  function setupReal() {
    const real = createRegistry([
      { name: "echo", description: "echo", run: (args) => <p>{args.join(" ")}</p> },
      {
        name: "boom",
        description: "throws",
        run: () => {
          throw new Error("kaboom");
        },
      },
    ]);
    render(<Terminal registry={real} welcome={() => null} />);
    return userEvent.setup();
  }

  it("shows an error for an unknown command and stays usable", async () => {
    const user = setupReal();
    await user.type(input(), "foo{Enter}");
    const log = screen.getByRole("log");
    expect(log).toHaveTextContent('command not found: foo. Type "help" to see available commands.');
    await user.type(input(), "echo still-here{Enter}");
    expect(within(log).getByText("still-here")).toBeInTheDocument();
  });

  it("survives a throwing command and stays usable", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = setupReal();
    await user.type(input(), "boom{Enter}");
    const log = screen.getByRole("log");
    expect(log).toHaveTextContent("error: boom failed");
    expect(input()).toHaveValue("");
    await user.type(input(), "echo after{Enter}");
    expect(within(log).getByText("after")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
