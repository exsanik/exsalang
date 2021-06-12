import { beforeAll } from "@jest/globals";
import Exsa from "../Exsa";

describe("literal tests", () => {
  let exsa;
  beforeAll(() => {
    exsa = new Exsa();
  });

  test("it should return number", () => {
    expect(exsa.evalGlobal(`42;`)).toBe(42);
  });

  test("it should return string", () => {
    expect(exsa.evalGlobal(`'Hello world';`)).toBe("Hello world");
  });
});
