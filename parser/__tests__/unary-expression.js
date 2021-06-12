import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("unary expression tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse negate expression", () => {
    const program = `
        -x;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "Identifier",
              name: "x",
            },
          },
        },
      ],
    });
  });

  test("it should parse chained negate expression", () => {
    const program = `
        --x;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "UnaryExpression",
              operator: "-",
              argument: {
                type: "Identifier",
                name: "x",
              },
            },
          },
        },
      ],
    });
  });

  test("it should parse not expression", () => {
    const program = `
        not x;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "not",
            argument: {
              type: "Identifier",
              name: "x",
            },
          },
        },
      ],
    });
  });
});
