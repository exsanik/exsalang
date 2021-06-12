import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("if statement tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return variable value", () => {
    const program = `
        let a = 42, b = 2;

        if(a > b) {
            b;
        } else {
            a;
        }
    `;
    expect(exsa.evalGlobal(program)).toBe(2);
  });

  test("it should return variable value", () => {
    const program = `
        let a = 42, b = 2, c  = 1;

        if(a > b and b > c) {
            b;
        } else {
            a;
        }
    `;
    expect(exsa.evalGlobal(program)).toBe(2);
  });

  test("it should return variable value", () => {
    const program = `
        let a = 0;

        if not a {
            777;
        }
    `;
    expect(exsa.evalGlobal(program)).toBe(777);
  });

  test("it should assign result of if", () => {
    const program = `
        let smth = if(true) {
            // some long execution
            'string';
        };
    `;
    expect(exsa.evalGlobal(program)).toBe("string");
  });
});
