import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("expression tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse multiple expressions", () => {
    const program = `
        42;

        "hello";
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
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello",
          },
        },
      ],
    });
  });

  test("it should handle empty statement", () => {
    const program = `
        ;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [{ type: "EmptyStatement" }],
    });
  });
});
