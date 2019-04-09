class MyBigInt {
    constructor(input) {
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
        }
        else if (/^[0-9]+$/.exec(input)) {
            let tempN = input;
            let i = new MyBigInt('0');
            while (tempN.length > 0) {
                const str = tempN.slice(-14);
                this.numbers[i.toString()] = parseInt(str);
                tempN = tempN.slice(0, -14);
                i = MyBigInt.add(i, MyBigInt.ONE);
            }
        }
        else {
            let match = /^([0-9]+)e([0-9]+)$/.exec(input);
            if (match) {
                const lead = new MyBigInt(match[1]);
                const exponent = new MyBigInt(match[2]);
                const multiplier = MyBigInt.pow(new MyBigInt('10'), exponent);
                const product = MyBigInt.mul(lead, multiplier);
                this.numbers = product.numbers;
            }
            else {
                throw new Error("Unexpected type");
            }
        }
    }
    static abs(a) {
        throw new Error("Not Yet Implemented");
    }
    static add(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static sub(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static mul(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static div(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static pow(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static sign(a) {
        return a.sign;
    }
    static min(...a) {
        throw new Error("Not Yet Implemented");
    }
    static max(...a) {
        throw new Error("Not Yet Implemented");
    }
    static eq(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static gt(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static gte(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static lt(a, b) {
        throw new Error("Not Yet Implemented");
    }
    static lte(a, b) {
        throw new Error("Not Yet Implemented");
    }
}
MyBigInt.pattern = "-?[0-9]+(e[0-9]+)?";
MyBigInt.regex = /-?[0-9]+(e[0-9]+)?/;
MyBigInt.ONE = new MyBigInt('1');
//# sourceMappingURL=BigInteger.js.map