import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("member tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return number", () => {
    const program = `
        let arr = [1, 2, 3];

        arr[2];
    `;

    expect(exsa.evalGlobal(program)).toEqual(3);
  });

  test("it should access object prop", () => {
    const program = `
        let obj = {
            name: 'John'
        };

        obj.name;
    `;

    expect(exsa.evalGlobal(program)).toEqual("John");
  });
});
