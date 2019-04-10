


class MyBigInt {
  private numbers : number[];
  private sign : -1 | 0 | 1;

  static pattern : string = "-?[0-9]+(e[0-9]+)?";
  static regex : RegExp = /-?[0-9]+(e[0-9]+)?/;

  static ONE : MyBigInt = new MyBigInt(1);
  static DIGIT_LEN : number = 14;
  static DIGIT_VAL : number = 1e14;

  constructor(input: number | string | MyBigInt) {
    // NOTE: array cannot handle more than Number.MAX_SAFE_INTEGER elements, but these values are too large to
    // calculate anyways
    this.numbers = [];
    this.sign = 1;

    if (typeof input === "number") {
      this.sign = <-1 | 0 | 1>Math.sign(input);
      input = Math.abs(input);

      if (Number.isInteger(input) && input <= Number.MAX_SAFE_INTEGER) {
        let tempN = input.toString();
        let i = 0;
        while (tempN.length > 0) {
          const str = tempN.slice(-MyBigInt.DIGIT_LEN);
          const num = parseInt(str);
          if (num !== 0) this.numbers[i] = num;

          tempN = tempN.slice(0, -MyBigInt.DIGIT_LEN);
          i += 1;
        }
      } else {
        throw new Error("Unexpected type");
      }
    } else if (typeof input === "string") {
      if (input[0] === "-") {
        this.sign = -1;
        input = input.slice(1);
      }

      if (/^[0]+$/.exec(input)) {
        this.sign = 0;
      } else if (/^[0-9]+$/.exec(input)) {
        let tempN = input;
        let i = 0;
        while (tempN.length > 0) {
          const str = tempN.slice(-MyBigInt.DIGIT_LEN);
          const num = parseInt(str);
          if (num !== 0) this.numbers[i] = num;

          tempN = tempN.slice(0, -MyBigInt.DIGIT_LEN);
          i += 1;
        }
      } else {
        let match = /^([0-9]+)e([0-9]+)$/.exec(input)
        if (match) {
          const lead = new MyBigInt(match[1]);
          // const exponent = new MyBigInt(match[2]);
          const exponent = parseInt(match[2]);
          const result = MyBigInt.shift(lead, exponent);
          this.numbers = result.numbers;
        } else {
          throw new Error("Unexpected type");
        }
      }
    } else if (input instanceof MyBigInt) {
      this.numbers = input.numbers.slice(0);
      this.sign = input.sign;
    } else {
      throw new Error("Unexpected type");
    }
  }

  clone(): MyBigInt {
    return new MyBigInt(this);
  }

  abs(): void {
    this.sign = <-1 | 0 | 1>Math.abs(this.sign);
  }

  toString(): string {
    if (this.sign === 0) return "0";
    let out = "";
    if (this.sign === -1) out = out + "-";
    out = out + this.numbers[this.numbers.length - 1];

    for (let i = this.numbers.length - 2; i >= 0; i--) {
      const x = this.numbers[i];
      // NOTE: padStart has sufficient support, but I do not want to use additional es2017 features
      // @ts-ignore
      if (x) out = out + x.toString()!.padStart(MyBigInt.DIGIT_LEN, "0");
      else out = out + MyBigInt.DIGIT_VAL.toString().slice(1);
    }
    return out;
  }

  static abs(a: MyBigInt): MyBigInt {
    const out = new MyBigInt(a);
    out.sign = <-1 | 0 | 1>Math.abs(out.sign);
    return out;
  }

  static add(a: MyBigInt, b: MyBigInt): MyBigInt {
    if (a.sign === 0) return b.clone();
    if (b.sign === 0) return a.clone();

    if (a.sign === b.sign) {
      let carry = 0;
      const len = Math.max(a.numbers.length, b.numbers.length);
      const out = new MyBigInt(0);
      for (let i = 0; i < len; i++) {
        const x = a.numbers[i] || 0;
        const y = b.numbers[i] || 0;
        const sum = x + y + carry;
        const num = sum % MyBigInt.DIGIT_VAL;
        if (num !== 0) out.numbers[i] = num;
        carry = (sum - (sum % MyBigInt.DIGIT_VAL)) / MyBigInt.DIGIT_VAL;
      }
      out.sign = a.sign;
      return out;
    } else {
      if (a.sign < b.sign) {
        const temp = a;
        a = b;
        b = temp;
      }
      // positive a, negative b

      const out = new MyBigInt(0);
      const len = Math.max(a.numbers.length, b.numbers.length);
      let j : number = 0;
      for (let i = len - 1; i >= 0; i--) {
        const x = a.numbers[i] || 0;
        const y = b.numbers[i] || 0;

        if (x > y) {
          out.sign = 1;
          j = i;
          break;
        } else if (x < y) {
          out.sign = -1;
          j = i;
          break;
        }
      }

      if (j === 0) {
        return out;
      }

      if (out.sign === -1) {
        const temp = a;
        a = b;
        b = temp;
      }
      // |a| > |b|

      for (let i = j; i >= 0; i--) {
        const x = a.numbers[i] || 0;
        const y = b.numbers[i] || 0;

        if (x > y) {
          out.numbers[i] = x - y;
        } else if (x < y) {
          out.numbers[i] = MyBigInt.DIGIT_VAL + x - y;
          for (let k = i+1; k < out.numbers.length; k++) {
            if (!out.numbers[k]) {
              out.numbers[k] = MyBigInt.DIGIT_VAL - 1;
            } else if (out.numbers[i] === 1) {
              MyBigInt.safeDelete(out, i);
              break;
            } else {
              out.numbers[k] -= 1;
              break;
            }
          }
        }
      }

      return out;
    }
  }

  static safeDelete(out : MyBigInt, i : number) {
    if (i === 0) {
      out.numbers.length = 0;
    } else if (out.numbers.length - 1 === i) {
      delete out.numbers[i];
      for (let j = out.numbers.length - 1; j >= 0; j--) {
        if (out.numbers[j]) {
          out.numbers.length = j + 1;
          break;
        }
      }
    }
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

  static mod(a: MyBigInt, b: MyBigInt): MyBigInt {
    throw new Error("Not Yet Implemented");
  }

  static fullDiv(a: MyBigInt, b: MyBigInt): {quotient: MyBigInt, remainder: MyBigInt} {
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

  static shift(a: MyBigInt, b: number | MyBigInt): MyBigInt {
    let macroOffset : number;
    let microOffset : number;
    let bSign : number;

    if (typeof b === "number") {
      if (!Number.isInteger(b) || !(b <= Number.MAX_SAFE_INTEGER)) throw new Error("Shift too large");
      if (Math.sign(b) === 0) return a.clone();

      bSign = Math.sign(b);
      b = Math.abs(b);
      macroOffset = (b - (b % MyBigInt.DIGIT_LEN)) / MyBigInt.DIGIT_LEN;
      microOffset = b % MyBigInt.DIGIT_LEN;
    } else if (b instanceof MyBigInt) {
      if (b.sign === 0) return a.clone();
      throw new Error("Not Yet Implemented");
    } else {
      throw new Error("Unexpected arguments");
    }

    if (bSign === -1) {
      const slicer = Math.pow(10, microOffset);

      const out = new MyBigInt(0);
      for (let i = a.numbers.length; i >= macroOffset; i--) {
        const x = a.numbers[i];
        if (!x) continue;

        if (microOffset > 0) {
          // get the front microOffset digits
          const top = (x - (x % slicer)) / slicer;
          const bot = (x % slicer) * Math.pow(10, MyBigInt.DIGIT_LEN-microOffset);
          console.log(top, bot);

          if (top !== 0) out.numbers[i-macroOffset] = (out.numbers[i-macroOffset+1] || 0) + top;
          if (bot !== 0 && i-macroOffset-1 >= 0) out.numbers[i-macroOffset-1] = (out.numbers[i-macroOffset] || 0) + bot;
        } else {
          if (x !== 0) out.numbers[i-macroOffset] = x;
        }
      }
      if (out.numbers.length > 0) out.sign = a.sign;
      return out;
    } else if (bSign === 1) {
      if (macroOffset + a.numbers.length > Number.MAX_SAFE_INTEGER) throw new Error("Shift too large");

      const slicer = Math.pow(10, MyBigInt.DIGIT_LEN - microOffset);

      const out = new MyBigInt(0);
      for (let i = a.numbers.length; i >= 0; i--) {
        const x = a.numbers[i];
        if (!x) continue;

        if (microOffset > 0) {
          // get the front microOffset digits
          const top = (x - (x % slicer)) / slicer;
          const bot = (x % slicer) * Math.pow(10, microOffset);

          if (top !== 0) out.numbers[i+macroOffset+1] = (out.numbers[i+macroOffset+1] || 0) + top;
          if (bot !== 0) out.numbers[i+macroOffset] = (out.numbers[i+macroOffset] || 0) + bot;
        } else {
          if (x !== 0) out.numbers[i+macroOffset] = x;
        }
      }
      if (out.numbers.length > 0) out.sign = a.sign;
      return out;
    } else {
      throw new Error("Unexpected sign");
    }
  }

  static eq(a: MyBigInt, b: MyBigInt): boolean {
    if (a.sign !== b.sign) return false;
    return MyBigInt.eqAbs(a, b);
  }

  static gt(a: MyBigInt, b: MyBigInt): boolean {
    if (a.sign > b.sign) return true;
    if (a.sign < b.sign) return false;
    if (a.sign === 0) return false;
    if (a.sign === 1) return MyBigInt.gtAbs(a, b);
    if (a.sign === -1) return !MyBigInt.gtAbs(a, b);
    throw new Error("Unexpected sign");
  }

  static gte(a: MyBigInt, b: MyBigInt): boolean {
    if (a.sign > b.sign) return true;
    if (a.sign < b.sign) return false;
    if (a.sign === 0) return true;
    if (a.sign === 1) return MyBigInt.gteAbs(a, b);
    if (a.sign === -1) return !MyBigInt.gteAbs(a, b);
    throw new Error("Unexpected sign");
  }

  static lt(a: MyBigInt, b: MyBigInt): boolean {
    return !MyBigInt.gte(a, b);
  }

  static lte(a: MyBigInt, b: MyBigInt): boolean {
    return !MyBigInt.gt(a, b);
  }

  static eqAbs(a: MyBigInt, b: MyBigInt): boolean {
    if (a.numbers.length !== b.numbers.length) return false;
    for (let i = 0; i < a.numbers.length; i++) {
      const x = a.numbers[i];
      const y = b.numbers[i];
      if (x !== y) return false;
    }
    return true;
  }

  static gtAbs(a: MyBigInt, b: MyBigInt): boolean {
    if (a.numbers.length > b.numbers.length) return true;
    if (a.numbers.length < b.numbers.length) return false;
    for (let i = a.numbers.length - 1; i >= 0; i--) {
      const x = a.numbers[i];
      const y = b.numbers[i];
      if (x > y) return true;
      else if (x < y) return false;
    }
    return false;
  }

  static gteAbs(a: MyBigInt, b: MyBigInt): boolean {
    if (a.numbers.length > b.numbers.length) return true;
    if (a.numbers.length < b.numbers.length) return false;
    for (let i = a.numbers.length - 1; i >= 0; i--) {
      const x = a.numbers[i];
      const y = b.numbers[i];
      if (x > y) return true;
      else if (x < y) return false;
    }
    return true;
  }

  static ltAbs(a: MyBigInt, b: MyBigInt): boolean {
    return !MyBigInt.gteAbs(a, b);
  }

  static lteAbs(a: MyBigInt, b: MyBigInt): boolean {
    return !MyBigInt.gtAbs(a, b);
  }
}
