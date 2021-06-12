import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("literal tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("double quotes string literal", () => {
    const program = `
        "  42  ";
    `;
    const ast = parser.parse(program);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "  42  ",
          },
        },
      ],
    });
  });

  test("single quotes string literal", () => {
    const program = `
      '42';
    `;
    const ast = parser.parse(program);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "42",
          },
        },
      ],
    });
  });

  test("numeric literal", () => {
    const program = `
      42;
    `;
    const ast = parser.parse(program);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 42,
          },
        },
      ],
    });
  });

  test("string literal syntax error", () => {
    const program = `
      "42
    `;

    function parseProgram() {
      parser.parse(program);
    }

    expect(parseProgram).toThrowError(SyntaxError);
  });
});
