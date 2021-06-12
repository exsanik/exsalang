class Environment {
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
    this.hiddenRecord = {};
  }

  define(name, value) {
    this.record[name] = value;
    return value;
  }

  setHiddenValue(name, value) {
    const parentHidden = this.resolveHidden(name).hiddenRecord;
    parentHidden[name] = value;
    return value;
  }

  getHiddenValue(name) {
    return this.resolveHidden(name).hiddenRecord[name];
  }

  assign(name, value) {
    this.resolve(name).record[name] = value;
    return value;
  }

  lookup(name) {
    return this.resolve(name).record[name];
  }

  resolveHidden(name) {
    if (this.hiddenRecord.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent === null) {
      return this;
    }

    return this.parent.resolveHidden(name);
  }

  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent === null) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }

    return this.parent.resolve(name);
  }
}

export default Environment;
