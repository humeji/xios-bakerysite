function testXSSPrevention() {
  const testPayloads = [
    '<script>alert("XSS")</script>',
    "<img src='x' onerror=alert('XSS')>",
    "<div onclick=alert('XSS')>Click me</div>",
  ];

  testPayloads.forEach((payload, index) => {
    const testDiv = document.createElement('div');
    if (globalThis.safeSetHTML) {
      globalThis.safeSetHTML(testDiv, payload);
    } else {
      const temp = document.createElement('div');
      temp.innerHTML = payload;
      temp.querySelectorAll('script').forEach((s) => s.remove());
      testDiv.replaceChildren(...temp.childNodes);
    }

    const hasScript = testDiv.querySelector('script');
    const hasOnclick = testDiv.querySelector('[onclick]');
    const hasOnerror = testDiv.querySelector('[onerror]');
    console.log(`XSS Test ${index + 1}: ${!hasScript && !hasOnclick && !hasOnerror ? 'PASS' : 'FAIL'}`);
  });
}

globalThis.testXSSPrevention = testXSSPrevention;


