import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("class tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it should return variable value", () => {
    const program = `
        class Point {
            def constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            def calc() {
                return this.x + this.y;
            }
        }

        let point = new Point(2, 3);
        point.calc();
    `;
    expect(exsa.evalGlobal(program)).toBe(5);
  });

  test("it should return variable value", () => {
    const program = `
        class Point {
            def constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            def calc() {
                return this.x + this.y;
            }
        }

        class Point3D extends Point {
            def constructor(x, y, z) {
                super(x, y);
                this.z = z;
            }
            def calc() {
                return this.z;
            }
        }

        let point = new Point3D(2, 3, 5);
        point.calc();
    `;
    expect(exsa.evalGlobal(program)).toBe(5);
  });
});
