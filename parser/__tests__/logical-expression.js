import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("logical expressions tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse logical expressions", () => {
    const program = `
        x > 42 and y < 42;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            operator: "and",
            type: "LogicalExpression",
            left: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 42,
              },
            },
            right: {
              type: "BinaryExpression",
              operator: "<",
              left: {
                type: "Identifier",
                name: "y",
              },
              right: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          },
        },
      ],
    });
  });
});
