import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("loops tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should exec native function", () => {
    const program = `
        print('Hello world');
    `;
    expect(exsa.evalGlobal(program)).toBe(undefined);
  });

  test("it should exec created function", () => {
    const program = `
        def square(x) {
            return x * x;
        }

        square(2);
    `;
    expect(exsa.evalGlobal(program)).toBe(4);
  });

  test("it should exec created function", () => {
    const program = `
        def sum(x, y) {
            return x + y;
        }

        sum(2, 5);
    `;
    expect(exsa.evalGlobal(program)).toBe(7);
  });

  test("it should create closure function", () => {
    const program = `
        def sum(a) {
            return def (b) {
                return a + b;
            } 
        }

        sum(2)(3);
    `;
    expect(exsa.evalGlobal(program)).toBe(5);
  });

  test("it should create closure function", () => {
    const program = `
        def fn() {
            return 42;
        }

        def sum(fn) {
            return fn();
        }

        sum(fn);
    `;
    expect(exsa.evalGlobal(program)).toBe(42);
  });

  test("it should create closure function with part usement", () => {
    const program = `
        def sum(a) {
            return def (b) {
                return a + b;
            } 
        }

        let sumPlusTwo = sum(2);

        sumPlusTwo(10);
    `;
    expect(exsa.evalGlobal(program)).toBe(12);
  });

  test("it should assign function to variable", () => {
    const program = `
        let fn = def (x) { x + x; };

        fn(7);
    `;
    expect(exsa.evalGlobal(program)).toBe(14);
  });

  test("it should return and stop execution", () => {
    const program = `
        let fn = def (x) { 
            if x == 42 { 
                return 10;
            }

            return x;
        };

        fn(42);
    `;
    expect(exsa.evalGlobal(program)).toBe(10);
  });

  test("it should calc with recursion", () => {
    const program = `
        def factorial(x) {
            if (x == 0) {
                return 1;
            } else {
                return x * factorial(x - 1);
            }
        }

        factorial(5);
    `;
    expect(exsa.evalGlobal(program)).toBe(120);
  });
});
