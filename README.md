# Vitest + JSDOM TextEncoder bug

This repo is meant to reproduce a global object pollution while defining JSDOM as environment.

## Repro

1. clone this repo
1. install the dependencies `npm install`
1. run the test command `npm run test`
1. Everything will work because we haven't enabled JSDOM yet
1. Now, open `vitest.config.js`
1. enable `environment: "json"`
1. run the test script again
1. see the error

```text
 FAIL  index.test.js > TextEncoder return > returns an Uint8Array
AssertionError: expected Uint8Array[ 72, 101, 108, 108, …(-97) ] to be an instance of Uint8Array
 ❯ index.test.js:7:21
      5|     const encoder = new TextEncoder();
      6|     const encoded = encoder.encode("Hello, world!");
      7|     expect(encoded).toBeInstanceOf(Uint8Array);
       |                     ^
      8|   });
      9| });
```

## Repro in isolation

While trying to understand the problem, I got the necessary parts of vitest jsdom-environment code and isolate away from vitest.

> Check the `local-repro-vitest-jsdom-setup.js` file.

The problem is being caused by the `populateGlobal` function, which does some crazy stuff to the list of global APIs, including the `Uint8Array`.

If you comment out the `Uint8Array`, and run the code, you'll see no problem.

```bash
npm run test:vitest-setup
```
