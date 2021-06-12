import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("relational expression tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse compare statement", () => {
    const program = `
        x > 0;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 0,
            },
          },
        },
      ],
    });
  });

  test("it should parse compare or equal statement and precedence of addition should be higher than comparison", () => {
    const program = `
        x + 2 >= 0;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">=",
            left: {
              type: "BinaryExpression",
              operator: "+",

              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 2,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 0,
            },
          },
        },
      ],
    });
  });

  test("it should parse chained compare statement", () => {
    const program = `
       3 > x >= 0;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">=",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              right: {
                type: "Identifier",
                name: "x",
              },
            },
            right: {
              type: "NumericLiteral",
              value: 0,
            },
          },
        },
      ],
    });
  });

  test("it should parse equality with true", () => {
    const program = `
       3 > x == true;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "==",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              right: {
                type: "Identifier",
                name: "x",
              },
            },
            right: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        },
      ],
    });
  });

  test("it should parse equality with false", () => {
    const program = `
       3 > x != false;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "!=",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "NumericLiteral",
                value: 3,
              },
              right: {
                type: "Identifier",
                name: "x",
              },
            },
            right: {
              type: "BooleanLiteral",
              value: false,
            },
          },
        },
      ],
    });
  });
});
