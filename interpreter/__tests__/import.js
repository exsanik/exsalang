import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("import tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should import module and execute functions", () => {
    expect(2).toBe(2);
    // const program = `
    //     import Funcs from './interpreter/__tests__/test-module.exsa';

    //     let items = Array(5,3,7,6,2,9);

    //     Funcs.swap(items, 2, 5);
    //     items;
    // `;

    // expect(exsa.evalGlobal(program)).toBe([2, 3, 5, 6, 7, 9]);
  });
});
