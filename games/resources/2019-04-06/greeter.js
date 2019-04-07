// import { greeterFile } from "./lib";
function instanceOfPerson(object) {
    try {
        return "firstName" in object && "lastName" in object;
    }
    catch (_a) {
        return false;
    }
}
class Student {
    constructor(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}
function greeterString(person) {
    return "Hello, " + person;
}
function greeterInterface(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
function greeterClass(person) {
    return "Hello, " + person.fullName;
}
function greeterFunction(getName) {
    return "Hello, " + getName("Apple");
}
function greeterOptionals(firstName, lastName) {
    return "Hello, " + firstName + (lastName ? " " + lastName : "");
}
// Both work
// function greeterArray(names: Array<string>) {
function greeterArray(names) {
    let out = "Hello,";
    for (let i = 0; i < names.length; i++) {
        out += " " + names[i];
    }
    return out;
}
function greeterMinArray(names) {
    let out = "Hello,";
    for (let i = 0; i < names.length; i++) {
        out += " " + names[i];
    }
    return out;
}
class BadGuy {
    constructor(firstName, lastName, crime) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.crime = crime;
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
function greeterDetectPerson(person) {
    if (instanceOfPerson(person)) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }
    return "Hello, not-a-person";
}
function greeterOverload(person) {
    if (typeof person == "object") {
        if (person instanceof Student) {
            return greeterClass(person);
        }
        else if (person instanceof BadGuy) {
            return "Hello, " + person.record;
        }
    }
    else if (typeof person == "string") {
        return greeterString(person);
    }
}
function append(parent, text) {
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
let test1 = [];
test1.firstName = "Array";
test1.lastName = "Person";
append(div, greeterDetectPerson(test1));
append(div, greeterDetectPerson(new Student("Class", "Z", "Austin")));
append(div, greeterOverload("Guy"));
append(div, greeterOverload(new Student("Class", "Z", "Austin")));
append(div, greeterOverload({ fullName: "Class B Johnson", firstName: "Class", middleInitial: "B", lastName: "Johnson" }));
append(div, greeterOverload(new BadGuy("Bad", "Guy", "Killer")));
function runCallback(callback) {
    callback && callback();
}
runCallback();
// allowed with default "strictNullChecks": false
// append(div, greeterString(null));
// append(div, greeterString(undefined));
// append(div, greeterInterface(null));
//   ^ run-time error, null.firstName does not exist
document.body.appendChild(div);
//# sourceMappingURL=greeter.js.map