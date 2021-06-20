import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("binary expressions tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should handle sum expression", () => {
    const program = `
        2 + 5;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        },
      ],
    });
  });

  test("it should handle nested binary expression", () => {
    const program = `
        2 +5 - 3;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 5,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
        },
      ],
    });
  });

  test("it should handle multiplicative binary expression", () => {
    const program = `
        2 * 2;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  test("it should handle multiplicative binary expression", () => {
    const program = `
        2 ** 2 * 2;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "**",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });

  test("it should handle nested multiplicative binary expression with right order", () => {
    const program = `
        2 + 2 * 2;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2,
            },
            right: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
          },
        },
      ],
    });
  });

  test("it should handle binary expressions with brackets in right order", () => {
    const program = `
        (2 + 2) * 2;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 2,
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      ],
    });
  });
});
