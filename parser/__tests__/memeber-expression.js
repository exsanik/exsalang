import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("member expression tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse member expression", () => {
    const program = `
        arr.length;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "Identifier",
              name: "arr",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
          },
        },
      ],
    });
  });

  test("it should parse member assignment", () => {
    const program = `
        x.y = 1;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "x",
              },
              property: {
                type: "Identifier",
                name: "y",
              },
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  test("it should parse member assignment", () => {
    const program = `
        x[0] = 1;
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "MemberExpression",
              computed: true,
              object: {
                type: "Identifier",
                name: "x",
              },
              property: {
                type: "NumericLiteral",
                value: 0,
              },
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
      ],
    });
  });

  test("it should parse member assignment", () => {
    const program = `
        a.b.c['d'];
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "MemberExpression",
                computed: false,
                object: {
                  type: "Identifier",
                  name: "a",
                },
                property: {
                  type: "Identifier",
                  name: "b",
                },
              },
              property: {
                type: "Identifier",
                name: "c",
              },
            },
            property: {
              type: "StringLiteral",
              value: "d",
            },
          },
        },
      ],
    });
  });
});
