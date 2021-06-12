import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("variables tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should parse assignment", () => {
    const program = `
        x = 42;
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
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 42,
            },
          },
        },
      ],
    });
  });

  test("it should parse chained assignment", () => {
    const program = `
        x = y = 42;
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
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "AssignmentExpression",
              operator: "=",
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

  test("it should throw syntax error on wrong assignment", () => {
    const program = `
        42 = 42;
    `;

    function parseProgram() {
      parser.parse(program);
    }

    expect(parseProgram).toThrowError(SyntaxError);
  });

  test("it should parse complex assignment", () => {
    const program = `
        x += 42;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
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
              value: 42,
            },
          },
        },
      ],
    });
  });

  test("it should parse variable declaration", () => {
    const program = `
        let x;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
          ],
        },
      ],
    });
  });

  test("it should parse variable declaration with assignment", () => {
    const program = `
        let x = 42;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });

  test("it should parse multiple variable declaration", () => {
    const program = `
        let x, y, z = 42;
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "x",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "y",
              },
              init: null,
            },
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "z",
              },
              init: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    });
  });
});
