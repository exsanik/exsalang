import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("if statement tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse if statement with alternate branch", () => {
    const program = `
        if x {
            x = 10;
        } else {
            x += 1;
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 10,
                  },
                },
              },
            ],
          },
          alternate: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "+=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("it should parse if statement", () => {
    const program = `
        if(x) {
            x = 10;
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 10,
                  },
                },
              },
            ],
          },
          alternate: null,
        },
      ],
    });
  });

  test("it should parse if statement", () => {
    const program = `
        if x if y {} else {} 
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "IfStatement",
            test: {
              type: "Identifier",
              name: "y",
            },
            consequent: {
              type: "BlockStatement",
              body: [],
            },
            alternate: {
              type: "BlockStatement",
              body: [],
            },
          },
          alternate: null,
        },
      ],
    });
  });
});
