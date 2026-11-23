const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const codeJsPath = path.resolve(__dirname, "../LAMP Stack/js/code.js");

function createLampApiService() {
  const users = [
    { id: 1, firstName: "John", lastName: "Doe", login: "jdoe", password: "securepass123" }
  ];
  const colors = [{ userId: 1, name: "Blue" }];

  return {
    handleRequest(method, url, rawBody) {
      const inData = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

      if (method === "POST" && url.endsWith("/Login.php")) {
        const user = users.find(
          (u) => u.login === inData.login && u.password === inData.password
        );
        return user
          ? { status: 200, body: { id: user.id, firstName: user.firstName, lastName: user.lastName, error: "" } }
          : { status: 200, body: { id: 0, firstName: "", lastName: "", error: "No Records Found" } };
      }

      if (method === "POST" && url.endsWith("/AddColor.php")) {
        colors.push({ userId: Number(inData.userId), name: String(inData.color || "") });
        return { status: 200, body: { error: "" } };
      }

      if (method === "POST" && url.endsWith("/SearchColors.php")) {
        const query = String(inData.search || "").toLowerCase();
        const matches = colors
          .filter((c) => c.userId === Number(inData.userId) && c.name.toLowerCase().includes(query))
          .map((c) => c.name);

        return matches.length > 0
          ? { status: 200, body: { results: matches, error: "" } }
          : { status: 200, body: { id: 0, firstName: "", lastName: "", error: "No Records Found" } };
      }

      return { status: 404, body: { error: "Not Found" } };
    }
  };
}

if (require.main === module) {
  test("API Integration Test", () => {
    const api = createLampApiService();

    const elements = {
      loginName: { value: "jdoe", innerHTML: "" },
      loginPassword: { value: "securepass123", innerHTML: "" },
      loginResult: { value: "", innerHTML: "" },
      colorText: { value: "Turquoise", innerHTML: "" },
      colorAddResult: { value: "", innerHTML: "" },
      searchText: { value: "Turq", innerHTML: "" },
      colorSearchResult: { value: "", innerHTML: "" },
      colorList: { value: "", innerHTML: "" }
    };

    const mockDocument = {
      cookie: "",
      getElementById: (id) => elements[id],
      getElementsByTagName: (tag) => (tag === "p" ? [elements.colorList] : [])
    };
    const mockWindow = { location: { href: "" } };

    class IntegratedXMLHttpRequest {
      open(method, url) {
        this.method = method;
        this.url = url;
      }
      setRequestHeader() {}
      send(payload) {
        const response = api.handleRequest(this.method, this.url, payload);
        this.readyState = 4;
        this.status = response.status;
        this.responseText = JSON.stringify(response.body);
        if (this.onreadystatechange) {
          this.onreadystatechange();
        }
      }
    }

    const sandbox = {
      document: mockDocument,
      window: mockWindow,
      XMLHttpRequest: IntegratedXMLHttpRequest,
      Date,
      JSON,
      parseInt
    };

    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(codeJsPath, "utf8"), sandbox);

    // 1. Login API call
    sandbox.doLogin();
    assert.equal(mockWindow.location.href, "color.html");

    // 2. AddColor API call
    sandbox.addColor();
    assert.equal(elements.colorAddResult.innerHTML, "Color has been added");

    // 3. SearchColors API call
    sandbox.searchColor();
    assert.equal(elements.colorSearchResult.innerHTML, "Color(s) has been retrieved");
    assert.equal(elements.colorList.innerHTML, "Turquoise");
  });
}

module.exports = async function* simpleNodeReporter(source) {
  for await (const event of source) {
    if (event.type === "test:pass" && event.data.nesting === 0) {
      yield `${event.data.name}: PASS (${event.data.details.duration_ms.toFixed(2)} ms)\n`;
    } else if (event.type === "test:fail" && event.data.nesting === 0) {
      yield `${event.data.name}: FAIL (${event.data.details.duration_ms.toFixed(2)} ms)\n`;
    }
  }
};
