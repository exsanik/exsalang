import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("literal tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("double quotes string literal", () => {
    const program = `
        "  42  ";
    `;
    const ast = parser.parse(program);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "  42  ",
          },
        },
      ],
    });
  });

  test("single quotes string literal", () => {
    const program = `
      '42';
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "42",
          },
        },
      ],
    });
  });

  test("numeric literal", () => {
    const program = `
      42;
    `;
    const ast = parser.parse(program);
    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 42,
          },
        },
      ],
    });
  });

  test("array literal", () => {
    const program = `
      [1, 2, 3];
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "ArrayLiteral",
            list: [
              {
                type: "NumericLiteral",
                value: 1,
              },
              {
                type: "NumericLiteral",
                value: 2,
              },
              {
                type: "NumericLiteral",
                value: 3,
              },
            ],
          },
        },
      ],
    });
  });

  test("nested array literal", () => {
    const program = `
      [1, 2, [3, 2, asd, {}]];
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "ArrayLiteral",
            list: [
              {
                type: "NumericLiteral",
                value: 1,
              },
              {
                type: "NumericLiteral",
                value: 2,
              },
              {
                type: "ArrayLiteral",
                list: [
                  {
                    type: "NumericLiteral",
                    value: 3,
                  },
                  {
                    type: "NumericLiteral",
                    value: 2,
                  },
                  {
                    type: "Identifier",
                    name: "asd",
                  },
                  {
                    type: "ObjectLiteral",
                    properties: null,
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  test("object literal", () => {
    const program = `
      { 
        firstName: 'John',
        lastName: 'Doe'
      }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ObjectLiteral",
          properties: [
            {
              type: "Property",
              name: {
                type: "Identifier",
                name: "firstName",
              },
              value: {
                type: "StringLiteral",
                value: "John",
              },
            },
            {
              type: "Property",
              name: {
                type: "Identifier",
                name: "lastName",
              },
              value: {
                type: "StringLiteral",
                value: "Doe",
              },
            },
          ],
        },
      ],
    });
  });

  test("object literal with computed properties", () => {
    const program = `
      { 
        [first]: 'John',
        lastName: 'Doe'
      }
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ObjectLiteral",
          properties: [
            {
              type: "Property",
              name: {
                type: "ComputedExpression",
                expression: {
                  type: "Identifier",
                  name: "first",
                },
              },
              value: {
                type: "StringLiteral",
                value: "John",
              },
            },
            {
              type: "Property",
              name: {
                type: "Identifier",
                name: "lastName",
              },
              value: {
                type: "StringLiteral",
                value: "Doe",
              },
            },
          ],
        },
      ],
    });
  });

  test("nested object literal", () => {
    const program = `
      { 
        name: {
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    `;

    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ObjectLiteral",
          properties: [
            {
              type: "Property",
              name: {
                type: "Identifier",
                name: "name",
              },
              value: {
                type: "ObjectLiteral",
                properties: [
                  {
                    type: "Property",
                    name: {
                      type: "Identifier",
                      name: "firstName",
                    },
                    value: {
                      type: "StringLiteral",
                      value: "John",
                    },
                  },
                  {
                    type: "Property",
                    name: {
                      type: "Identifier",
                      name: "lastName",
                    },
                    value: {
                      type: "StringLiteral",
                      value: "Doe",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test("string literal syntax error", () => {
    const program = `
      "42
    `;

    function parseProgram() {
      parser.parse(program);
    }

    expect(parseProgram).toThrowError(SyntaxError);
  });
});
