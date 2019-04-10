


window.onload = function() {
  const addFormUnsafe = document.getElementById("big-integer-form");
  if (!addFormUnsafe) throw new Error("Unexpected null or undefined value");

  const addForm : HTMLFormElement = addFormUnsafe as HTMLFormElement;

  const aElUnsafe = addForm.elements.namedItem("a");
  if (!aElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(aElUnsafe instanceof HTMLInputElement)) throw new Error("Unexpected type");
  const aEl : HTMLInputElement = aElUnsafe;
  const bElUnsafe = addForm.elements.namedItem("b");
  if (!bElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(bElUnsafe instanceof HTMLInputElement)) throw new Error("Unexpected type");
  const bEl : HTMLInputElement = bElUnsafe;
  const cElUnsafe = addForm.elements.namedItem("result");
  if (!cElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(cElUnsafe instanceof HTMLOutputElement)) throw new Error("Unexpected type");
  const cEl : HTMLOutputElement = cElUnsafe;

  for (let elementUnsafe of addForm.elements) {
    if (elementUnsafe instanceof HTMLInputElement) {
      const element : HTMLInputElement = elementUnsafe as HTMLInputElement;
      element.pattern = MyBigInt.pattern;
      element.addEventListener("input", function () {
        // If custom validity is not cleared, validity has a custom error, thus is never valid
        // Therefore it must be cleared before checking if valid
        element.setCustomValidity("");
        if (!element.validity.valid) {
          element.setCustomValidity("Please enter an integer.");
        }
      })
    }
  }

  function processForm(e: Event) {
    e.preventDefault();


    const a = new MyBigInt(aEl.value);
    const b = new MyBigInt(bEl.value);
    console.log(a, b, MyBigInt.add(a, b));
    cEl.value = "" + MyBigInt.add(a, b);

    return false;
  }

  addForm.addEventListener("submit", processForm);

  try {
    console.log("1e1", new MyBigInt("1e1"), [10]);
    console.log("10000000000000001", new MyBigInt("10000000000000001"), [1, 100]);
    console.log("1000000000000000001", new MyBigInt("1000000000000000001"), [1, 10000]);
    console.log("1e15", new MyBigInt("1e15"), [0, 10]);
    console.log("-10000000000000001", new MyBigInt("-10000000000000001"), [1, 100]);
    console.log("-1e15", new MyBigInt("-1e15"), [0, 10]);
    console.log("999e12", new MyBigInt("999e12"), [99000000000000, 9]);
    console.log("-999e12", new MyBigInt("-999e12"), [99000000000000, 9]);
    console.log("1 shift right 1", MyBigInt.shift(new MyBigInt("1"), -1), [0]);
    console.log("1 shift right 1e15", MyBigInt.shift(new MyBigInt("1e15"), -1), [0, 1]);
    console.log("3 shift right 12345e15", MyBigInt.shift(new MyBigInt("12345e15"), -3), [45000000000000, 123]);
    const abc = MyBigInt.shift(new MyBigInt("12345e15"), -3);
    console.log(abc, abc.toString());

    let a = new MyBigInt("1e15");
    let b = new MyBigInt("-1e14");
    console.log("Add: ", a, b, b.toString());
    console.log(MyBigInt.add(a, b));

    a = new MyBigInt("-1e20");
    b = new MyBigInt("999e12");
    console.log("Add: ", a, b, a.toString(), b.toString());
    console.log(MyBigInt.add(a, b));
  } catch (e) {
    console.error(e);
  }
}
