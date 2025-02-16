export function stripCommonIndent(text: string) {
  const lines = text.replace(/^\n+/, '').trimEnd().split('\n');
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim() !== '')
      .map((line) => line.match(/^\s*/)?.[0].length || 0),
  );
  return lines.map((line) => line.slice(indent)).join('\n');
}
