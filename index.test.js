import { describe, it, expect } from "vitest";

describe("TextEncoder return", () => {
  it("returns an Uint8Array", () => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode("Hello, world!");
    expect(encoded).toBeInstanceOf(Uint8Array);
  });
});
