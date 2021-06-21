import { beforeEach } from "@jest/globals";
import Exsa from "../Exsa";

describe("complex programs tests", () => {
  let exsa;
  beforeEach(() => {
    exsa = new Exsa();
  });

  test("it handle binary search", () => {
    const program = `
          def binarySearch(arr, el, compareFn) {
              let m = 0;
              let n = arr.length - 1;

              while m <= n {
                  let k = Math.floor((n + m) / 2);
                  let cmp = compareFn(el, arr[k]);

                  if (cmp > 0) {
                      m = k + 1;
                  } else if(cmp < 0) {
                      n = k - 1;
                  } else {
                    return k;
                  }
              }
              return -m - 1;
          }
          
          let arr = [1, 2, 3, 4, 5, 6, 7];
          binarySearch(arr, 5, def (x, y) { 
            if x > y {
                1;
            } else if x < y {
               -1;
            } else {
                0;
            }
          });
      `;

    expect(exsa.evalGlobal(program)).toEqual(4);
  });

  test("it handle quickSort", () => {
    const program = `
        def swap(items, leftIndex, rightIndex) {
            let temp = items[leftIndex];
            items[leftIndex] = items[rightIndex];
            items[rightIndex] = temp;
        }

        def partition(items, left, right) {
            let pivot   = items[Math.floor((right + left) / 2)];
            let i       = left;
            let j       = right;
            while i <= j {
                while items[i] < pivot {
                    i+=1;
                }
                while items[j] > pivot {
                    j-=1;
                }
                if i <= j {
                    swap(items, i, j);
                    i+=1;
                    j-=1;
                }
            }
            return i;
        }

        def quickSort(items, left, right) {
            let index;
            if items.length > 1 {
                index = partition(items, left, right);
                if left < index - 1 {
                    quickSort(items, left, index - 1);
                }
                if index < right {
                    quickSort(items, index, right);
                }
            }
            return items;
        }

        let items = [5,3,7,6,2,9];
        quickSort(items, 0, items.length - 1);
    `;
    expect(exsa.evalGlobal(program)).toEqual([2, 3, 5, 6, 7, 9]);
  });
});
