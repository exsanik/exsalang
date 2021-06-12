import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("blocks tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return variable value", () => {
    const program = `
        let data = 42;
        { 
            data += 100;
        }
        data;
    `;
    expect(exsa.evalGlobal(program)).toBe(142);
  });

  test("it should not redeclare global variable", () => {
    const program = `
        let data = 42;
        { 
            let data = 5;
        }
        data;
    `;
    expect(exsa.evalGlobal(program)).toBe(42);
  });

  test("it should not redeclare global variable", () => {
    const program = `
        let data = 10;
        let result;
        { 
            let x = data + 15;
            result = x;
        }
        result;
    `;
    expect(exsa.evalGlobal(program)).toBe(25);
  });
});
