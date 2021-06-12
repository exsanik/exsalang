import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("loops tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should loop while", () => {
    const program = `
        let i = 0;
        let result = 1;
        while i < 10 {
            i += 1;
            result *= i;
        }
    `;
    expect(exsa.evalGlobal(program)).toBe(3628800);
  });

  test("it should loop for", () => {
    const program = `
        let sum = 0;
        let result = for let i = 0; i < 10; i += 1; {
            sum += i;
        };
        result;
    `;
    expect(exsa.evalGlobal(program)).toBe(45);
  });

  test("it should loop do while", () => {
    const program = `
        let res = 0;
        do {
            res =  10;
        } while res < 5;
    `;
    expect(exsa.evalGlobal(program)).toBe(10);
  });
});
