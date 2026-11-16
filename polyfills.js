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
})();
