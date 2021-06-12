import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("variable tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return variable value", () => {
    const program = `
        let a = 42;
    `;
    expect(exsa.evalGlobal(program)).toBe(42);
  });

  test("it should chain variable declarations", () => {
    const program = `
        let a, b = 11;
        b;
    `;
    expect(exsa.evalGlobal(program)).toBe(11);
  });

  test("it should throw reference error", () => {
    const program = `
        a;
    `;

    function executeProgram() {
      exsa.evalGlobal(program);
    }

    expect(executeProgram).toThrowError(ReferenceError);
  });
});
