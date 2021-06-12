import { beforeAll } from "@jest/globals";
import Exsa from "../Exsa";

describe("literal tests", () => {
  let exsa;
  beforeAll(() => {
    exsa = new Exsa();
  });

  test("it should eval simple sum", () => {
    expect(exsa.evalGlobal(`2 + 3;`)).toBe(5);
  });

  test("it should eval chained sum", () => {
    expect(exsa.evalGlobal(`2 + 3 + 7;`)).toBe(12);
  });

  test("it should eval sum with mult", () => {
    expect(exsa.evalGlobal(`2 + 2 * 2;`)).toBe(6);
  });

  test("it should eval sum with mult", () => {
    expect(exsa.evalGlobal(`(2 + 2) * 2;`)).toBe(8);
  });
});
