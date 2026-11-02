import { describe, expect, it } from "vitest";
import {
  insertLink,
  toggleLinePrefix,
  toggleOrderedList,
  wrapInline,
} from "./markdownToolbar";

describe("wrapInline", () => {
  it("bolds the selected text without touching the rest", () => {
    const result = wrapInline("woven in Banaras", { start: 9, end: 16 }, "**", "bold text");
    expect(result.content).toBe("woven in **Banaras**");
    expect(result.selectionStart).toBe(11);
    expect(result.selectionEnd).toBe(18);
  });

  it("unwraps when the selection is already bold", () => {
    const result = wrapInline("woven in **Banaras**", { start: 11, end: 18 }, "**", "bold text");
    expect(result.content).toBe("woven in Banaras");
    expect(result.selectionStart).toBe(9);
    expect(result.selectionEnd).toBe(16);
  });

  it("inserts a bold placeholder and selects it when nothing is selected", () => {
    const result = wrapInline("", { start: 0, end: 0 }, "**", "bold text");
    expect(result.content).toBe("**bold text**");
    expect(result.selectionStart).toBe(2);
    expect(result.selectionEnd).toBe(11);
  });

  it("italicises the selected text", () => {
    const result = wrapInline("pure zari", { start: 5, end: 9 }, "*", "italic text");
    expect(result.content).toBe("pure *zari*");
  });
});

describe("toggleLinePrefix", () => {
  it("turns the current line into an H2 heading", () => {
    const result = toggleLinePrefix("first line\nweaves of bengal\nlast", { start: 14, end: 26 }, "## ");
    expect(result.content).toBe("first line\n## weaves of bengal\nlast");
  });

  it("upgrades an existing H2 to H3 when H3 is requested", () => {
    const result = toggleLinePrefix("## weaves of bengal", { start: 3, end: 19 }, "### ");
    expect(result.content).toBe("### weaves of bengal");
  });

  it("removes the heading when every selected line already has it", () => {
    const result = toggleLinePrefix("## weaves\n## of bengal", { start: 0, end: 22 }, "## ");
    expect(result.content).toBe("weaves\nof bengal");
  });

  it("prefixes every non-empty line for a blockquote", () => {
    const result = toggleLinePrefix("handloom\n\nheritage", { start: 0, end: 18 }, "> ");
    expect(result.content).toBe("> handloom\n\n> heritage");
  });

  it("prefixes every non-empty line for a bullet list", () => {
    const result = toggleLinePrefix("mulberry silk\nzari border", { start: 0, end: 25 }, "- ");
    expect(result.content).toBe("- mulberry silk\n- zari border");
  });
});

describe("toggleOrderedList", () => {
  it("numbers each selected line in order", () => {
    const result = toggleOrderedList("mulberry silk\nzari border", { start: 0, end: 25 });
    expect(result.content).toBe("1. mulberry silk\n2. zari border");
  });

  it("removes the numbering when the list already exists", () => {
    const result = toggleOrderedList("1. mulberry silk\n2. zari border", { start: 0, end: 31 });
    expect(result.content).toBe("mulberry silk\nzari border");
  });
});

describe("insertLink", () => {
  it("wraps the selected text as the link label and selects the URL", () => {
    const result = insertLink("see the atelier", { start: 4, end: 15 });
    expect(result.content).toBe("see [the atelier](url)");
    expect(result.selectionStart).toBe(18);
    expect(result.selectionEnd).toBe(21);
  });

  it("inserts a placeholder label when nothing is selected", () => {
    const result = insertLink("", { start: 0, end: 0 });
    expect(result.content).toBe("[link text](url)");
    expect(result.selectionStart).toBe(12);
    expect(result.selectionEnd).toBe(15);
  });
});
