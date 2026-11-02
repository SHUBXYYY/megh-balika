// Pure markdown toolbar helpers for the Blog CMS editor.
// Each function receives the current content and the textarea selection and
// returns the updated content plus the selection to restore afterwards, so the
// editor keeps cursor focus and never resets scroll or typing state.

export type EditorSelection = { start: number; end: number };

export type FormatResult = {
  content: string;
  selectionStart: number;
  selectionEnd: number;
};

const EXISTING_MARKDOWN_PREFIX =
  /^(#{1,6}\s|[-*+]\s|>\s|\d+\.\s)/;

const lineBounds = (content: string, selection: EditorSelection) => {
  const lineStart =
    content.lastIndexOf("\n", Math.max(selection.start - 1, 0)) + 1;
  let lineEnd = content.indexOf("\n", selection.end);
  if (lineEnd === -1) lineEnd = content.length;
  return { lineStart, lineEnd };
};

/** Wraps (or unwraps) the selection with an inline marker like ** or *. */
export function wrapInline(
  content: string,
  selection: EditorSelection,
  marker: string,
  placeholder: string,
): FormatResult {
  const { start, end } = selection;
  if (start !== end) {
    const alreadyWrapped =
      content.slice(start - marker.length, start) === marker &&
      content.slice(end, end + marker.length) === marker;
    if (alreadyWrapped) {
      const unwrapped =
        content.slice(0, start - marker.length) +
        content.slice(start, end) +
        content.slice(end + marker.length);
      return {
        content: unwrapped,
        selectionStart: start - marker.length,
        selectionEnd: end - marker.length,
      };
    }
    const selected = content.slice(start, end);
    const wrapped =
      content.slice(0, start) +
      marker +
      selected +
      marker +
      content.slice(end);
    return {
      content: wrapped,
      selectionStart: start + marker.length,
      selectionEnd: end + marker.length,
    };
  }
  const insertion = marker + placeholder + marker;
  const next = content.slice(0, start) + insertion + content.slice(end);
  return {
    content: next,
    selectionStart: start + marker.length,
    selectionEnd: start + marker.length + placeholder.length,
  };
}

/** Toggles a line prefix ("## ", "### ", "- ", "> ") across the selected lines. */
export function toggleLinePrefix(
  content: string,
  selection: EditorSelection,
  prefix: string,
): FormatResult {
  const { lineStart, lineEnd } = lineBounds(content, selection);
  const lines = content.slice(lineStart, lineEnd).split("\n");
  const meaningful = lines.filter((line) => line.trim().length > 0);
  const allHave =
    meaningful.length > 0 && meaningful.every((line) => line.startsWith(prefix));
  const next = allHave
    ? lines.map((line) => (line.startsWith(prefix) ? line.slice(prefix.length) : line))
    : lines.map((line) =>
        line.trim().length === 0
          ? line
          : prefix + line.replace(EXISTING_MARKDOWN_PREFIX, ""),
      );
  const updated = next.join("\n");
  return {
    content: content.slice(0, lineStart) + updated + content.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + updated.length,
  };
}

/** Toggles a "1. 2. 3." ordered list across the selected lines. */
export function toggleOrderedList(
  content: string,
  selection: EditorSelection,
): FormatResult {
  const { lineStart, lineEnd } = lineBounds(content, selection);
  const lines = content.slice(lineStart, lineEnd).split("\n");
  const meaningful = lines.filter((line) => line.trim().length > 0);
  const allHave =
    meaningful.length > 0 && meaningful.every((line) => /^\d+\.\s/.test(line));
  let counter = 0;
  const next = allHave
    ? lines.map((line) => line.replace(/^\d+\.\s/, ""))
    : lines.map((line) => {
        if (line.trim().length === 0) return line;
        counter += 1;
        return `${counter}. ${line.replace(EXISTING_MARKDOWN_PREFIX, "")}`;
      });
  const updated = next.join("\n");
  return {
    content: content.slice(0, lineStart) + updated + content.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + updated.length,
  };
}

/** Inserts a markdown link around the selection (or a placeholder) and selects the URL. */
export function insertLink(
  content: string,
  selection: EditorSelection,
): FormatResult {
  const { start, end } = selection;
  const selected = content.slice(start, end);
  const text = selected || "link text";
  const next = content.slice(0, start) + `[${text}](url)` + content.slice(end);
  const urlStart = start + text.length + 3;
  return {
    content: next,
    selectionStart: urlStart,
    selectionEnd: urlStart + 3,
  };
}
