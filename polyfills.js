(function () {
  "use strict";

  if (typeof Promise.withResolvers !== "function") {
    Promise.withResolvers = function () {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }

  if (typeof Array.prototype.findLast !== "function") {
    Array.prototype.findLast = function (predicate, thisArg) {
      for (let index = this.length - 1; index >= 0; index -= 1) {
        if (predicate.call(thisArg, this[index], index, this)) {
          return this[index];
        }
      }
      return undefined;
    };
  }

  if (typeof Array.prototype.findLastIndex !== "function") {
    Array.prototype.findLastIndex = function (predicate, thisArg) {
      for (let index = this.length - 1; index >= 0; index -= 1) {
        if (predicate.call(thisArg, this[index], index, this)) {
          return index;
        }
      }
      return -1;
    };
  }

  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
  }

  if (typeof Map.prototype.getOrInsert !== "function") {
    Map.prototype.getOrInsert = function (key, value) {
      if (this.has(key)) {
        return this.get(key);
      }
      this.set(key, value);
      return value;
    };
  }

  if (typeof Map.prototype.getOrInsertComputed !== "function") {
    Map.prototype.getOrInsertComputed = function (key, compute) {
      if (this.has(key)) {
        return this.get(key);
      }
      const value = compute(key, this);
      this.set(key, value);
      return value;
    };
  }

  if (typeof Promise.try !== "function") {
    Promise.try = function (callback, ...args) {
      return new Promise((resolve) => resolve(callback(...args)));
    };
  }

  if (typeof URL.parse !== "function") {
    URL.parse = function (url, base) {
      try {
        return base === undefined ? new URL(url) : new URL(url, base);
      } catch {
        return null;
      }
    };
  }

  if (typeof URL.canParse !== "function") {
    URL.canParse = function (url, base) {
      return URL.parse(url, base) !== null;
    };
  }

  if (typeof Uint8Array.prototype.toBase64 !== "function") {
    Uint8Array.prototype.toBase64 = function () {
      const chunkSize = 0x8000;
      let binary = "";
      for (let offset = 0; offset < this.length; offset += chunkSize) {
        binary += String.fromCharCode.apply(
          null,
          this.subarray(offset, offset + chunkSize)
        );
      }
      return btoa(binary);
    };
  }

  if (typeof Uint8Array.fromBase64 !== "function") {
    Uint8Array.fromBase64 = function (value) {
      const binary = atob(String(value).replace(/\s+/g, ""));
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes;
    };
  }
})();
