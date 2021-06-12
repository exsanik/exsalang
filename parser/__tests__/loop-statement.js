import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("loop statement tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse while statement", () => {
    const program = `
        while x {
            x -= 1;
        }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "WhileStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "-=",
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

  test("it should parse do while statement", () => {
    const program = `
      do {
        x -= 1;
      } while x > 10;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "DoWhileStatement",
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "-=",
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
          test: {
            type: "BinaryExpression",
            operator: ">",
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
    });
  });

  test("it should parse for loop statement", () => {
    const program = `
      for let i = 0; i < 10; i += 1; {
        x += i;
      }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          init: {
            type: "VariableStatement",
            declarations: [
              {
                type: "VariableDeclaration",
                id: {
                  type: "Identifier",
                  name: "i",
                },
                init: {
                  type: "NumericLiteral",
                  value: 0,
                },
              },
            ],
          },
          test: {
            type: "BinaryExpression",
            operator: "<",
            left: {
              type: "Identifier",
              name: "i",
            },
            right: {
              type: "NumericLiteral",
              value: 10,
            },
          },
          update: {
            type: "AssignmentExpression",
            left: {
              type: "Identifier",
              name: "i",
            },
            operator: "+=",
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  operator: "+=",
                  right: {
                    type: "Identifier",
                    name: "i",
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("it should empty for loop statement", () => {
    const program = `
      for ;;; {}
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ForStatement",
          init: null,
          test: null,
          update: null,
          body: {
            type: "BlockStatement",
            body: [],
          },
        },
      ],
    });
  });

  test("it should parse foreach loop statement", () => {
    const program = `
      foreach let i in arr {
        x += i;
      }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ForEachStatement",
          left: {
            type: "VariableStatement",
            declarations: [
              {
                type: "VariableDeclaration",
                id: {
                  type: "Identifier",
                  name: "i",
                },
                init: null,
              },
            ],
          },
          right: {
            type: "Identifier",
            name: "arr",
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  operator: "+=",
                  right: {
                    type: "Identifier",
                    name: "i",
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });
});
