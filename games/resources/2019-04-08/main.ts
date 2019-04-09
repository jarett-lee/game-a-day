
window.onload = function() {
  const addFormUnsafe = document.getElementById("big-integer-form");
  if (!addFormUnsafe) throw new Error("Unexpected null or undefined value");

  const addForm : HTMLFormElement = addFormUnsafe as HTMLFormElement;

  const aElUnsafe : HTMLInputElement = addForm.elements["a"];
  if (!aElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(aElUnsafe instanceof HTMLInputElement)) throw new Error("Unexpected type");
  const aEl : HTMLInputElement = aElUnsafe as HTMLInputElement;
  const bElUnsafe : HTMLInputElement = addForm.elements["b"];
  if (!bElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(bElUnsafe instanceof HTMLInputElement)) throw new Error("Unexpected type");
  const bEl : HTMLInputElement = bElUnsafe as HTMLInputElement;
  const cElUnsafe : HTMLOutputElement = addForm.elements["result"];
  if (!cElUnsafe) throw new Error("Unexpected null or undefined value");
  if (!(cElUnsafe instanceof HTMLOutputElement)) throw new Error("Unexpected type");
  const cEl : HTMLOutputElement = cElUnsafe as HTMLOutputElement;

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
    cEl.value = "" + MyBigInt.add(a, b);

    return false;
  }

  addForm.addEventListener("submit", processForm);

  try {
    console.log(new MyBigInt('10000000000000001'));
    console.log(new MyBigInt('1000000000000000001'));
    console.log(new MyBigInt('1e15'));
    console.log(new MyBigInt('-10000000000000001'));
    console.log(new MyBigInt('-1e15'));
  } catch (e) {
    console.error(e);
  }
}
