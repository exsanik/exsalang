import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("block tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse empty block", () => {
    const program = `
        {}
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [],
        },
      ],
    });
  });

  test("it should parse block with multiple expressions", () => {
    const program = `
        {
            42;
            "hello";
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
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
        },
      ],
    });
  });

  test("it should parse nested blocks", () => {
    const program = `
        {
            42;
            {
                "hello";
            }
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 42,
              },
            },
            {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "StringLiteral",
                    value: "hello",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
