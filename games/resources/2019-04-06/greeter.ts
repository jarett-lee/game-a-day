// import { greeterFile } from "./lib";

interface Person {
  firstName: string;
  lastName: string;
}

function instanceOfPerson(object: any): object is Person {
  try {
    return "firstName" in object && "lastName" in object;
  } catch {
    return false;
  }
}

class Student implements Person {
  fullName: string;
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

function greeterString(person: string) {
  return "Hello, " + person;
}
function greeterInterface(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}
function greeterClass(person: Student) {
  return "Hello, " + person.fullName;
}
function greeterFunction(getName: (arg0: string) => string) {
  return "Hello, " + getName("Apple");
}
function greeterOptionals(firstName: string, lastName?: string) {
  return "Hello, " + firstName + (lastName ? " " + lastName : "");
}
// Both work
// function greeterArray(names: Array<string>) {
function greeterArray(names: string[]) {
  let out = "Hello,";
  for (let i = 0; i < names.length; i++) {
    out += " " + names[i]
  }
  return out;
}

type MinArray<T> = {
  0: T
} & Array<T>

function greeterMinArray(names: MinArray<string>) {
  let out = "Hello,";
  for (let i = 0; i < names.length; i++) {
    out += " " + names[i]
  }
  return out;
}

class BadGuy implements Person {
  record: string;
  constructor(public firstName: string, public lastName: string, public crime: string) {
    this.record = firstName + " " + lastName + " " + crime;
  }
}

// function greeterUnion(person: Student | BadGuy): any {
//   let t = {
//     firstName: person.firstName,
//     lastName: person.lastName,
//   };
//   (<Student>person).fullName;
//   (<Student>person).middleInitial;
//   // TypeScript doesn't parse assign properties
//   // Object.assign(t, {
//   //   fullName: "override fullName",
//   //   middleInitial: "",
//   // }, person);
//
//   // Object.assign(t, person);
//   // Object.assign(t, {
//   //   fullName: "override fullName",
//   //   middleInitial: "",
//   // });
//
//   return greeterClass(t);
// }

function greeterDetectPerson(person: any): string {
  if (instanceOfPerson(person)) {
    return "Hello, " + person.firstName + " " + person.lastName;
  }
  return "Hello, not-a-person";
}

function greeterOverload(person: string): string;
function greeterOverload(person: Student): string;
function greeterOverload(person: BadGuy): string;
function greeterOverload(person: any): any {
  if (typeof person == "object") {
    if (person instanceof Student) {
      return greeterClass(person);
    } else if (person instanceof BadGuy) {
      return "Hello, " + person.record;
    }
  }
  else if (typeof person == "string") {
    return greeterString(person);
  }
}

function append(parent: HTMLElement, text: string) {
  const child = document.createElement("p");
  child.innerText = text;
  parent.appendChild(child);
}

const div = document.createElement("div");

append(div, greeterString("Guy"));
// append(div, greeterString([0, 1]));
append(div, greeterInterface({ firstName: "Jane", lastName: "User" }));
append(div, greeterInterface(new Student("Class", "A", "Interface")));
append(div, greeterClass(new Student("Class", "Z", "Austin")));
// append(div, greeterClass({ fullName: "Class B Johnson" }));
append(div, greeterClass({ fullName: "Class B Johnson", firstName: "Class", middleInitial: "B", lastName: "Johnson" }));
append(div, greeterFunction(() => "Billy"));
append(div, greeterFunction((lastName) => "Billy " + lastName));
// console.log(greeterFunction((lastName, middleInitial) => "Billy " + middleInitial + lastName));
append(div, greeterOptionals("Billy"));
append(div, greeterOptionals("Billy", "Joel"));
// append(div, greeterFile("Name"));
append(div, greeterManualFile("Doe"));
append(div, greeterArray(["Billy", "Bob", "Joe"]));
append(div, greeterArray(["Billy"]));
append(div, greeterArray([]));
append(div, greeterMinArray(["Billy", "Bob", "Joe"]));
append(div, greeterMinArray(["Billy"]));
// append(div, greeterMinArray([]));
// append(div, greeterUnion(new Student("Class", "Z", "Austin")));
// append(div, greeterUnion(new BadGuy("Bad", "Guy", "Killer")));
append(div, greeterDetectPerson("Guy"));
let test1: {[key: string]: any} = [];
test1.firstName = "Array";
test1.lastName = "Person";
append(div, greeterDetectPerson(test1));
append(div, greeterDetectPerson(new Student("Class", "Z", "Austin")));
append(div, greeterOverload("Guy"));
append(div, greeterOverload(new Student("Class", "Z", "Austin")));
append(div, greeterOverload({ fullName: "Class B Johnson", firstName: "Class", middleInitial: "B", lastName: "Johnson" }));
append(div, greeterOverload(new BadGuy("Bad", "Guy", "Killer")));

function runCallback(callback?: () => void) {
  callback && callback();
}

runCallback()



// allowed with default "strictNullChecks": false
// append(div, greeterString(null));
// append(div, greeterString(undefined));

// append(div, greeterInterface(null));
//   ^ run-time error, null.firstName does not exist

document.body.appendChild(div);
