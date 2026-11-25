// Parses CSV text (RFC 4180: double-quoted fields, "" for a quote, CRLF or LF line ends).
// Returns rows as { line, fields }, where `line` is the 1-based line the row starts on.
export function parseCsv(text, separator) {
  const rows = [];
  let fields = [];
  let field = "";
  let isQuoted = false;
  let line = 1;
  let rowLine = 1;

  const endRow = () => {
    fields.push(field);
    rows.push({ line: rowLine, fields });
    fields = [];
    field = "";
    rowLine = line;
  };

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (isQuoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index++;
      } else if (character === '"') {
        isQuoted = false;
      } else {
        if (character === "\n") {
          line++;
        }
        field += character;
      }
    } else if (character === '"' && field === "") {
      isQuoted = true;
    } else if (character === separator) {
      fields.push(field);
      field = "";
    } else if (character === "\r" || character === "\n") {
      if (character === "\r" && text[index + 1] === "\n") {
        index++;
      }
      line++;
      endRow();
    } else {
      field += character;
    }
  }

  if (isQuoted) {
    throw new Error(`line ${rowLine}: a quoted field is not closed`);
  }
  if (field !== "" || fields.length > 0) {
    endRow();
  }
  return rows;
}
