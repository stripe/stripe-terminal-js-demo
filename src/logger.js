class Logger {
  static collectors = [];
  static serializer = Promise.resolve;

  static setCollectors(collectors) {
    this.collectors = collectors;
  }

  static async forwardToCollectors(log) {
    this.collectors.forEach(collector => collector.collect(log));
  }

  static log(log) {
    Logger.forwardToCollectors(log);
  }

  static tracedFn(methodName, docsUrl, fn) {
    return async function(...args) {
      let method = methodName || fn.name;
      let requestString = JSON.stringify(args);
      let UUID = Math.floor(Math.random() * 10000000).toString();
      let trace = {
        id: UUID,
        start_time_ms: new Date().valueOf(),
        method: method,
        docsUrl: docsUrl,
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

  static watchObject(obj, objName, methodsMetadata) {
    let objProtoype = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(objProtoype)
      .filter(property => methodsMetadata[property] !== undefined)
      .forEach(instanceMethodName => {
        obj[instanceMethodName] = Logger.tracedFn(
          objName + "." + instanceMethodName,
          methodsMetadata[instanceMethodName].docsUrl,
          objProtoype[instanceMethodName]
        );
      });
  }
}

export default Logger;
