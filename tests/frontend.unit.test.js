const fs = require("fs");
const path = require("path");
const vm = require("vm");

const codeJsPath = path.resolve(__dirname, "../LAMP Stack/js/code.js");

if (typeof test === "function") {
  test("Frontend Unit Test", () => {
    let cookieStore = "";
    const mockDocument = {
      get cookie() {
        return cookieStore;
      },
      set cookie(val) {
        cookieStore = val;
      }
    };
    const mockWindow = { location: { href: "" } };

    const sandbox = {
      document: mockDocument,
      window: mockWindow,
      Date,
      parseInt
    };

    vm.createContext(sandbox);
    vm.runInContext(
      fs.readFileSync(codeJsPath, "utf8") +
        "\nthis.__setUser = (id, first, last) => { userId = id; firstName = first; lastName = last; };" +
        "\nthis.__getUser = () => ({ userId, firstName, lastName });",
      sandbox
    );

    sandbox.__setUser(7, "John", "Doe");
    sandbox.saveCookie();
    expect(mockDocument.cookie).toContain("firstName=John");
    expect(mockDocument.cookie).toContain("lastName=Doe");
    expect(mockDocument.cookie).toContain("userId=7");

    mockDocument.cookie = "firstName=John,lastName=Doe,userId=7";
    sandbox.__setUser(0, "", "");
    sandbox.readCookie();

    expect(sandbox.__getUser()).toEqual({
      userId: 7,
      firstName: "John",
      lastName: "Doe"
    });
  });
}

class SimpleJestReporter {
  onRunComplete(_, results) {
    for (const suite of results.testResults) {
      for (const t of suite.testResults) {
        const status = t.status === "passed" ? "PASS" : "FAIL";
        console.log(`${t.title}: ${status} (${t.duration} ms)`);
      }
    }
  }
}

module.exports = SimpleJestReporter;
