import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("functions tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse function", () => {
    const program = `
        def square(x) {
            return x * x;
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "square",
          },
          params: [
            {
              type: "Identifier",
              name: "x",
            },
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "ExpressionStatement",
                  expression: {
                    type: "BinaryExpression",
                    operator: "*",
                    left: {
                      type: "Identifier",
                      name: "x",
                    },
                    right: {
                      type: "Identifier",
                      name: "x",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("it should parse function call", () => {
    const program = `
          square(x);
      `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "square",
            },
            arguments: [
              {
                type: "Identifier",
                name: "x",
              },
            ],
          },
        },
      ],
    });
  });

  test("it should parse chained function call", () => {
    const program = `
            foo(x)();
        `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "foo",
              },
              arguments: [
                {
                  type: "Identifier",
                  name: "x",
                },
              ],
            },
            arguments: [],
          },
        },
      ],
    });
  });

  test("it should parse function call", () => {
    const program = `
        console.log(x, y);
        `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "console",
              },
              property: {
                type: "Identifier",
                name: "log",
              },
            },
            arguments: [
              {
                type: "Identifier",
                name: "x",
              },
              {
                type: "Identifier",
                name: "y",
              },
            ],
          },
        },
      ],
    });
  });
});
