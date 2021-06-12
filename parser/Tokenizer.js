import { SPEC } from "./SpecTokens";

export class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  matchToken(string, regex) {
    const matched = regex.exec(string);
    if (matched !== null) {
      this._cursor += matched[0].length;

      return matched[0];
    }

    return null;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const { regex, type } of SPEC) {
      const result = this.matchToken(string, regex);
      if (result === null) continue;

      // ignore whitespace for e.g.
      if (type === null) return this.getNextToken();

      return {
        type,
        value: result,
      };
    }

    throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }
}
