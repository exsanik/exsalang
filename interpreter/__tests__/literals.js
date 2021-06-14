import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("literal tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return number", () => {
    expect(exsa.evalGlobal(`42;`)).toBe(42);
  });

  test("it should return string", () => {
    expect(exsa.evalGlobal(`'Hello world';`)).toBe("Hello world");
  });

  test("it should return object", () => {
    const program = `
      let nameProp = 'firstName';
      let person = { 
        [nameProp]: 'John',
        lastName: 'Doe'
      };

      person;
    `;

    expect(exsa.evalGlobal(program)).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("it should return array", () => {
    const program = `
      let arrItem = 10;
      let arr = [1, 2, [3, 4], arrItem];
      arr;
    `;

    expect(exsa.evalGlobal(program)).toEqual([1, 2, [3, 4], 10]);
  });
});
