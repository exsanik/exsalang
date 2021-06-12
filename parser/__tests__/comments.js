import { beforeAll } from "@jest/globals";
import { Parser } from "../Parser.js";

describe("comments tests", () => {
  let parser;
  beforeAll(() => {
    parser = new Parser();
  });

  test("it should ignore single line comments", () => {
    const program = `
        // single line comment
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [],
    });
  });

  test("it should ignore multiline line comments", () => {
    const program = `
        /* 
            multi 
            line 
            comment
        */
    `;
    const ast = parser.parse(program);

    expect(ast).toEqual({
      type: "Program",
      body: [],
    });
  });
});
