
class MyBigInt {
  private numbers : number[];
  private sign : number;

  static pattern : string = "-?[0-9]+(e[0-9]+)?";
  static regex : RegExp = /-?[0-9]+(e[0-9]+)?/;

  static ONE : MyBigInt = new MyBigInt('1');

  constructor(input: string) {
    // TODO: array cannot handle more than Number.MAX_SAFE_INTEGER elements
    this.numbers = [];
    this.sign = 1;

    if (input[0] === '-') {
      this.sign = -1;
      input = input.slice(1);
    }

    if (/^[0]+$/.exec(input)) {
      this.sign = 0;
      this.numbers[0] = 0;
    } else if (/^[0-9]+$/.exec(input)) {
      let tempN = input;
      let i = new MyBigInt('0');
      while (tempN.length > 0) {
        const str = tempN.slice(-14);
        this.numbers[i.toString()] = parseInt(str);

        tempN = tempN.slice(0, -14);
        i = MyBigInt.add(i, MyBigInt.ONE);
      }
    } else {
      let match = /^([0-9]+)e([0-9]+)$/.exec(input)
      if (match) {
        const lead = new MyBigInt(match[1]);
        const exponent = new MyBigInt(match[2]);
        const multiplier = MyBigInt.pow(new MyBigInt('10'), exponent);
        const product = MyBigInt.mul(lead, multiplier);
        this.numbers = product.numbers;
      } else {
        throw new Error("Unexpected type");
      }
    }
  }

  static abs(a: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static add(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static sub(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static mul(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static div(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static pow(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static sign(a: MyBigInt): number {
    return a.sign;
  }

  static min(...a: MyBigInt[]): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static max(...a: MyBigInt[]): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static eq(a: MyBigInt, b: MyBigInt): boolean {
    throw new Error("Not Yet Implemented");
  }

  static gt(a: MyBigInt, b: MyBigInt): boolean {
    throw new Error("Not Yet Implemented");
  }

  static gte(a: MyBigInt, b: MyBigInt): boolean {
    throw new Error("Not Yet Implemented");
  }

  static lt(a: MyBigInt, b: MyBigInt): boolean {
    throw new Error("Not Yet Implemented");
  }

  static lte(a: MyBigInt, b: MyBigInt): boolean {
    throw new Error("Not Yet Implemented");
  }
}
