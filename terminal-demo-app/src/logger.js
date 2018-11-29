class Logger {
  static collectors = [];

  static setCollectors(collectors) {
    this.collectors = collectors;
  }

  static forwardToCollectors(log) {
    this.collectors.forEach(collector => collector.collect(log));
  }

  static log(log) {
    Logger.forwardToCollectors(log);
  }

  static tracedFn(methodName, fn) {
    return async function(...args) {
      let method = methodName || fn.name;
      let requestString = JSON.stringify(args);
      let trace = {
        start_time_ms: new Date().valueOf(),
        method: method,
        request: requestString,
        response: null,
        exception: null
      };

      try {
        let response = await fn.apply(this, args);
        trace.response = JSON.stringify(response);
        return response;
      } catch (e) {
        trace.exception = e.message;
        throw e;
      } finally {
        Logger.log(trace);
      }
    };
  }

  static watchObject(obj, name, methods) {
    let methodSet = new Set(methods);
    let objProtoype = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(objProtoype)
      .filter(property => methodSet.has(property))
      .forEach(instanceMethodName => {
        obj[instanceMethodName] = Logger.tracedFn(
          name + "." + instanceMethodName,
          objProtoype[instanceMethodName]
        );
      });
  }
}

export default Logger;
