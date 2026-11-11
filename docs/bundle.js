(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/@firebase/util/dist/postinstall.mjs
  var getDefaultsFromPostinstall;
  var init_postinstall = __esm({
    "node_modules/@firebase/util/dist/postinstall.mjs"() {
      getDefaultsFromPostinstall = () => void 0;
    }
  });

  // node_modules/@firebase/util/dist/index.esm.js
  function deepCopy(value) {
    return deepExtend(void 0, value);
  }
  function deepExtend(target, source) {
    if (!(source instanceof Object)) {
      return source;
    }
    switch (source.constructor) {
      case Date:
        const dateValue = source;
        return new Date(dateValue.getTime());
      case Object:
        if (target === void 0) {
          target = {};
        }
        break;
      case Array:
        target = [];
        break;
      default:
        return source;
    }
    for (const prop in source) {
      if (!source.hasOwnProperty(prop) || !isValidKey(prop)) {
        continue;
      }
      target[prop] = deepExtend(target[prop], source[prop]);
    }
    return target;
  }
  function isValidKey(key) {
    return key !== "__proto__";
  }
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          reject(request.error?.message || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function replaceTemplate(template, data) {
    try {
      let ptr = 0;
      let result = "";
      while (ptr < template.length) {
        const start = template.indexOf("{$", ptr);
        if (start === -1) {
          result += template.substring(ptr);
          break;
        }
        const end = template.indexOf("}", start + 2);
        if (end === -1) {
          result += template.substring(ptr);
          break;
        }
        const key = template.substring(start + 2, end);
        const value = data[key];
        result += template.substring(ptr, start) + (value != null ? String(value) : `<${key}?>`);
        ptr = end + 1;
      }
      return result;
    } catch (e) {
      return template;
    }
  }
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
      if (!bKeys.includes(k)) {
        return false;
      }
      const aProp = a[k];
      const bProp = b[k];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k of bKeys) {
      if (!aKeys.includes(k)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }
  var stringToByteArray$1, byteArrayToString, base64, DecodeBase64StringError, base64Encode, base64urlEncodeWithoutPadding, base64Decode, getDefaultsFromGlobal, getDefaultsFromEnvVariable, getDefaultsFromCookie, getDefaults, getDefaultAppConfig, Deferred, ERROR_NAME, FirebaseError, ErrorFactory, MAX_VALUE_MILLIS;
  var init_index_esm = __esm({
    "node_modules/@firebase/util/dist/index.esm.js"() {
      init_postinstall();
      stringToByteArray$1 = function(str) {
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c < 128) {
            out[p++] = c;
          } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
          } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          }
        }
        return out;
      };
      byteArrayToString = function(bytes) {
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
          const c1 = bytes[pos++];
          if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
          } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
          } else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
          } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          }
        }
        return out.join("");
      };
      base64 = {
        /**
         * Maps bytes to characters.
         */
        byteToCharMap_: null,
        /**
         * Maps characters to bytes.
         */
        charToByteMap_: null,
        /**
         * Maps bytes to websafe characters.
         * @private
         */
        byteToCharMapWebSafe_: null,
        /**
         * Maps websafe characters to bytes.
         * @private
         */
        charToByteMapWebSafe_: null,
        /**
         * Our default alphabet, shared between
         * ENCODED_VALS and ENCODED_VALS_WEBSAFE
         */
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        /**
         * Our default alphabet. Value 64 (=) is special; it means "nothing."
         */
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/=";
        },
        /**
         * Our websafe alphabet.
         */
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_.";
        },
        /**
         * Whether this browser supports the atob and btoa functions. This extension
         * started at Mozilla but is now implemented by many browsers. We use the
         * ASSUME_* variables to avoid pulling in the full useragent detection library
         * but still allowing the standard per-browser compilations.
         *
         */
        HAS_NATIVE_SUPPORT: typeof atob === "function",
        /**
         * Base64-encode an array of bytes.
         *
         * @param input An array of bytes (numbers with
         *     value in [0, 255]) to encode.
         * @param webSafe Boolean indicating we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeByteArray(input, webSafe) {
          if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
          }
          this.init_();
          const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
          const output = [];
          for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
              outByte4 = 64;
              if (!haveByte2) {
                outByte3 = 64;
              }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
          }
          return output.join("");
        },
        /**
         * Base64-encode a string.
         *
         * @param input A string to encode.
         * @param webSafe If true, we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
          }
          return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        /**
         * Base64-decode a string.
         *
         * @param input to decode.
         * @param webSafe True if we should use the
         *     alternative alphabet.
         * @return string representing the decoded value.
         */
        decodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
          }
          return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        /**
         * Base64-decode a string.
         *
         * In base-64 decoding, groups of four characters are converted into three
         * bytes.  If the encoder did not apply padding, the input length may not
         * be a multiple of 4.
         *
         * In this case, the last group will have fewer than 4 characters, and
         * padding will be inferred.  If the group has one or two characters, it decodes
         * to one byte.  If the group has three characters, it decodes to two bytes.
         *
         * @param input Input to decode.
         * @param webSafe True if we should use the web-safe alphabet.
         * @return bytes representing the decoded value.
         */
        decodeStringToByteArray(input, webSafe) {
          this.init_();
          const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
          const output = [];
          for (let i = 0; i < input.length; ) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
              throw new DecodeBase64StringError();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
              const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
              output.push(outByte2);
              if (byte4 !== 64) {
                const outByte3 = byte3 << 6 & 192 | byte4;
                output.push(outByte3);
              }
            }
          }
          return output;
        },
        /**
         * Lazy static initialization function. Called before
         * accessing any of the static map variables.
         * @private
         */
        init_() {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
              this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
              this.charToByteMap_[this.byteToCharMap_[i]] = i;
              this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
              this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
              if (i >= this.ENCODED_VALS_BASE.length) {
                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
              }
            }
          }
        }
      };
      DecodeBase64StringError = class extends Error {
        constructor() {
          super(...arguments);
          this.name = "DecodeBase64StringError";
        }
      };
      base64Encode = function(str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
      };
      base64urlEncodeWithoutPadding = function(str) {
        return base64Encode(str).replace(/\./g, "");
      };
      base64Decode = function(str) {
        try {
          return base64.decodeString(str, true);
        } catch (e) {
          console.error("base64Decode failed: ", e);
        }
        return null;
      };
      getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
      getDefaultsFromEnvVariable = () => {
        if (typeof process === "undefined" || typeof process.env === "undefined") {
          return;
        }
        const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
        if (defaultsJsonString) {
          return JSON.parse(defaultsJsonString);
        }
      };
      getDefaultsFromCookie = () => {
        if (typeof document === "undefined") {
          return;
        }
        let match;
        try {
          match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        } catch (e) {
          return;
        }
        const decoded = match && base64Decode(match[1]);
        return decoded && JSON.parse(decoded);
      };
      getDefaults = () => {
        try {
          return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
        } catch (e) {
          console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
          return;
        }
      };
      getDefaultAppConfig = () => getDefaults()?.config;
      Deferred = class {
        constructor() {
          this.reject = () => {
          };
          this.resolve = () => {
          };
          this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
          });
        }
        /**
         * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        wrapCallback(callback) {
          return (error, value) => {
            if (error) {
              this.reject(error);
            } else {
              this.resolve(value);
            }
            if (typeof callback === "function") {
              this.promise.catch(() => {
              });
              if (callback.length === 1) {
                callback(error);
              } else {
                callback(error, value);
              }
            }
          };
        }
      };
      ERROR_NAME = "FirebaseError";
      FirebaseError = class _FirebaseError extends Error {
        constructor(code, message, customData) {
          super(message);
          this.code = code;
          this.customData = customData;
          this.name = ERROR_NAME;
          Object.setPrototypeOf(this, _FirebaseError.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
          }
        }
      };
      ErrorFactory = class {
        constructor(service, serviceName, errors) {
          this.service = service;
          this.serviceName = serviceName;
          this.errors = errors;
        }
        create(code, ...data) {
          const customData = data[0] || {};
          const fullCode = `${this.service}/${code}`;
          const template = this.errors[code];
          const message = template ? replaceTemplate(template, customData) : "Error";
          const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
          const error = new FirebaseError(fullCode, fullMessage, customData);
          return error;
        }
      };
      MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
    }
  });

  // node_modules/@firebase/component/dist/esm/index.esm.js
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var Component, DEFAULT_ENTRY_NAME, Provider, ComponentContainer;
  var init_index_esm2 = __esm({
    "node_modules/@firebase/component/dist/esm/index.esm.js"() {
      init_index_esm();
      Component = class {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name5, instanceFactory, type) {
          this.name = name5;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          this.serviceProps = {};
          this.instantiationMode = "LAZY";
          this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }
        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }
        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }
        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }
      };
      DEFAULT_ENTRY_NAME = "[DEFAULT]";
      Provider = class {
        constructor(name5, container) {
          this.name = name5;
          this.container = container;
          this.component = null;
          this.instances = /* @__PURE__ */ new Map();
          this.instancesDeferred = /* @__PURE__ */ new Map();
          this.instancesOptions = /* @__PURE__ */ new Map();
          this.onInitCallbacks = /* @__PURE__ */ new Map();
        }
        /**
         * @param identifier A provider can provide multiple instances of a service
         * if this.component.multipleInstances is true.
         */
        get(identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
              try {
                const instance = this.getOrInitializeService({
                  instanceIdentifier: normalizedIdentifier
                });
                if (instance) {
                  deferred.resolve(instance);
                }
              } catch (e) {
              }
            }
          }
          return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
          const optional = options?.optional ?? false;
          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              return this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
            } catch (e) {
              if (optional) {
                return null;
              } else {
                throw e;
              }
            }
          } else {
            if (optional) {
              return null;
            } else {
              throw Error(`Service ${this.name} is not available`);
            }
          }
        }
        getComponent() {
          return this.component;
        }
        setComponent(component) {
          if (component.name !== this.name) {
            throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
          }
          if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
          }
          this.component = component;
          if (!this.shouldAutoInitialize()) {
            return;
          }
          if (isComponentEager(component)) {
            try {
              this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
            } catch (e) {
            }
          }
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
              const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              instanceDeferred.resolve(instance);
            } catch (e) {
            }
          }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME) {
          this.instancesDeferred.delete(identifier);
          this.instancesOptions.delete(identifier);
          this.instances.delete(identifier);
        }
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        async delete() {
          const services = Array.from(this.instances.values());
          await Promise.all([
            ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
            ...services.filter((service) => "_delete" in service).map((service) => service._delete())
          ]);
        }
        isComponentSet() {
          return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME) {
          return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME) {
          return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
          const { options = {} } = opts;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
          if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
          }
          if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
          }
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
          });
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
              instanceDeferred.resolve(instance);
            }
          }
          return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */
        onInit(callback, identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
          existingCallbacks.add(callback);
          this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
          const existingInstance = this.instances.get(normalizedIdentifier);
          if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
          }
          return () => {
            existingCallbacks.delete(callback);
          };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */
        invokeOnInitCallbacks(instance, identifier) {
          const callbacks = this.onInitCallbacks.get(identifier);
          if (!callbacks) {
            return;
          }
          for (const callback of callbacks) {
            try {
              callback(instance, identifier);
            } catch {
            }
          }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
          let instance = this.instances.get(instanceIdentifier);
          if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
              instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
              options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            if (this.component.onInstanceCreated) {
              try {
                this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
              } catch {
              }
            }
          }
          return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
          if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
          } else {
            return identifier;
          }
        }
        shouldAutoInitialize() {
          return !!this.component && this.component.instantiationMode !== "EXPLICIT";
        }
      };
      ComponentContainer = class {
        constructor(name5) {
          this.name = name5;
          this.providers = /* @__PURE__ */ new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        addComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
          }
          provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            this.providers.delete(component.name);
          }
          this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        getProvider(name5) {
          if (this.providers.has(name5)) {
            return this.providers.get(name5);
          }
          const provider = new Provider(name5, this);
          this.providers.set(name5, provider);
          return provider;
        }
        getProviders() {
          return Array.from(this.providers.values());
        }
      };
    }
  });

  // node_modules/@firebase/logger/dist/esm/index.esm.js
  var instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler, Logger;
  var init_index_esm3 = __esm({
    "node_modules/@firebase/logger/dist/esm/index.esm.js"() {
      instances = [];
      (function(LogLevel2) {
        LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
        LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
        LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
        LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
        LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
        LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
      })(LogLevel || (LogLevel = {}));
      levelStringToEnum = {
        "debug": LogLevel.DEBUG,
        "verbose": LogLevel.VERBOSE,
        "info": LogLevel.INFO,
        "warn": LogLevel.WARN,
        "error": LogLevel.ERROR,
        "silent": LogLevel.SILENT
      };
      defaultLogLevel = LogLevel.INFO;
      ConsoleMethod = {
        [LogLevel.DEBUG]: "log",
        [LogLevel.VERBOSE]: "log",
        [LogLevel.INFO]: "info",
        [LogLevel.WARN]: "warn",
        [LogLevel.ERROR]: "error"
      };
      defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
          return;
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
          console[method](`[${now}]  ${instance.name}:`, ...args);
        } else {
          throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
      };
      Logger = class {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name5) {
          this.name = name5;
          this._logLevel = defaultLogLevel;
          this._logHandler = defaultLogHandler;
          this._userLogHandler = null;
          instances.push(this);
        }
        get logLevel() {
          return this._logLevel;
        }
        set logLevel(val) {
          if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
          }
          this._logLevel = val;
        }
        // Workaround for setter/getter having to be the same type.
        setLogLevel(val) {
          this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
        }
        get logHandler() {
          return this._logHandler;
        }
        set logHandler(val) {
          if (typeof val !== "function") {
            throw new TypeError("Value assigned to `logHandler` must be a function");
          }
          this._logHandler = val;
        }
        get userLogHandler() {
          return this._userLogHandler;
        }
        set userLogHandler(val) {
          this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */
        debug(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
          this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
          this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
          this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
          this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
          this._logHandler(this, LogLevel.ERROR, ...args);
        }
      };
    }
  });

  // node_modules/idb/build/wrap-idb-value.js
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var instanceOfAny, idbProxyableTypes, cursorAdvanceMethods, cursorRequestMap, transactionDoneMap, transactionStoreNamesMap, transformCache, reverseTransformCache, idbProxyTraps, unwrap;
  var init_wrap_idb_value = __esm({
    "node_modules/idb/build/wrap-idb-value.js"() {
      instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
      cursorRequestMap = /* @__PURE__ */ new WeakMap();
      transactionDoneMap = /* @__PURE__ */ new WeakMap();
      transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
      transformCache = /* @__PURE__ */ new WeakMap();
      reverseTransformCache = /* @__PURE__ */ new WeakMap();
      idbProxyTraps = {
        get(target, prop, receiver) {
          if (target instanceof IDBTransaction) {
            if (prop === "done")
              return transactionDoneMap.get(target);
            if (prop === "objectStoreNames") {
              return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            if (prop === "store") {
              return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
            }
          }
          return wrap(target[prop]);
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        },
        has(target, prop) {
          if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
            return true;
          }
          return prop in target;
        }
      };
      unwrap = (value) => reverseTransformCache.get(value);
    }
  });

  // node_modules/idb/build/index.js
  function openDB(name5, version4, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name5, version4);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  var readMethods, writeMethods, cachedMethods;
  var init_build = __esm({
    "node_modules/idb/build/index.js"() {
      init_wrap_idb_value();
      init_wrap_idb_value();
      readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
      writeMethods = ["put", "add", "delete", "clear"];
      cachedMethods = /* @__PURE__ */ new Map();
      replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
      }));
    }
  });

  // node_modules/@firebase/app/dist/esm/index.esm.js
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return component?.type === "VERSION";
  }
  function _addComponent(app, component) {
    try {
      app.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app of _apps.values()) {
      _addComponent(app, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app, name5) {
    const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name5);
  }
  function _isFirebaseServerApp(obj) {
    if (obj === null || obj === void 0) {
      return false;
    }
    return obj.settings !== void 0;
  }
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name6 = rawConfig;
      rawConfig = { name: name6 };
    }
    const config = {
      name: DEFAULT_ENTRY_NAME2,
      automaticDataCollectionEnabled: true,
      ...rawConfig
    };
    const name5 = config.name;
    if (typeof name5 !== "string" || !name5) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name5)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name5);
    if (existingApp) {
      if (!deepEqual(options, existingApp.options)) {
        throw ERROR_FACTORY.create("duplicate-app", {
          appName: name5,
          mismatchedParam: "options",
          oldValue: JSON.stringify(existingApp.options),
          newValue: JSON.stringify(options)
        });
      } else if (!deepEqual(config, existingApp.config)) {
        throw ERROR_FACTORY.create("duplicate-app", {
          appName: name5,
          mismatchedParam: "config",
          oldValue: JSON.stringify(existingApp.config),
          newValue: JSON.stringify(config)
        });
      } else {
        return existingApp;
      }
    }
    const container = new ComponentContainer(name5);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name5, newApp);
    return newApp;
  }
  function getApp(name5 = DEFAULT_ENTRY_NAME2) {
    const app = _apps.get(name5);
    if (!app && name5 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app) {
      throw ERROR_FACTORY.create("no-app", { appName: name5 });
    }
    return app;
  }
  function registerVersion(libraryKeyOrName, version4, variant) {
    let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version4.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version4}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version4}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version4 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e) {
                console.warn(e);
              }
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
      await tx.done;
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app));
      await tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app) {
    return `${app.name}!${app.options.appId}`;
  }
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function getEarliestHeartbeatIdx(heartbeats) {
    if (heartbeats.length === 0) {
      return -1;
    }
    let earliestHeartbeatIdx = 0;
    let earliestHeartbeatDate = heartbeats[0].date;
    for (let i = 1; i < heartbeats.length; i++) {
      if (heartbeats[i].date < earliestHeartbeatDate) {
        earliestHeartbeatDate = heartbeats[i].date;
        earliestHeartbeatIdx = i;
      }
    }
    return earliestHeartbeatIdx;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$r, version$1, variant);
    registerVersion(name$r, version$1, "esm2020");
    registerVersion("fire-js", "");
  }
  var PlatformLoggerServiceImpl, name$r, version$1, logger, name$q, name$p, name$o, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, DEFAULT_ENTRY_NAME2, PLATFORM_LOG_STRING, _apps, _serverApps, _components, ERRORS, ERROR_FACTORY, FirebaseAppImpl, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, MAX_NUM_STORED_HEARTBEATS, HeartbeatServiceImpl, HeartbeatStorageImpl;
  var init_index_esm4 = __esm({
    "node_modules/@firebase/app/dist/esm/index.esm.js"() {
      init_index_esm2();
      init_index_esm3();
      init_index_esm();
      init_index_esm();
      init_build();
      PlatformLoggerServiceImpl = class {
        constructor(container) {
          this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        getPlatformInfoString() {
          const providers = this.container.getProviders();
          return providers.map((provider) => {
            if (isVersionServiceProvider(provider)) {
              const service = provider.getImmediate();
              return `${service.library}/${service.version}`;
            } else {
              return null;
            }
          }).filter((logString) => logString).join(" ");
        }
      };
      name$r = "@firebase/app";
      version$1 = "0.16.5";
      logger = new Logger("@firebase/app");
      name$q = "@firebase/app-compat";
      name$p = "@firebase/analytics-compat";
      name$o = "@firebase/analytics";
      name$n = "@firebase/app-check-compat";
      name$m = "@firebase/app-check";
      name$l = "@firebase/auth";
      name$k = "@firebase/auth-compat";
      name$j = "@firebase/crashlytics";
      name$i = "@firebase/database";
      name$h = "@firebase/data-connect";
      name$g = "@firebase/database-compat";
      name$f = "@firebase/functions";
      name$e = "@firebase/functions-compat";
      name$d = "@firebase/installations";
      name$c = "@firebase/installations-compat";
      name$b = "@firebase/messaging";
      name$a = "@firebase/messaging-compat";
      name$9 = "@firebase/performance";
      name$8 = "@firebase/performance-compat";
      name$7 = "@firebase/remote-config";
      name$6 = "@firebase/remote-config-compat";
      name$5 = "@firebase/storage";
      name$4 = "@firebase/storage-compat";
      name$3 = "@firebase/firestore";
      name$2 = "@firebase/ai";
      name$1 = "@firebase/firestore-compat";
      name = "firebase";
      DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
      PLATFORM_LOG_STRING = {
        [name$r]: "fire-core",
        [name$q]: "fire-core-compat",
        [name$o]: "fire-analytics",
        [name$p]: "fire-analytics-compat",
        [name$m]: "fire-app-check",
        [name$n]: "fire-app-check-compat",
        [name$l]: "fire-auth",
        [name$k]: "fire-auth-compat",
        [name$j]: "fire-cls",
        [name$i]: "fire-rtdb",
        [name$h]: "fire-data-connect",
        [name$g]: "fire-rtdb-compat",
        [name$f]: "fire-fn",
        [name$e]: "fire-fn-compat",
        [name$d]: "fire-iid",
        [name$c]: "fire-iid-compat",
        [name$b]: "fire-fcm",
        [name$a]: "fire-fcm-compat",
        [name$9]: "fire-perf",
        [name$8]: "fire-perf-compat",
        [name$7]: "fire-rc",
        [name$6]: "fire-rc-compat",
        [name$5]: "fire-gcs",
        [name$4]: "fire-gcs-compat",
        [name$3]: "fire-fst",
        [name$1]: "fire-fst-compat",
        [name$2]: "fire-vertex",
        "fire-js": "fire-js",
        // Platform identifier for JS SDK.
        [name]: "fire-js-all"
      };
      _apps = /* @__PURE__ */ new Map();
      _serverApps = /* @__PURE__ */ new Map();
      _components = /* @__PURE__ */ new Map();
      ERRORS = {
        [
          "no-app"
          /* AppError.NO_APP */
        ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
        [
          "bad-app-name"
          /* AppError.BAD_APP_NAME */
        ]: "Illegal App name: '{$appName}'",
        [
          "duplicate-app"
          /* AppError.DUPLICATE_APP */
        ]: "Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.",
        [
          "app-deleted"
          /* AppError.APP_DELETED */
        ]: "Firebase App named '{$appName}' already deleted",
        [
          "server-app-deleted"
          /* AppError.SERVER_APP_DELETED */
        ]: "Firebase Server App has been deleted",
        [
          "no-options"
          /* AppError.NO_OPTIONS */
        ]: "Need to provide options, when not being deployed to hosting via source.",
        [
          "invalid-app-argument"
          /* AppError.INVALID_APP_ARGUMENT */
        ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        [
          "invalid-log-argument"
          /* AppError.INVALID_LOG_ARGUMENT */
        ]: "First argument to `onLog` must be null or a function.",
        [
          "idb-open"
          /* AppError.IDB_OPEN */
        ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-get"
          /* AppError.IDB_GET */
        ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-set"
          /* AppError.IDB_WRITE */
        ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-delete"
          /* AppError.IDB_DELETE */
        ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "finalization-registry-not-supported"
          /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
        ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
        [
          "invalid-server-app-environment"
          /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
        ]: "FirebaseServerApp is not for use in browser environments."
      };
      ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
      FirebaseAppImpl = class {
        constructor(options, config, container) {
          this._isDeleted = false;
          this._options = { ...options };
          this._config = { ...config };
          this._name = config.name;
          this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
          this._container = container;
          this.container.addComponent(new Component(
            "app",
            () => this,
            "PUBLIC"
            /* ComponentType.PUBLIC */
          ));
        }
        get automaticDataCollectionEnabled() {
          this.checkDestroyed();
          return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
          this.checkDestroyed();
          this._automaticDataCollectionEnabled = val;
        }
        get name() {
          this.checkDestroyed();
          return this._name;
        }
        get options() {
          this.checkDestroyed();
          return this._options;
        }
        get config() {
          this.checkDestroyed();
          return this._config;
        }
        get container() {
          return this._container;
        }
        get isDeleted() {
          return this._isDeleted;
        }
        set isDeleted(val) {
          this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
          }
        }
      };
      DB_NAME = "firebase-heartbeat-database";
      DB_VERSION = 1;
      STORE_NAME = "firebase-heartbeat-store";
      dbPromise = null;
      MAX_HEADER_BYTES = 1024;
      MAX_NUM_STORED_HEARTBEATS = 30;
      HeartbeatServiceImpl = class {
        constructor(container) {
          this.container = container;
          this._heartbeatsCache = null;
          const app = this.container.getProvider("app").getImmediate();
          this._storage = new HeartbeatStorageImpl(app);
          this._heartbeatsCachePromise = this._storage.read().then((result) => {
            this._heartbeatsCache = result;
            return result;
          });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */
        async triggerHeartbeat() {
          try {
            const platformLogger = this.container.getProvider("platform-logger").getImmediate();
            const agent = platformLogger.getPlatformInfoString();
            const date = getUTCDateString();
            if (this._heartbeatsCache?.heartbeats == null) {
              this._heartbeatsCache = await this._heartbeatsCachePromise;
              if (this._heartbeatsCache?.heartbeats == null) {
                return;
              }
            }
            if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
              return;
            } else {
              this._heartbeatsCache.heartbeats.push({ date, agent });
              if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
                const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
                this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
              }
            }
            return this._storage.overwrite(this._heartbeatsCache);
          } catch (e) {
            logger.warn(e);
          }
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */
        async getHeartbeatsHeader() {
          try {
            if (this._heartbeatsCache === null) {
              await this._heartbeatsCachePromise;
            }
            if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) {
              return "";
            }
            const date = getUTCDateString();
            const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
            const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
            this._heartbeatsCache.lastSentHeartbeatDate = date;
            if (unsentEntries.length > 0) {
              this._heartbeatsCache.heartbeats = unsentEntries;
              await this._storage.overwrite(this._heartbeatsCache);
            } else {
              this._heartbeatsCache.heartbeats = [];
              void this._storage.overwrite(this._heartbeatsCache);
            }
            return headerString;
          } catch (e) {
            logger.warn(e);
            return "";
          }
        }
      };
      HeartbeatStorageImpl = class {
        constructor(app) {
          this.app = app;
          this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
          if (!isIndexedDBAvailable()) {
            return false;
          } else {
            return validateIndexedDBOpenable().then(() => true).catch(() => false);
          }
        }
        /**
         * Read all heartbeats.
         */
        async read() {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return { heartbeats: [] };
          } else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            if (idbHeartbeatObject?.heartbeats) {
              return idbHeartbeatObject;
            } else {
              return { heartbeats: [] };
            }
          }
        }
        // overwrite the storage with the provided heartbeats
        async overwrite(heartbeatsObject) {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: heartbeatsObject.heartbeats
            });
          }
        }
        // add heartbeats
        async add(heartbeatsObject) {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: [
                ...existingHeartbeatsObject.heartbeats,
                ...heartbeatsObject.heartbeats
              ]
            });
          }
        }
      };
      registerCoreComponents("");
    }
  });

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2, version;
  var init_index_esm5 = __esm({
    "node_modules/firebase/app/dist/esm/index.esm.js"() {
      init_index_esm4();
      init_index_esm4();
      name2 = "firebase";
      version = "13.2.0";
      registerVersion(name2, version, "app");
    }
  });

  // node_modules/@firebase/ai/dist/esm/index.esm.js
  function encodeInstanceIdentifier(backend) {
    if (backend instanceof GoogleAIBackend) {
      return `${AI_TYPE}/googleai`;
    } else if (backend instanceof AgentPlatformBackend) {
      return `${AI_TYPE}/agentplatform/${backend.location}`;
    } else {
      throw new AIError(AIErrorCode.ERROR, `Invalid backend: ${JSON.stringify(backend.backendType)}`);
    }
  }
  function decodeInstanceIdentifier(instanceIdentifier) {
    const identifierParts = instanceIdentifier.split("/");
    if (identifierParts[0] !== AI_TYPE) {
      throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier, unknown prefix '${identifierParts[0]}'`);
    }
    const backendType = identifierParts[1];
    switch (backendType) {
      case "agentplatform":
        const location = identifierParts[2];
        if (!location) {
          throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier, unknown location '${instanceIdentifier}'`);
        }
        return new AgentPlatformBackend(location);
      case "googleai":
        return new GoogleAIBackend();
      default:
        throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier string: '${instanceIdentifier}'`);
    }
  }
  function chromeAdapterFactory(mode, window2, params) {
    const globalObj = window2 || getGlobal();
    const languageModel = globalObj.LanguageModel;
    if (languageModel && mode) {
      return new ChromeAdapterImpl(languageModel, mode, params);
    }
  }
  function factory(container, { instanceIdentifier }) {
    if (!instanceIdentifier) {
      throw new AIError(AIErrorCode.ERROR, "AIService instance identifier is undefined.");
    }
    const backend = decodeInstanceIdentifier(instanceIdentifier);
    const app = container.getProvider("app").getImmediate();
    const auth = container.getProvider("auth-internal");
    const appCheckProvider = container.getProvider("app-check-internal");
    return new AIService(app, backend, auth, appCheckProvider, chromeAdapterFactory);
  }
  function initApiSettings(ai) {
    if (!ai.app?.options?.apiKey) {
      throw new AIError(AIErrorCode.NO_API_KEY, `The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.`);
    } else if (!ai.app?.options?.projectId) {
      throw new AIError(AIErrorCode.NO_PROJECT_ID, `The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.`);
    } else if (!ai.app?.options?.appId) {
      throw new AIError(AIErrorCode.NO_APP_ID, `The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.`);
    }
    const apiSettings = {
      apiKey: ai.app.options.apiKey,
      project: ai.app.options.projectId,
      appId: ai.app.options.appId,
      automaticDataCollectionEnabled: ai.app.automaticDataCollectionEnabled,
      backend: ai.backend
    };
    if (_isFirebaseServerApp(ai.app) && ai.app.settings.appCheckToken) {
      const token = ai.app.settings.appCheckToken;
      apiSettings.getAppCheckToken = () => {
        return Promise.resolve({ token });
      };
    } else if (ai.appCheck) {
      if (ai.options?.useLimitedUseAppCheckTokens) {
        apiSettings.getAppCheckToken = () => ai.appCheck.getLimitedUseToken();
      } else {
        apiSettings.getAppCheckToken = () => ai.appCheck.getToken();
      }
    }
    if (ai.auth) {
      apiSettings.getAuthToken = () => ai.auth.getToken();
    }
    return apiSettings;
  }
  function getClientHeaders(url) {
    const loggingTags = [];
    loggingTags.push(`${LANGUAGE_TAG}/${PACKAGE_VERSION}`);
    loggingTags.push(`fire/${PACKAGE_VERSION}`);
    if (url.params.apiSettings.inferenceMode === InferenceMode.PREFER_ON_DEVICE || url.params.apiSettings.inferenceMode === InferenceMode.PREFER_IN_CLOUD) {
      loggingTags.push(HYBRID_TAG);
    }
    return loggingTags.join(" ");
  }
  async function getHeaders(url) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-goog-api-client", getClientHeaders(url));
    headers.append("x-goog-api-key", url.params.apiSettings.apiKey);
    if (url.params.apiSettings.automaticDataCollectionEnabled) {
      headers.append("X-Firebase-Appid", url.params.apiSettings.appId);
    }
    if (url.params.apiSettings.getAppCheckToken) {
      const appCheckToken = await url.params.apiSettings.getAppCheckToken();
      if (appCheckToken) {
        headers.append("X-Firebase-AppCheck", appCheckToken.token);
        if (appCheckToken.error) {
          logger2.warn(`Unable to obtain a valid App Check token: ${appCheckToken.error.message}`);
        }
      }
    }
    if (url.params.apiSettings.getAuthToken) {
      const authToken = await url.params.apiSettings.getAuthToken();
      if (authToken) {
        headers.append("Authorization", `Firebase ${authToken.accessToken}`);
      }
    }
    return headers;
  }
  async function makeRequest(requestUrlParams, body) {
    const url = new RequestURL(requestUrlParams);
    let response;
    const externalSignal = requestUrlParams.singleRequestOptions?.signal;
    const timeoutMillis = requestUrlParams.singleRequestOptions?.timeout != null && requestUrlParams.singleRequestOptions.timeout >= 0 ? requestUrlParams.singleRequestOptions.timeout : DEFAULT_FETCH_TIMEOUT_MS;
    const internalAbortController = new AbortController();
    const fetchTimeoutId = setTimeout(() => {
      internalAbortController.abort(new DOMException(TIMEOUT_EXPIRED_MESSAGE, ABORT_ERROR_NAME));
      logger2.debug(`Aborting request to ${url} due to timeout (${timeoutMillis}ms)`);
    }, timeoutMillis);
    const combinedSignal = AbortSignal.any(externalSignal ? [externalSignal, internalAbortController.signal] : [internalAbortController.signal]);
    if (externalSignal && externalSignal.aborted) {
      clearTimeout(fetchTimeoutId);
      throw new DOMException(externalSignal.reason ?? "Aborted externally before fetch", ABORT_ERROR_NAME);
    }
    try {
      const fetchOptions = {
        method: "POST",
        headers: await getHeaders(url),
        signal: combinedSignal,
        body
      };
      response = await fetch(url.toString(), fetchOptions);
      if (!response.ok) {
        let message = "";
        let errorDetails;
        try {
          const json = await response.json();
          message = json.error.message;
          if (json.error.details) {
            message += ` ${JSON.stringify(json.error.details)}`;
            errorDetails = json.error.details;
          }
        } catch (e) {
        }
        if (response.status === 403 && errorDetails && errorDetails.some((detail) => detail.reason === "SERVICE_DISABLED") && errorDetails.some((detail) => detail.links?.[0]?.description.includes("Google developers console API activation"))) {
          throw new AIError(AIErrorCode.API_NOT_ENABLED, `The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${url.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`, {
            status: response.status,
            statusText: response.statusText,
            errorDetails
          });
        }
        throw new AIError(AIErrorCode.FETCH_ERROR, `Error fetching from ${url}: [${response.status} ${response.statusText}] ${message}`, {
          status: response.status,
          statusText: response.statusText,
          errorDetails
        });
      }
    } catch (e) {
      let err = e;
      if (e.code !== AIErrorCode.FETCH_ERROR && e.code !== AIErrorCode.API_NOT_ENABLED && e instanceof Error && e.name !== ABORT_ERROR_NAME) {
        err = new AIError(AIErrorCode.ERROR, `Error fetching from ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
      }
      throw err;
    } finally {
      clearTimeout(fetchTimeoutId);
    }
    return response;
  }
  function hasValidCandidates(response) {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        logger2.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
          response
        });
      }
      return true;
    } else {
      return false;
    }
  }
  function assignPartType(part) {
    if ("type" in part && part.type) {
      return part;
    } else if (part.text !== void 0) {
      return { ...part, type: "text" };
    } else if (part.inlineData !== void 0) {
      return { ...part, type: "inlineData" };
    } else if (part.functionCall !== void 0) {
      return { ...part, type: "functionCall" };
    } else if (part.functionResponse !== void 0) {
      return { ...part, type: "functionResponse" };
    } else if (part.fileData !== void 0) {
      return { ...part, type: "fileData" };
    } else if (part.executableCode !== void 0) {
      return { ...part, type: "executableCode" };
    } else if (part.codeExecutionResult !== void 0) {
      return { ...part, type: "codeExecutionResult" };
    }
    return part;
  }
  function createEnhancedContentResponse(response, inferenceSource = InferenceSource.IN_CLOUD) {
    if (response.candidates && !response.candidates[0].hasOwnProperty("index")) {
      response.candidates[0].index = 0;
    }
    if (response.candidates) {
      for (const candidate of response.candidates) {
        if (candidate.content?.parts) {
          candidate.content.parts = candidate.content.parts.map(assignPartType);
        }
      }
    }
    const responseWithHelpers = addHelpers(response);
    responseWithHelpers.inferenceSource = inferenceSource;
    return responseWithHelpers;
  }
  function addHelpers(response) {
    response.text = () => {
      if (hasValidCandidates(response)) {
        return getText(response, (part) => !("thought" in part && part.thought));
      } else if (response.promptFeedback) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, `Text not available. ${formatBlockErrorMessage(response)}`, {
          response
        });
      }
      return "";
    };
    response.thoughtSummary = () => {
      if (hasValidCandidates(response)) {
        const result = getText(response, (part) => !!("thought" in part && part.thought));
        return result === "" ? void 0 : result;
      } else if (response.promptFeedback) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, `Thought summary not available. ${formatBlockErrorMessage(response)}`, {
          response
        });
      }
      return void 0;
    };
    response.inlineDataParts = () => {
      if (hasValidCandidates(response)) {
        return getInlineDataParts(response);
      } else if (response.promptFeedback) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, `Data not available. ${formatBlockErrorMessage(response)}`, {
          response
        });
      }
      return void 0;
    };
    response.functionCalls = () => {
      if (hasValidCandidates(response)) {
        return getFunctionCalls(response);
      } else if (response.promptFeedback) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, `Function call not available. ${formatBlockErrorMessage(response)}`, {
          response
        });
      }
      return void 0;
    };
    return response;
  }
  function getText(response, partFilter) {
    const textStrings = [];
    if (response.candidates?.[0].content?.parts) {
      for (const part of response.candidates?.[0].content?.parts) {
        const typedPart = assignPartType(part);
        if (typedPart.type === "text" && partFilter(typedPart)) {
          textStrings.push(typedPart.text);
        }
      }
    }
    if (textStrings.length > 0) {
      return textStrings.join("");
    } else {
      return "";
    }
  }
  function getFunctionCalls(response) {
    if (!response) {
      return void 0;
    }
    const functionCalls = [];
    if (response.candidates?.[0].content?.parts) {
      for (const part of response.candidates?.[0].content?.parts) {
        const typedPart = assignPartType(part);
        if (typedPart.type === "functionCall") {
          functionCalls.push(typedPart.functionCall);
        }
      }
    }
    if (functionCalls.length > 0) {
      return functionCalls;
    } else {
      return void 0;
    }
  }
  function getInlineDataParts(response) {
    const data = [];
    if (response.candidates?.[0].content?.parts) {
      for (const part of response.candidates?.[0].content?.parts) {
        const typedPart = assignPartType(part);
        if (typedPart.type === "inlineData") {
          data.push(typedPart);
        }
      }
    }
    if (data.length > 0) {
      return data;
    } else {
      return void 0;
    }
  }
  function hadBadFinishReason(candidate) {
    return !!candidate.finishReason && badFinishReasons.some((reason) => reason === candidate.finishReason);
  }
  function formatBlockErrorMessage(response) {
    let message = "";
    if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
      message += "Response was blocked";
      if (response.promptFeedback?.blockReason) {
        message += ` due to ${response.promptFeedback.blockReason}`;
      }
      if (response.promptFeedback?.blockReasonMessage) {
        message += `: ${response.promptFeedback.blockReasonMessage}`;
      }
    } else if (response.candidates?.[0]) {
      const firstCandidate = response.candidates[0];
      if (hadBadFinishReason(firstCandidate)) {
        message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
        if (firstCandidate.finishMessage) {
          message += `: ${firstCandidate.finishMessage}`;
        }
      }
    }
    return message;
  }
  function formatSystemInstruction(input) {
    if (input == null) {
      return void 0;
    } else if (typeof input === "string") {
      return {
        role: "system",
        parts: [{ type: "text", text: input }]
      };
    } else if (input.type === "text" || "text" in input && typeof input.text === "string") {
      const part = deepCopy(assignPartType(input));
      return { role: "system", parts: [part] };
    } else if (input.parts) {
      const parts = input.parts.map((p) => deepCopy(assignPartType(p)));
      if (!input.role) {
        return { role: "system", parts };
      } else {
        return { ...input, parts };
      }
    }
  }
  function formatNewContent(request) {
    let newParts = [];
    if (typeof request === "string") {
      newParts = [{ type: "text", text: request }];
    } else {
      for (const partOrString of request) {
        if (typeof partOrString === "string") {
          newParts.push({ type: "text", text: partOrString });
        } else {
          newParts.push(deepCopy(assignPartType(partOrString)));
        }
      }
    }
    return assignRoleToPartsAndValidateSendMessageRequest(newParts);
  }
  function assignRoleToPartsAndValidateSendMessageRequest(parts) {
    const content = { role: "user", parts: [] };
    let hasUserContent = false;
    let hasFunctionContent = false;
    for (const part of parts) {
      if (part.type === "functionResponse" || "functionResponse" in part) {
        hasFunctionContent = true;
      } else {
        hasUserContent = true;
      }
      content.parts.push(part);
    }
    if (hasUserContent && hasFunctionContent) {
      throw new AIError(AIErrorCode.INVALID_CONTENT, "Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");
    }
    if (!hasUserContent && !hasFunctionContent) {
      throw new AIError(AIErrorCode.INVALID_CONTENT, "No Content is provided for sending chat message.");
    }
    return content;
  }
  function formatGenerateContentInput(params) {
    let formattedRequest;
    if (params.contents) {
      const request = params;
      formattedRequest = {
        ...request,
        contents: request.contents.map((content) => ({
          ...content,
          parts: content.parts ? content.parts.map(assignPartType) : []
        }))
      };
    } else {
      const content = formatNewContent(params);
      formattedRequest = { contents: [content] };
    }
    if (params.systemInstruction) {
      formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
    }
    return formattedRequest;
  }
  function cleanFunctionResponseForWire(fnResponse) {
    if (fnResponse.parts && Array.isArray(fnResponse.parts)) {
      return {
        ...fnResponse,
        parts: fnResponse.parts.map(stripPartType)
      };
    }
    return fnResponse;
  }
  function stripPartType(part) {
    let wirePart;
    if ("type" in part) {
      const { type: _type, ...rest } = part;
      wirePart = rest;
    } else {
      wirePart = part;
    }
    if (wirePart.functionResponse) {
      wirePart = {
        ...wirePart,
        functionResponse: cleanFunctionResponseForWire(wirePart.functionResponse)
      };
    }
    return wirePart;
  }
  function cleanContentForWire(content) {
    if (!content.parts) {
      return content;
    }
    return {
      ...content,
      parts: content.parts.map(stripPartType)
    };
  }
  function cleanSystemInstructionForWire(systemInstruction) {
    if (systemInstruction == null || typeof systemInstruction === "string") {
      return systemInstruction;
    }
    if ("parts" in systemInstruction && Array.isArray(systemInstruction.parts)) {
      return cleanContentForWire(systemInstruction);
    }
    return stripPartType(systemInstruction);
  }
  function cleanGenerateContentRequestForWire(request) {
    const cleaned = { ...request };
    if (cleaned.contents) {
      cleaned.contents = cleaned.contents.map(cleanContentForWire);
    }
    if (cleaned.systemInstruction) {
      cleaned.systemInstruction = cleanSystemInstructionForWire(cleaned.systemInstruction);
    }
    return cleaned;
  }
  function cleanCountTokensRequestForWire(request) {
    const cleaned = { ...request };
    if (cleaned.contents) {
      cleaned.contents = cleaned.contents.map(cleanContentForWire);
    }
    if (cleaned.systemInstruction) {
      cleaned.systemInstruction = cleanSystemInstructionForWire(cleaned.systemInstruction);
    }
    return cleaned;
  }
  function mapGenerateContentRequest(generateContentRequest) {
    generateContentRequest.safetySettings?.forEach((safetySetting) => {
      if (safetySetting.method) {
        throw new AIError(AIErrorCode.UNSUPPORTED, "SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.");
      }
    });
    if (generateContentRequest.generationConfig?.topK) {
      const roundedTopK = Math.round(generateContentRequest.generationConfig.topK);
      if (roundedTopK !== generateContentRequest.generationConfig.topK) {
        logger2.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API.");
        generateContentRequest.generationConfig.topK = roundedTopK;
      }
    }
    return generateContentRequest;
  }
  function mapGenerateContentResponse(googleAIResponse) {
    const generateContentResponse = {
      candidates: googleAIResponse.candidates ? mapGenerateContentCandidates(googleAIResponse.candidates) : void 0,
      prompt: googleAIResponse.promptFeedback ? mapPromptFeedback(googleAIResponse.promptFeedback) : void 0,
      usageMetadata: googleAIResponse.usageMetadata
    };
    return generateContentResponse;
  }
  function mapCountTokensRequest(countTokensRequest, model) {
    const mappedCountTokensRequest = {
      generateContentRequest: {
        model,
        ...countTokensRequest
      }
    };
    return mappedCountTokensRequest;
  }
  function mapGenerateContentCandidates(candidates) {
    const mappedCandidates = [];
    let mappedSafetyRatings;
    if (mappedCandidates) {
      candidates.forEach((candidate) => {
        let citationMetadata;
        if (candidate.citationMetadata) {
          citationMetadata = {
            citations: candidate.citationMetadata.citationSources
          };
        }
        if (candidate.safetyRatings) {
          mappedSafetyRatings = candidate.safetyRatings.map((safetyRating) => {
            return {
              ...safetyRating,
              severity: safetyRating.severity ?? HarmSeverity.HARM_SEVERITY_UNSUPPORTED,
              probabilityScore: safetyRating.probabilityScore ?? 0,
              severityScore: safetyRating.severityScore ?? 0
            };
          });
        }
        if (candidate.content?.parts?.some((part) => "videoMetadata" in part && part.videoMetadata)) {
          throw new AIError(AIErrorCode.UNSUPPORTED, "Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");
        }
        const mappedCandidate = {
          index: candidate.index,
          content: candidate.content,
          finishReason: candidate.finishReason,
          finishMessage: candidate.finishMessage,
          safetyRatings: mappedSafetyRatings,
          citationMetadata,
          groundingMetadata: candidate.groundingMetadata,
          urlContextMetadata: candidate.urlContextMetadata
        };
        mappedCandidates.push(mappedCandidate);
      });
    }
    return mappedCandidates;
  }
  function mapPromptFeedback(promptFeedback) {
    const mappedSafetyRatings = [];
    promptFeedback.safetyRatings.forEach((safetyRating) => {
      mappedSafetyRatings.push({
        category: safetyRating.category,
        probability: safetyRating.probability,
        severity: safetyRating.severity ?? HarmSeverity.HARM_SEVERITY_UNSUPPORTED,
        probabilityScore: safetyRating.probabilityScore ?? 0,
        severityScore: safetyRating.severityScore ?? 0,
        blocked: safetyRating.blocked
      });
    });
    const mappedPromptFeedback = {
      blockReason: promptFeedback.blockReason,
      safetyRatings: mappedSafetyRatings,
      blockReasonMessage: promptFeedback.blockReasonMessage
    };
    return mappedPromptFeedback;
  }
  async function processStream(response, apiSettings, inferenceSource) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
    const responseStream = getResponseStream(inputStream);
    const [stream1, stream2] = responseStream.tee();
    const { response: internalResponse, firstValue } = await processStreamInternal(stream2, apiSettings, inferenceSource);
    return {
      stream: generateResponseSequence(stream1, apiSettings, inferenceSource),
      response: internalResponse,
      firstValue
    };
  }
  async function processStreamInternal(stream, apiSettings, inferenceSource) {
    const [streamForPeek, streamForAggregation] = stream.tee();
    const reader = streamForPeek.getReader();
    const { value } = await reader.read();
    return {
      firstValue: value,
      response: getResponsePromise(streamForAggregation, apiSettings, inferenceSource)
    };
  }
  async function getResponsePromise(stream, apiSettings, inferenceSource) {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        let generateContentResponse = aggregateResponses(allResponses);
        if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
          generateContentResponse = mapGenerateContentResponse(generateContentResponse);
        }
        return createEnhancedContentResponse(generateContentResponse, inferenceSource);
      }
      allResponses.push(value);
    }
  }
  async function* generateResponseSequence(stream, apiSettings, inferenceSource) {
    const reader = stream.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      let enhancedResponse;
      if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
        enhancedResponse = createEnhancedContentResponse(mapGenerateContentResponse(value), inferenceSource);
      } else {
        enhancedResponse = createEnhancedContentResponse(value, inferenceSource);
      }
      const firstCandidate = enhancedResponse.candidates?.[0];
      if (!firstCandidate?.content?.parts && !firstCandidate?.finishReason && !firstCandidate?.citationMetadata && !firstCandidate?.urlContextMetadata) {
        continue;
      }
      yield enhancedResponse;
    }
  }
  function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
      start(controller) {
        let currentText = "";
        return pump();
        function pump() {
          return reader.read().then(({ value, done }) => {
            if (done) {
              if (currentText.trim()) {
                controller.error(new AIError(AIErrorCode.PARSE_FAILED, "Failed to parse stream"));
                return;
              }
              controller.close();
              return;
            }
            currentText += value;
            let match = currentText.match(responseLineRE);
            let parsedResponse;
            while (match) {
              try {
                parsedResponse = JSON.parse(match[1]);
              } catch (e) {
                controller.error(new AIError(AIErrorCode.PARSE_FAILED, `Error parsing JSON response: "${match[1]}`));
                return;
              }
              controller.enqueue(parsedResponse);
              currentText = currentText.substring(match[0].length);
              match = currentText.match(responseLineRE);
            }
            return pump();
          });
        }
      }
    });
    return stream;
  }
  function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
      promptFeedback: lastResponse?.promptFeedback
    };
    for (const response of responses) {
      if (response.candidates) {
        for (const candidate of response.candidates) {
          const i = candidate.index || 0;
          if (!aggregatedResponse.candidates) {
            aggregatedResponse.candidates = [];
          }
          if (!aggregatedResponse.candidates[i]) {
            aggregatedResponse.candidates[i] = {
              index: candidate.index
            };
          }
          aggregatedResponse.candidates[i].citationMetadata = candidate.citationMetadata;
          aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
          aggregatedResponse.candidates[i].finishMessage = candidate.finishMessage;
          aggregatedResponse.candidates[i].safetyRatings = candidate.safetyRatings;
          aggregatedResponse.candidates[i].groundingMetadata = candidate.groundingMetadata;
          const urlContextMetadata = candidate.urlContextMetadata;
          if (typeof urlContextMetadata === "object" && urlContextMetadata !== null && Object.keys(urlContextMetadata).length > 0) {
            aggregatedResponse.candidates[i].urlContextMetadata = urlContextMetadata;
          }
          if (candidate.content) {
            if (!candidate.content.parts) {
              continue;
            }
            if (!aggregatedResponse.candidates[i].content) {
              aggregatedResponse.candidates[i].content = {
                role: candidate.content.role || "user",
                parts: []
              };
            }
            for (const part of candidate.content.parts) {
              if ("text" in part && part.text === "") {
                continue;
              }
              if (Object.keys(part).length === 0) {
                throw new AIError(AIErrorCode.INVALID_CONTENT, "Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");
              }
              const newPart = assignPartType({ ...part });
              if (Object.keys(newPart).length > 0) {
                aggregatedResponse.candidates[i].content.parts.push(newPart);
              }
            }
          }
        }
      }
    }
    return aggregatedResponse;
  }
  async function callCloudOrDevice(request, chromeAdapter, onDeviceCall, inCloudCall) {
    if (!chromeAdapter) {
      return {
        response: await inCloudCall(),
        inferenceSource: InferenceSource.IN_CLOUD
      };
    }
    switch (chromeAdapter.mode) {
      case InferenceMode.ONLY_ON_DEVICE:
        if (await chromeAdapter.isAvailable(request)) {
          return {
            response: await onDeviceCall(),
            inferenceSource: InferenceSource.ON_DEVICE
          };
        }
        throw new AIError(AIErrorCode.UNSUPPORTED, "Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");
      case InferenceMode.ONLY_IN_CLOUD:
        return {
          response: await inCloudCall(),
          inferenceSource: InferenceSource.IN_CLOUD
        };
      case InferenceMode.PREFER_IN_CLOUD:
        try {
          return {
            response: await inCloudCall(),
            inferenceSource: InferenceSource.IN_CLOUD
          };
        } catch (e) {
          if (e instanceof AIError && errorsCausingFallback.includes(e.code) && await chromeAdapter.isAvailable(request)) {
            return {
              response: await onDeviceCall(),
              inferenceSource: InferenceSource.ON_DEVICE
            };
          }
          throw e;
        }
      case InferenceMode.PREFER_ON_DEVICE:
        if (await chromeAdapter.isAvailable(request)) {
          return {
            response: await onDeviceCall(),
            inferenceSource: InferenceSource.ON_DEVICE
          };
        }
        return {
          response: await inCloudCall(),
          inferenceSource: InferenceSource.IN_CLOUD
        };
      default:
        throw new AIError(AIErrorCode.ERROR, `Unexpected infererence mode: ${chromeAdapter.mode}`);
    }
  }
  async function generateContentStreamOnCloud(apiSettings, model, params, singleRequestOptions) {
    params = cleanGenerateContentRequestForWire(params);
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
      params = mapGenerateContentRequest(params);
    }
    return makeRequest({
      task: "streamGenerateContent",
      model,
      apiSettings,
      stream: true,
      singleRequestOptions
    }, JSON.stringify(params));
  }
  async function generateContentStream(apiSettings, model, params, chromeAdapter, singleRequestOptions) {
    const callResult = await callCloudOrDevice(params, chromeAdapter, () => chromeAdapter.generateContentStream(params), () => generateContentStreamOnCloud(apiSettings, model, params, singleRequestOptions));
    return processStream(callResult.response, apiSettings, callResult.inferenceSource);
  }
  async function generateContentOnCloud(apiSettings, model, params, singleRequestOptions) {
    params = cleanGenerateContentRequestForWire(params);
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
      params = mapGenerateContentRequest(params);
    }
    return makeRequest({
      model,
      task: "generateContent",
      apiSettings,
      stream: false,
      singleRequestOptions
    }, JSON.stringify(params));
  }
  async function generateContent(apiSettings, model, params, chromeAdapter, singleRequestOptions) {
    const callResult = await callCloudOrDevice(params, chromeAdapter, () => chromeAdapter.generateContent(params), () => generateContentOnCloud(apiSettings, model, params, singleRequestOptions));
    const generateContentResponse = await processGenerateContentResponse(callResult.response, apiSettings);
    const enhancedResponse = createEnhancedContentResponse(generateContentResponse, callResult.inferenceSource);
    return {
      response: enhancedResponse
    };
  }
  async function processGenerateContentResponse(response, apiSettings) {
    const responseJson = await response.json();
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
      return mapGenerateContentResponse(responseJson);
    } else {
      return responseJson;
    }
  }
  function validateChatHistory(history) {
    let prevContent = null;
    for (const currContent of history) {
      const { role, parts } = currContent;
      if (!prevContent && role !== "user") {
        throw new AIError(AIErrorCode.INVALID_CONTENT, `First Content should be with role 'user', got ${role}`);
      }
      if (!POSSIBLE_ROLES.includes(role)) {
        throw new AIError(AIErrorCode.INVALID_CONTENT, `Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
      }
      if (!Array.isArray(parts)) {
        throw new AIError(AIErrorCode.INVALID_CONTENT, `Content should have 'parts' property with an array of Parts`);
      }
      if (parts.length === 0) {
        throw new AIError(AIErrorCode.INVALID_CONTENT, `Each Content should have at least one part`);
      }
      const countFields = {
        text: 0,
        inlineData: 0,
        functionCall: 0,
        functionResponse: 0,
        thought: 0,
        thoughtSignature: 0,
        fileData: 0,
        executableCode: 0,
        codeExecutionResult: 0
      };
      for (const part of parts) {
        if (part.type) {
          countFields[part.type] += 1;
        } else {
          for (const key of [
            "text",
            "inlineData",
            "functionCall",
            "functionResponse",
            "fileData",
            "executableCode",
            "codeExecutionResult"
          ]) {
            if (key in part) {
              countFields[key] += 1;
            }
          }
        }
        if ("thought" in part && part.thought) {
          countFields.thought += 1;
        }
        if ("thoughtSignature" in part && part.thoughtSignature) {
          countFields.thoughtSignature += 1;
        }
      }
      const validParts = VALID_PARTS_PER_ROLE[role];
      for (const key of VALID_PART_FIELDS) {
        if (!validParts.includes(key) && countFields[key] > 0) {
          throw new AIError(AIErrorCode.INVALID_CONTENT, `Content with role '${role}' can't contain '${key}' part`);
        }
      }
      if (prevContent) {
        const validPreviousContentRoles = VALID_PREVIOUS_CONTENT_ROLES[role];
        if (!validPreviousContentRoles.includes(prevContent.role)) {
          throw new AIError(AIErrorCode.INVALID_CONTENT, `Content with role '${role}' can't follow '${prevContent.role}'. Valid previous roles: ${JSON.stringify(VALID_PREVIOUS_CONTENT_ROLES)}`);
        }
      }
      prevContent = currContent;
    }
  }
  async function countTokensOnCloud(apiSettings, model, params, singleRequestOptions) {
    params = cleanCountTokensRequestForWire(params);
    let body = "";
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
      const mappedParams = mapCountTokensRequest(params, model);
      body = JSON.stringify(mappedParams);
    } else {
      body = JSON.stringify(params);
    }
    const response = await makeRequest({
      model,
      task: "countTokens",
      apiSettings,
      stream: false,
      singleRequestOptions
    }, body);
    return response.json();
  }
  async function countTokens(apiSettings, model, params, chromeAdapter, requestOptions) {
    if (chromeAdapter?.mode === InferenceMode.ONLY_ON_DEVICE) {
      throw new AIError(AIErrorCode.UNSUPPORTED, "countTokens() is not supported for on-device models.");
    }
    return countTokensOnCloud(apiSettings, model, params, requestOptions);
  }
  function validateGenerationConfig(generationConfig) {
    if (
      // != allows for null and undefined. 0 is considered "set" by the model
      generationConfig.thinkingConfig?.thinkingBudget != null && generationConfig.thinkingConfig?.thinkingLevel
    ) {
      throw new AIError(AIErrorCode.UNSUPPORTED, `Cannot set both thinkingBudget and thinkingLevel in a config.`);
    }
    if (
      // != allows for null and undefined.
      generationConfig.responseSchema != null && generationConfig.responseJsonSchema != null
    ) {
      throw new AIError(AIErrorCode.UNSUPPORTED, `Cannot set both responseSchema and responseJsonSchema in a config.`);
    }
    if ((generationConfig.responseSchema != null || generationConfig.responseJsonSchema != null) && generationConfig.responseMimeType !== "application/json" && generationConfig.responseMimeType !== "text/x.enum") {
      throw new AIError(AIErrorCode.UNSUPPORTED, `responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.`);
    }
  }
  function getAI(app = getApp(), options) {
    app = getModularInstance(app);
    const AIProvider = _getProvider(app, AI_TYPE);
    const backend = options?.backend ?? new GoogleAIBackend();
    const finalOptions = {
      useLimitedUseAppCheckTokens: options?.useLimitedUseAppCheckTokens ?? false
    };
    const identifier = encodeInstanceIdentifier(backend);
    const aiInstance = AIProvider.getImmediate({
      identifier
    });
    aiInstance.options = finalOptions;
    return aiInstance;
  }
  function getGenerativeModel(ai, modelParams, requestOptions) {
    const hybridParams = modelParams;
    let inCloudParams;
    if (hybridParams.mode) {
      for (const param of Object.keys(modelParams)) {
        if (!hybridParamKeys.includes(param)) {
          logger2.warn(`When a hybrid inference mode is specified (mode is currently set to ${hybridParams.mode}), "${param}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);
        }
      }
      inCloudParams = hybridParams.inCloudParams || {
        model: DEFAULT_HYBRID_IN_CLOUD_MODEL
      };
    } else {
      inCloudParams = modelParams;
    }
    if (!inCloudParams.model) {
      throw new AIError(AIErrorCode.NO_MODEL, `Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })`);
    }
    const chromeAdapter = ai.chromeAdapterFactory?.(hybridParams.mode, typeof window === "undefined" ? void 0 : window, hybridParams.onDeviceParams);
    const generativeModel = new GenerativeModel(ai, inCloudParams, requestOptions, chromeAdapter);
    generativeModel._apiSettings.inferenceMode = hybridParams.mode;
    return generativeModel;
  }
  function registerAI() {
    _registerComponent(new Component(
      AI_TYPE,
      factory,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setMultipleInstances(true));
    registerVersion(name3, version2);
    registerVersion(name3, version2, "esm2020");
  }
  var name3, version2, AI_TYPE, DEFAULT_LOCATION, DEFAULT_DOMAIN, DEFAULT_API_VERSION, PACKAGE_VERSION, LANGUAGE_TAG, HYBRID_TAG, DEFAULT_FETCH_TIMEOUT_MS, DEFAULT_HYBRID_IN_CLOUD_MODEL, AIError, POSSIBLE_ROLES, HarmSeverity, FinishReason, InferenceMode, InferenceSource, AIErrorCode, BackendType, Backend, GoogleAIBackend, AgentPlatformBackend, logger2, Availability, defaultExpectedText, defaultExpectedInputs, defaultExpectedOutputs, ChromeAdapterImpl, AIService, AIModel, TIMEOUT_EXPIRED_MESSAGE, ABORT_ERROR_NAME, RequestURL, badFinishReasons, responseLineRE, errorsCausingFallback, SILENT_ERROR, DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS, ChatSessionBase, VALID_PART_FIELDS, VALID_PARTS_PER_ROLE, VALID_PREVIOUS_CONTENT_ROLES, ChatSessionImpl, GenerativeModel, AUDIO_PROCESSOR_NAME, audioProcessorWorkletString, hybridParamKeys;
  var init_index_esm6 = __esm({
    "node_modules/@firebase/ai/dist/esm/index.esm.js"() {
      init_index_esm4();
      init_index_esm2();
      init_index_esm();
      init_index_esm3();
      name3 = "@firebase/ai";
      version2 = "3.0.0";
      AI_TYPE = "AI";
      DEFAULT_LOCATION = "global";
      DEFAULT_DOMAIN = "firebasevertexai.googleapis.com";
      DEFAULT_API_VERSION = "v1beta";
      PACKAGE_VERSION = version2;
      LANGUAGE_TAG = "gl-js";
      HYBRID_TAG = "hybrid";
      DEFAULT_FETCH_TIMEOUT_MS = 180 * 1e3;
      DEFAULT_HYBRID_IN_CLOUD_MODEL = "gemini-3.5-flash-lite";
      AIError = class _AIError extends FirebaseError {
        /**
         * Constructs a new instance of the `AIError` class.
         *
         * @param code - The error code from {@link (AIErrorCode:type)}.
         * @param message - A human-readable message describing the error.
         * @param customErrorData - Optional error data.
         */
        constructor(code, message, customErrorData) {
          const service = AI_TYPE;
          const fullCode = `${service}/${code}`;
          const fullMessage = `${service}: ${message} (${fullCode})`;
          super(code, fullMessage);
          this.code = code;
          this.customErrorData = customErrorData;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, _AIError);
          }
          Object.setPrototypeOf(this, _AIError.prototype);
          this.toString = () => fullMessage;
        }
      };
      POSSIBLE_ROLES = ["user", "model", "function", "system"];
      HarmSeverity = {
        /**
         * Negligible level of harm severity.
         */
        HARM_SEVERITY_NEGLIGIBLE: "HARM_SEVERITY_NEGLIGIBLE",
        /**
         * Low level of harm severity.
         */
        HARM_SEVERITY_LOW: "HARM_SEVERITY_LOW",
        /**
         * Medium level of harm severity.
         */
        HARM_SEVERITY_MEDIUM: "HARM_SEVERITY_MEDIUM",
        /**
         * High level of harm severity.
         */
        HARM_SEVERITY_HIGH: "HARM_SEVERITY_HIGH",
        /**
         * Harm severity is not supported.
         *
         * @remarks
         * The GoogleAI backend does not support `HarmSeverity`, so this value is used as a fallback.
         */
        HARM_SEVERITY_UNSUPPORTED: "HARM_SEVERITY_UNSUPPORTED"
      };
      FinishReason = {
        /**
         * Natural stop point of the model or provided stop sequence.
         */
        STOP: "STOP",
        /**
         * The maximum number of tokens as specified in the request was reached.
         */
        MAX_TOKENS: "MAX_TOKENS",
        /**
         * The candidate content was flagged for safety reasons.
         */
        SAFETY: "SAFETY",
        /**
         * The candidate content was flagged for recitation reasons.
         */
        RECITATION: "RECITATION",
        /**
         * Unknown reason.
         */
        OTHER: "OTHER",
        /**
         * The candidate content contained forbidden terms.
         */
        BLOCKLIST: "BLOCKLIST",
        /**
         * The candidate content potentially contained prohibited content.
         */
        PROHIBITED_CONTENT: "PROHIBITED_CONTENT",
        /**
         * The candidate content potentially contained Sensitive Personally Identifiable Information (SPII).
         */
        SPII: "SPII",
        /**
         * The function call generated by the model was invalid.
         */
        MALFORMED_FUNCTION_CALL: "MALFORMED_FUNCTION_CALL",
        /**
         * Token generation stopped because generated images contain safety violations.
         */
        IMAGE_SAFETY: "IMAGE_SAFETY",
        /**
         * Image generation stopped because generated images have other prohibited content.
         */
        IMAGE_PROHIBITED_CONTENT: "IMAGE_PROHIBITED_CONTENT",
        /**
         * Image generation stopped because of other miscellaneous issue.
         */
        IMAGE_OTHER: "IMAGE_OTHER",
        /**
         * The model was expected to generate an image, but none was generated.
         */
        NO_IMAGE: "NO_IMAGE",
        /**
         * Image generation stopped due to recitation.
         */
        IMAGE_RECITATION: "IMAGE_RECITATION",
        /**
         * The response candidate content was flagged for using an unsupported language.
         */
        LANGUAGE: "LANGUAGE",
        /**
         * Model generated a tool call but no tools were enabled in the request.
         */
        UNEXPECTED_TOOL_CALL: "UNEXPECTED_TOOL_CALL",
        /**
         * Model called too many tools consecutively, thus the system exited execution.
         */
        TOO_MANY_TOOL_CALLS: "TOO_MANY_TOOL_CALLS",
        /**
         * Request has at least one thought signature missing.
         */
        MISSING_THOUGHT_SIGNATURE: "MISSING_THOUGHT_SIGNATURE",
        /**
         * Finished due to malformed response.
         */
        MALFORMED_RESPONSE: "MALFORMED_RESPONSE"
      };
      InferenceMode = {
        "PREFER_ON_DEVICE": "prefer_on_device",
        "ONLY_ON_DEVICE": "only_on_device",
        "ONLY_IN_CLOUD": "only_in_cloud",
        "PREFER_IN_CLOUD": "prefer_in_cloud"
      };
      InferenceSource = {
        "ON_DEVICE": "on_device",
        "IN_CLOUD": "in_cloud"
      };
      AIErrorCode = {
        /** A generic error occurred. */
        ERROR: "error",
        /** An error occurred in a request. */
        REQUEST_ERROR: "request-error",
        /** An error occurred in a response. */
        RESPONSE_ERROR: "response-error",
        /** An error occurred while performing a fetch. */
        FETCH_ERROR: "fetch-error",
        /** An error occurred because an operation was attempted on a closed session. */
        SESSION_CLOSED: "session-closed",
        /** An error associated with a Content object.  */
        INVALID_CONTENT: "invalid-content",
        /** An error due to the Firebase API not being enabled in the Console. */
        API_NOT_ENABLED: "api-not-enabled",
        /** An error due to invalid Schema input.  */
        INVALID_SCHEMA: "invalid-schema",
        /** An error occurred due to a missing Firebase API key. */
        NO_API_KEY: "no-api-key",
        /** An error occurred due to a missing Firebase app ID. */
        NO_APP_ID: "no-app-id",
        /** An error occurred due to a model name not being specified during initialization. */
        NO_MODEL: "no-model",
        /** An error occurred due to a missing project ID. */
        NO_PROJECT_ID: "no-project-id",
        /** An error occurred while parsing. */
        PARSE_FAILED: "parse-failed",
        /** An error occurred due an attempt to use an unsupported feature. */
        UNSUPPORTED: "unsupported"
      };
      BackendType = {
        /**
         * Identifies the backend service for the Agent Platform Gemini API provided through Google Cloud.
         * Use this constant when creating a {@link AgentPlatformBackend} configuration.
         */
        AGENT_PLATFORM: "AGENT_PLATFORM",
        /**
         * Identifies the backend service for the Gemini Developer API ({@link https://ai.google/ | Google AI}).
         * Use this constant when creating a {@link GoogleAIBackend} configuration.
         */
        GOOGLE_AI: "GOOGLE_AI"
      };
      Backend = class {
        /**
         * Protected constructor for use by subclasses.
         * @param type - The backend type.
         */
        constructor(type) {
          this.backendType = type;
        }
      };
      GoogleAIBackend = class extends Backend {
        /**
         * Creates a configuration object for the Gemini Developer API backend.
         */
        constructor() {
          super(BackendType.GOOGLE_AI);
        }
        /**
         * @internal
         */
        _getModelPath(project, model) {
          return `/${DEFAULT_API_VERSION}/projects/${project}/${model}`;
        }
        /**
         * @internal
         */
        _getTemplatePath(project, templateId) {
          return `/${DEFAULT_API_VERSION}/projects/${project}/templates/${templateId}`;
        }
      };
      AgentPlatformBackend = class extends Backend {
        /**
         * Creates a configuration object for the Agent Platform backend.
         *
         * @param location - The region identifier, defaulting to `global`;
         * see {@link https://firebase.google.com/docs/ai-logic/locations?api=vertex#available-locations | Agent Platform locations}
         * for a list of supported locations.
         */
        constructor(location) {
          super(BackendType.AGENT_PLATFORM);
          this.location = DEFAULT_LOCATION;
          if (location) {
            this.location = location;
          }
        }
        /**
         * @internal
         */
        _getModelPath(project, model) {
          return `/${DEFAULT_API_VERSION}/projects/${project}/locations/${this.location}/${model}`;
        }
        /**
         * @internal
         */
        _getTemplatePath(project, templateId) {
          return `/${DEFAULT_API_VERSION}/projects/${project}/locations/${this.location}/templates/${templateId}`;
        }
      };
      logger2 = new Logger("@firebase/ai");
      (function(Availability2) {
        Availability2["UNAVAILABLE"] = "unavailable";
        Availability2["DOWNLOADABLE"] = "downloadable";
        Availability2["DOWNLOADING"] = "downloading";
        Availability2["AVAILABLE"] = "available";
      })(Availability || (Availability = {}));
      defaultExpectedText = {
        type: "text",
        languages: ["en"]
      };
      defaultExpectedInputs = [
        defaultExpectedText,
        { type: "image" }
      ];
      defaultExpectedOutputs = [
        defaultExpectedText
      ];
      ChromeAdapterImpl = class _ChromeAdapterImpl {
        constructor(languageModelProvider, mode, onDeviceParams) {
          this.languageModelProvider = languageModelProvider;
          this.mode = mode;
          this.downloadPromise = null;
          this.onDeviceParams = {
            createOptions: {
              expectedInputs: defaultExpectedInputs,
              expectedOutputs: defaultExpectedOutputs
            }
          };
          if (onDeviceParams) {
            this.onDeviceParams = onDeviceParams;
            if (!this.onDeviceParams.createOptions) {
              this.onDeviceParams.createOptions = {
                expectedInputs: defaultExpectedInputs,
                expectedOutputs: defaultExpectedOutputs
              };
            } else {
              if (!this.onDeviceParams.createOptions.expectedInputs) {
                this.onDeviceParams.createOptions.expectedInputs = defaultExpectedInputs;
              }
              if (!this.onDeviceParams.createOptions.expectedOutputs) {
                this.onDeviceParams.createOptions.expectedOutputs = defaultExpectedOutputs;
              }
            }
          }
        }
        /**
         * Checks if a given request can be made on-device.
         *
         * Encapsulates a few concerns:
         *   the mode
         *   API existence
         *   prompt formatting
         *   model availability
         *
         *
         * Pros: callers needn't be concerned with details of on-device availability.</p>
         * Cons: this method spans a few concerns and splits request validation from usage.
         * If instance variables weren't already part of the API, we could consider a better
         * separation of concerns.
         */
        async isAvailable(request) {
          if (!this.mode) {
            logger2.debug(`On-device inference unavailable because mode is undefined.`);
            return false;
          }
          if (this.mode === InferenceMode.ONLY_IN_CLOUD) {
            logger2.debug(`On-device inference unavailable because mode is "only_in_cloud".`);
            return false;
          }
          const availability = await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);
          if (this.mode === InferenceMode.ONLY_ON_DEVICE) {
            if (availability === Availability.UNAVAILABLE) {
              throw new AIError(AIErrorCode.API_NOT_ENABLED, "Local LanguageModel API not available in this environment.");
            } else if (availability === Availability.DOWNLOADABLE || availability === Availability.DOWNLOADING) {
              logger2.debug(`Waiting for download of LanguageModel to complete.`);
              try {
                await this.downloadPromise;
              } catch (e) {
                throw new AIError(AIErrorCode.ERROR, e.message);
              }
              return true;
            }
            return true;
          }
          if (availability !== Availability.AVAILABLE) {
            logger2.debug(`On-device inference unavailable because availability is "${availability}".`);
            return false;
          }
          if (!_ChromeAdapterImpl.isOnDeviceRequest(request)) {
            logger2.debug(`On-device inference unavailable because request is incompatible.`);
            return false;
          }
          return true;
        }
        /**
         * Generates content on device.
         *
         * @remarks
         * This is comparable to {@link GenerativeModel.generateContent} for generating content in
         * Cloud.
         * @param request - a standard Firebase AI {@link GenerateContentRequest}
         * @returns {@link Response}, so we can reuse common response formatting.
         */
        async generateContent(request) {
          const session = await this.createSession();
          const contents = await Promise.all(request.contents.map(_ChromeAdapterImpl.toLanguageModelMessage));
          const text = await session.prompt(contents, this.onDeviceParams.promptOptions);
          return _ChromeAdapterImpl.toResponse(text);
        }
        /**
         * Generates content stream on device.
         *
         * @remarks
         * This is comparable to {@link GenerativeModel.generateContentStream} for generating content in
         * Cloud.
         * @param request - a standard Firebase AI {@link GenerateContentRequest}
         * @returns {@link Response}, so we can reuse common response formatting.
         */
        async generateContentStream(request) {
          const session = await this.createSession();
          const contents = await Promise.all(request.contents.map(_ChromeAdapterImpl.toLanguageModelMessage));
          const stream = session.promptStreaming(contents, this.onDeviceParams.promptOptions);
          return _ChromeAdapterImpl.toStreamResponse(stream);
        }
        async countTokens(_request) {
          throw new AIError(AIErrorCode.REQUEST_ERROR, "Count Tokens is not yet available for on-device model.");
        }
        /**
         * Asserts inference for the given request can be performed by an on-device model.
         */
        static isOnDeviceRequest(request) {
          if (request.contents.length === 0) {
            logger2.debug("Empty prompt rejected for on-device inference.");
            return false;
          }
          for (const content of request.contents) {
            if (content.parts.some((part) => "functionResponse" in part)) {
              logger2.debug(`Content with a function response part rejected for on-device inference.`);
              return false;
            }
            for (const part of content.parts) {
              if ("inlineData" in part && part.inlineData && _ChromeAdapterImpl.SUPPORTED_MIME_TYPES.indexOf(part.inlineData.mimeType) === -1) {
                logger2.debug(`Unsupported mime type "${part.inlineData.mimeType}" rejected for on-device inference.`);
                return false;
              }
            }
          }
          return true;
        }
        /**
         * Encapsulates logic to get availability and download a model if one is downloadable.
         */
        async downloadIfAvailable(onDownloadProgress) {
          const availability = await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);
          if (availability === Availability.DOWNLOADABLE || availability === Availability.DOWNLOADING) {
            this.download(onDownloadProgress);
          }
          return availability;
        }
        /**
         * Triggers out-of-band download of an on-device model.
         *
         * Chrome may automatically begin a download on startup or
         * it may trigger a download when code calls LanguageModel.create.
         *
         * Since Chrome manages the download, the SDK can only avoid redundant download requests by
         * tracking if a download has previously been requested.
         */
        download(onDownloadProgress) {
          if (this.downloadPromise) {
            return;
          }
          const options = { ...this.onDeviceParams.createOptions };
          if (options && !options.monitor && onDownloadProgress) {
            options.monitor = (m) => {
              m.addEventListener("downloadprogress", (e) => {
                onDownloadProgress(e.loaded);
              });
            };
          }
          this.downloadPromise = this.languageModelProvider?.create(options).finally(() => {
            this.downloadPromise = null;
          });
        }
        /**
         * Converts Firebase AI {@link Content} object to a Chrome {@link LanguageModelMessage} object.
         */
        static async toLanguageModelMessage(content) {
          const languageModelMessageContents = await Promise.all(content.parts.map(_ChromeAdapterImpl.toLanguageModelMessageContent));
          return {
            role: _ChromeAdapterImpl.toLanguageModelMessageRole(content.role),
            content: languageModelMessageContents
          };
        }
        /**
         * Converts a Firebase AI Part object to a Chrome LanguageModelMessageContent object.
         */
        static async toLanguageModelMessageContent(part) {
          if ("text" in part && typeof part.text === "string") {
            return {
              type: "text",
              value: part.text
            };
          } else if ("inlineData" in part && part.inlineData) {
            const formattedImageContent = await fetch(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            const imageBlob = await formattedImageContent.blob();
            const imageBitmap = await createImageBitmap(imageBlob);
            return {
              type: "image",
              value: imageBitmap
            };
          }
          throw new AIError(AIErrorCode.REQUEST_ERROR, `Processing of this Part type is not currently supported.`);
        }
        /**
         * Converts a Firebase AI {@link Role} string to a {@link LanguageModelMessageRole} string.
         */
        static toLanguageModelMessageRole(role) {
          return role === "model" ? "assistant" : "user";
        }
        /**
         * Abstracts Chrome session creation.
         *
         * Chrome uses a multi-turn session for all inference. Firebase AI uses single-turn for all
         * inference. To map the Firebase AI API to Chrome's API, the SDK creates a new session for all
         * inference.
         *
         * Chrome will remove a model from memory if it's no longer in use, so this method ensures a
         * new session is created before an old session is destroyed.
         */
        async createSession() {
          if (!this.languageModelProvider) {
            throw new AIError(AIErrorCode.UNSUPPORTED, "Chrome AI requested for unsupported browser version.");
          }
          const newSession = await this.languageModelProvider.create(this.onDeviceParams.createOptions);
          if (this.oldSession) {
            this.oldSession.destroy();
          }
          this.oldSession = newSession;
          return newSession;
        }
        /**
         * Formats string returned by Chrome as a {@link Response} returned by Firebase AI.
         */
        static toResponse(text) {
          return {
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [{ text }]
                  }
                }
              ]
            })
          };
        }
        /**
         * Formats string stream returned by Chrome as SSE returned by Firebase AI.
         */
        static toStreamResponse(stream) {
          const encoder = new TextEncoder();
          return {
            body: stream.pipeThrough(new TransformStream({
              transform(chunk, controller) {
                const json = JSON.stringify({
                  candidates: [
                    {
                      content: {
                        role: "model",
                        parts: [{ text: chunk }]
                      }
                    }
                  ]
                });
                controller.enqueue(encoder.encode(`data: ${json}

`));
              }
            }))
          };
        }
      };
      ChromeAdapterImpl.SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png"];
      AIService = class {
        constructor(app, backend, authProvider, appCheckProvider, chromeAdapterFactory2) {
          this.app = app;
          this.backend = backend;
          this.chromeAdapterFactory = chromeAdapterFactory2;
          const appCheck = appCheckProvider?.getImmediate({ optional: true });
          const auth = authProvider?.getImmediate({ optional: true });
          this.auth = auth || null;
          this.appCheck = appCheck || null;
        }
        _delete() {
          return Promise.resolve();
        }
        set options(optionsToSet) {
          this._options = optionsToSet;
        }
        get options() {
          return this._options;
        }
      };
      AIModel = class _AIModel {
        /**
         * Constructs a new instance of the {@link AIModel} class.
         *
         * This constructor should only be called from subclasses that provide
         * a model API.
         *
         * @param ai - an {@link AI} instance.
         * @param modelName - The name of the model being used. It can be in one of the following formats:
         * - `my-model` (short name, will resolve to `publishers/google/models/my-model`)
         * - `models/my-model` (will resolve to `publishers/google/models/my-model`)
         * - `publishers/my-publisher/models/my-model` (fully qualified model name)
         *
         * @throws If the `apiKey` or `projectId` fields are missing in your
         * Firebase config.
         *
         * @internal
         */
        constructor(ai, modelName) {
          this._apiSettings = initApiSettings(ai);
          this.model = _AIModel.normalizeModelName(modelName, this._apiSettings.backend.backendType);
        }
        /**
         * Normalizes the given model name to a fully qualified model resource name.
         *
         * @param modelName - The model name to normalize.
         * @returns The fully qualified model resource name.
         *
         * @internal
         */
        static normalizeModelName(modelName, backendType) {
          if (backendType === BackendType.GOOGLE_AI) {
            return _AIModel.normalizeGoogleAIModelName(modelName);
          } else {
            return _AIModel.normalizeVertexAIModelName(modelName);
          }
        }
        /**
         * @internal
         */
        static normalizeGoogleAIModelName(modelName) {
          return `models/${modelName}`;
        }
        /**
         * @internal
         */
        static normalizeVertexAIModelName(modelName) {
          let model;
          if (modelName.includes("/")) {
            if (modelName.startsWith("models/")) {
              model = `publishers/google/${modelName}`;
            } else {
              model = modelName;
            }
          } else {
            model = `publishers/google/models/${modelName}`;
          }
          return model;
        }
      };
      TIMEOUT_EXPIRED_MESSAGE = "Timeout has expired.";
      ABORT_ERROR_NAME = "AbortError";
      RequestURL = class {
        constructor(params) {
          this.params = params;
        }
        toString() {
          const url = new URL(this.baseUrl);
          url.pathname = this.pathname;
          url.search = this.queryParams.toString();
          return url.toString();
        }
        get pathname() {
          if (this.params.templateId) {
            return `${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project, this.params.templateId)}:${this.params.task}`;
          } else {
            return `${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project, this.params.model)}:${this.params.task}`;
          }
        }
        get baseUrl() {
          return this.params.singleRequestOptions?.baseUrl ?? `https://${DEFAULT_DOMAIN}`;
        }
        get queryParams() {
          const params = new URLSearchParams();
          if (this.params.stream) {
            params.set("alt", "sse");
          }
          return params;
        }
      };
      badFinishReasons = [
        FinishReason.RECITATION,
        FinishReason.SAFETY,
        FinishReason.BLOCKLIST,
        FinishReason.PROHIBITED_CONTENT,
        FinishReason.SPII,
        FinishReason.MALFORMED_FUNCTION_CALL,
        FinishReason.IMAGE_SAFETY,
        FinishReason.IMAGE_PROHIBITED_CONTENT,
        FinishReason.IMAGE_OTHER,
        FinishReason.NO_IMAGE,
        FinishReason.IMAGE_RECITATION,
        FinishReason.LANGUAGE,
        FinishReason.UNEXPECTED_TOOL_CALL,
        FinishReason.TOO_MANY_TOOL_CALLS,
        FinishReason.MISSING_THOUGHT_SIGNATURE,
        FinishReason.MALFORMED_RESPONSE
      ];
      responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
      errorsCausingFallback = [
        // most network errors
        AIErrorCode.FETCH_ERROR,
        // fallback code for all other errors in makeRequest
        AIErrorCode.ERROR,
        // error due to API not being enabled in project
        AIErrorCode.API_NOT_ENABLED
      ];
      SILENT_ERROR = "SILENT_ERROR";
      DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS = 10;
      ChatSessionBase = class {
        constructor(apiSettings, params, requestOptions) {
          this.params = params;
          this.requestOptions = requestOptions;
          this._history = [];
          this._sendPromise = Promise.resolve();
          this._apiSettings = apiSettings;
        }
        /**
         * Gets the chat history so far. Blocked prompts are not added to history.
         * Neither blocked candidates nor the prompts that generated them are added
         * to history.
         */
        async getHistory() {
          await this._sendPromise;
          return deepCopy(this._history).map((content) => ({
            ...content,
            parts: content.parts ? content.parts.map(assignPartType) : []
          }));
        }
        /**
         * Sends a chat message and receives a non-streaming
         * {@link GenerateContentResult}
         * @internal
         */
        async _sendMessage(request, singleRequestOptions) {
          let finalResult = {};
          await this._sendPromise;
          const tempHistory = [];
          this._sendPromise = this._sendPromise.then(async () => {
            let functionCalls;
            let functionCallTurnCount = 0;
            const functionCallMaxTurns = this.requestOptions?.maxSequentialFunctionCalls ?? DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS;
            do {
              let formattedContent;
              if (functionCalls) {
                functionCallTurnCount++;
                const functionResponseParts = await this._callFunctionsAsNeeded(functionCalls);
                formattedContent = formatNewContent(functionResponseParts);
              } else {
                formattedContent = formatNewContent(request);
              }
              const formattedRequest = this._formatRequest(formattedContent, [
                ...tempHistory
              ]);
              tempHistory.push(formattedContent);
              const result = await this._callGenerateContent(formattedRequest, singleRequestOptions);
              if (result) {
                finalResult = result;
                functionCalls = this._getCallableFunctionCalls(result.response);
                if (result.response.candidates && result.response.candidates.length > 0) {
                  const responseContent = {
                    parts: result.response.candidates?.[0].content.parts || [],
                    // Response seems to come back without a role set.
                    role: result.response.candidates?.[0].content.role || "model"
                  };
                  tempHistory.push(deepCopy(responseContent));
                } else {
                  const blockErrorMessage = formatBlockErrorMessage(result.response);
                  if (blockErrorMessage) {
                    logger2.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                  }
                }
              } else {
                functionCalls = void 0;
              }
            } while (functionCalls && functionCallTurnCount < functionCallMaxTurns);
            if (functionCalls && functionCallTurnCount >= functionCallMaxTurns) {
              logger2.warn(`Automatic function calling exceeded the limit of ${functionCallMaxTurns} function calls. Returning last model response.`);
            }
          });
          await this._sendPromise;
          this._history = this._history.concat(tempHistory);
          return finalResult;
        }
        /**
         * Sends a chat message and receives the response as a
         * {@link GenerateContentStreamResult} containing an iterable stream
         * and a response promise.
         * @internal
         */
        async _sendMessageStream(request, singleRequestOptions) {
          await this._sendPromise;
          const tempHistory = [];
          const callGenerateContentStream = async () => {
            let functionCalls;
            let functionCallTurnCount = 0;
            const functionCallMaxTurns = this.requestOptions?.maxSequentialFunctionCalls ?? DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS;
            let result;
            do {
              let formattedContent;
              if (functionCalls) {
                functionCallTurnCount++;
                const functionResponseParts = await this._callFunctionsAsNeeded(functionCalls);
                formattedContent = formatNewContent(functionResponseParts);
              } else {
                formattedContent = formatNewContent(request);
              }
              const formattedRequest = this._formatRequest(formattedContent, [
                ...tempHistory
              ]);
              tempHistory.push(formattedContent);
              result = await this._callGenerateContentStream(formattedRequest, singleRequestOptions);
              functionCalls = this._getCallableFunctionCalls(result.firstValue);
              if (functionCalls && result.firstValue && result.firstValue.candidates && result.firstValue.candidates.length > 0) {
                const responseContent = {
                  ...result.firstValue.candidates[0].content
                };
                if (!responseContent.role) {
                  responseContent.role = "model";
                }
                tempHistory.push(responseContent);
              }
            } while (functionCalls && functionCallTurnCount < functionCallMaxTurns);
            if (functionCalls && functionCallTurnCount >= functionCallMaxTurns) {
              logger2.warn(`Automatic function calling exceeded the limit of ${functionCallMaxTurns} function calls. Returning last model response.`);
            }
            return { stream: result.stream, response: result.response };
          };
          const streamPromise = callGenerateContentStream();
          this._sendPromise = this._sendPromise.then(async () => streamPromise).catch((_ignored) => {
            throw new Error(SILENT_ERROR);
          }).then((streamResult) => streamResult.response).then((response) => {
            if (response.candidates && response.candidates.length > 0) {
              this._history = this._history.concat(tempHistory);
              const responseContent = { ...response.candidates[0].content };
              if (!responseContent.role) {
                responseContent.role = "model";
              }
              this._history.push(deepCopy(responseContent));
            } else {
              const blockErrorMessage = formatBlockErrorMessage(response);
              if (blockErrorMessage) {
                logger2.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
              }
            }
          }).catch((e) => {
            if (e.message !== SILENT_ERROR && e.name !== "AbortError") {
              logger2.error(e);
            }
          });
          return streamPromise;
        }
        /**
         * Get function calls that the SDK has references to actually call.
         * This is all-or-nothing. If the model is requesting multiple
         * function calls, all of them must have references in order for
         * automatic function calling to work.
         *
         * @internal
         */
        _getCallableFunctionCalls(response) {
          const functionDeclarationsTool = this.params?.tools?.find((tool) => tool.functionDeclarations);
          if (!functionDeclarationsTool?.functionDeclarations) {
            return;
          }
          const functionCalls = getFunctionCalls(response);
          if (!functionCalls) {
            return;
          }
          for (const functionCall of functionCalls) {
            const hasFunctionReference = functionDeclarationsTool.functionDeclarations?.some((declaration) => declaration.name === functionCall.name && typeof declaration.functionReference === "function");
            if (!hasFunctionReference) {
              return;
            }
          }
          return functionCalls;
        }
        /**
         * Call user-defined functions if requested by the model, and return
         * the response that should be sent to the model.
         * @internal
         */
        async _callFunctionsAsNeeded(functionCalls) {
          const activeCallList = [];
          const promiseList = [];
          const functionDeclarationsTool = this.params?.tools?.find((tool) => tool.functionDeclarations);
          if (functionDeclarationsTool && functionDeclarationsTool.functionDeclarations) {
            for (const functionCall of functionCalls) {
              const functionDeclaration = functionDeclarationsTool.functionDeclarations.find((declaration) => declaration.name === functionCall.name);
              if (functionDeclaration?.functionReference) {
                const results = Promise.resolve(functionDeclaration.functionReference(functionCall.args)).catch((e) => {
                  const wrappedError = new AIError(AIErrorCode.ERROR, `Error in user-defined function "${functionDeclaration.name}": ${e.message}`);
                  wrappedError.stack = e.stack;
                  throw wrappedError;
                });
                activeCallList.push({
                  name: functionCall.name,
                  id: functionCall.id,
                  results
                });
                promiseList.push(results);
              }
            }
            await Promise.all(promiseList);
            const functionResponseParts = [];
            for (const { name: name5, id, results } of activeCallList) {
              const functionResponse = {
                name: name5,
                response: await results
              };
              if (id) {
                functionResponse.id = id;
              }
              functionResponseParts.push({
                type: "functionResponse",
                functionResponse
              });
            }
            return functionResponseParts;
          } else {
            throw new AIError(AIErrorCode.REQUEST_ERROR, `No function declarations were provided in "tools".`);
          }
        }
      };
      VALID_PART_FIELDS = [
        "text",
        "inlineData",
        "functionCall",
        "functionResponse",
        "thought",
        "thoughtSignature"
      ];
      VALID_PARTS_PER_ROLE = {
        user: ["text", "inlineData", "functionResponse"],
        function: ["functionResponse"],
        model: ["text", "functionCall", "thought", "thoughtSignature"],
        // System instructions shouldn't be in history anyway.
        system: ["text"]
      };
      VALID_PREVIOUS_CONTENT_ROLES = {
        user: ["model"],
        function: ["model"],
        model: ["user", "function"],
        // System instructions shouldn't be in history.
        system: []
      };
      ChatSessionImpl = class extends ChatSessionBase {
        constructor(apiSettings, model, chromeAdapter, params, requestOptions) {
          super(apiSettings, params, requestOptions);
          this.model = model;
          this.chromeAdapter = chromeAdapter;
          this.params = params;
          this.requestOptions = requestOptions;
          if (params?.history) {
            validateChatHistory(params.history);
            this._history = deepCopy(params.history);
          }
          if (this.params?.systemInstruction != null) {
            this.params = {
              ...this.params,
              systemInstruction: formatSystemInstruction(this.params.systemInstruction)
            };
          }
        }
        /**
         * Format Content into a request for generateContent or
         * generateContentStream.
         * @internal
         */
        _formatRequest(incomingContent, tempHistory) {
          return {
            safetySettings: this.params?.safetySettings,
            generationConfig: this.params?.generationConfig,
            tools: this.params?.tools,
            toolConfig: this.params?.toolConfig,
            systemInstruction: this.params?.systemInstruction,
            contents: [...this._history, ...tempHistory, incomingContent]
          };
        }
        /**
         * Calls default generateContent() (versus a specialized one like
         * templateGenerateContent).
         * @internal
         */
        _callGenerateContent(formattedRequest, singleRequestOptions) {
          return generateContent(this._apiSettings, this.model, formattedRequest, this.chromeAdapter, {
            ...this.requestOptions,
            ...singleRequestOptions
          });
        }
        /**
         * Calls default generateContentStream() (versus a specialized one like
         * templateGenerateContentStream).
         * @internal
         */
        _callGenerateContentStream(formattedRequest, singleRequestOptions) {
          return generateContentStream(this._apiSettings, this.model, formattedRequest, this.chromeAdapter, {
            ...this.requestOptions,
            ...singleRequestOptions
          });
        }
        /**
         * Sends a chat message and receives a non-streaming
         * {@link GenerateContentResult}
         */
        async sendMessage(request, singleRequestOptions) {
          return this._sendMessage(request, singleRequestOptions);
        }
        /**
         * Sends a chat message and receives the response as a
         * {@link GenerateContentStreamResult} containing an iterable stream
         * and a response promise.
         */
        async sendMessageStream(request, singleRequestOptions) {
          return this._sendMessageStream(request, singleRequestOptions);
        }
      };
      GenerativeModel = class extends AIModel {
        constructor(ai, modelParams, requestOptions, chromeAdapter) {
          super(ai, modelParams.model);
          this.chromeAdapter = chromeAdapter;
          this.generationConfig = modelParams.generationConfig || {};
          validateGenerationConfig(this.generationConfig);
          this.safetySettings = modelParams.safetySettings || [];
          this.tools = modelParams.tools;
          this.toolConfig = modelParams.toolConfig;
          this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
          this.requestOptions = requestOptions || {};
        }
        /**
         * Initializes on-device models.
         *
         * @remarks
         * This may trigger a download on first
         * use. Wait for this promise to complete before calling inference
         * methods if you want to ensure the device models are ready before
         * any calls. Calling inference methods before the device is ready
         * will result in a cloud fallback if `inferenceMode` is set to
         * `PREFER_ON_DEVICE`, and an error if set to `ONLY_ON_DEVICE`.
         *
         * IMPORTANT: This call must be made on or after a user has interacted
         * with the page (for example, through a button click or key press).
         * If it is called without a user interaction, and it requires a download,
         * this will cause an error.
         *
         * See the
         * {@link https://developer.chrome.com/docs/ai/prompt-api#use_the_prompt_api | Prompt API docs }
         * for more details on this requirement.
         *
         * @param onDownloadProgress - A callback called repeatedly as the
         * download progresses that provides a `progressValue` between 0
         * and 1 representing how much of the download is complete. This
         * will be ignored if `monitor` was populated in
         * {@link LanguageModelCreateOptions}.
         *
         * @public
         */
        async initializeDeviceModel(onDownloadProgress) {
          if (!this.chromeAdapter || this.chromeAdapter.mode === InferenceMode.ONLY_IN_CLOUD) {
            return;
          }
          const availability = await this.chromeAdapter.downloadIfAvailable(onDownloadProgress);
          if (availability === Availability.UNAVAILABLE) {
            const notEnabledError = new AIError(AIErrorCode.API_NOT_ENABLED, "Local LanguageModel API not available in this environment.");
            if (this.chromeAdapter.mode === InferenceMode.ONLY_ON_DEVICE) {
              throw notEnabledError;
            } else {
              logger2.debug(notEnabledError.message);
            }
          }
          await this.chromeAdapter.downloadPromise;
        }
        /**
         * Makes a single non-streaming call to the model
         * and returns an object containing a single {@link GenerateContentResponse}.
         */
        async generateContent(request, singleRequestOptions) {
          const formattedParams = formatGenerateContentInput(request);
          return generateContent(
            this._apiSettings,
            this.model,
            {
              generationConfig: this.generationConfig,
              safetySettings: this.safetySettings,
              tools: this.tools,
              toolConfig: this.toolConfig,
              systemInstruction: this.systemInstruction,
              ...formattedParams
            },
            this.chromeAdapter,
            // Merge request options
            {
              ...this.requestOptions,
              ...singleRequestOptions
            }
          );
        }
        /**
         * Makes a single streaming call to the model
         * and returns an object containing an iterable stream that iterates
         * over all chunks in the streaming response as well as
         * a promise that returns the final aggregated response.
         */
        async generateContentStream(request, singleRequestOptions) {
          const formattedParams = formatGenerateContentInput(request);
          const { stream, response } = await generateContentStream(
            this._apiSettings,
            this.model,
            {
              generationConfig: this.generationConfig,
              safetySettings: this.safetySettings,
              tools: this.tools,
              toolConfig: this.toolConfig,
              systemInstruction: this.systemInstruction,
              ...formattedParams
            },
            this.chromeAdapter,
            // Merge request options
            {
              ...this.requestOptions,
              ...singleRequestOptions
            }
          );
          return { stream, response };
        }
        /**
         * Gets a new {@link ChatSession} instance which can be used for
         * multi-turn chats.
         */
        startChat(startChatParams) {
          return new ChatSessionImpl(this._apiSettings, this.model, this.chromeAdapter, {
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            /**
             * Overrides params inherited from GenerativeModel with those explicitly set in the
             * StartChatParams. For example, if startChatParams.generationConfig is set, it'll override
             * this.generationConfig.
             */
            ...startChatParams
          }, this.requestOptions);
        }
        /**
         * Counts the tokens in the provided request.
         */
        async countTokens(request, singleRequestOptions) {
          const formattedParams = formatGenerateContentInput(request);
          return countTokens(
            this._apiSettings,
            this.model,
            formattedParams,
            this.chromeAdapter,
            // Merge request options
            {
              ...this.requestOptions,
              ...singleRequestOptions
            }
          );
        }
      };
      AUDIO_PROCESSOR_NAME = "audio-processor";
      audioProcessorWorkletString = `
  class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.targetSampleRate = options.processorOptions.targetSampleRate;
      // 'sampleRate' is a global variable available inside the AudioWorkletGlobalScope,
      // representing the native sample rate of the AudioContext.
      this.inputSampleRate = sampleRate;
    }

    /**
     * This method is called by the browser's audio engine for each block of audio data.
     * Input is a single input, with a single channel (input[0][0]).
     */
    process(inputs) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const pcmData = input[0]; // Float32Array of raw audio samples.
        
        // Simple linear interpolation for resampling.
        const resampled = new Float32Array(Math.round(pcmData.length * this.targetSampleRate / this.inputSampleRate));
        const ratio = pcmData.length / resampled.length;
        for (let i = 0; i < resampled.length; i++) {
          resampled[i] = pcmData[Math.floor(i * ratio)];
        }

        // Convert Float32 (-1, 1) samples to Int16 (-32768, 32767)
        const resampledInt16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const sample = Math.max(-1, Math.min(1, resampled[i]));
          if (sample < 0) {
            resampledInt16[i] = sample * 32768;
          } else {
            resampledInt16[i] = sample * 32767;
          }
        }
        
        this.port.postMessage(resampledInt16);
      }
      // Return true to keep the processor alive and processing the next audio block.
      return true;
    }
  }

  // Register the processor with a name that can be used to instantiate it from the main thread.
  registerProcessor('${AUDIO_PROCESSOR_NAME}', AudioProcessor);
`;
      hybridParamKeys = [
        "mode",
        "onDeviceParams",
        "inCloudParams"
      ];
      registerAI();
    }
  });

  // node_modules/firebase/ai/dist/esm/index.esm.js
  var init_index_esm7 = __esm({
    "node_modules/firebase/ai/dist/esm/index.esm.js"() {
      init_index_esm6();
    }
  });

  // node_modules/@firebase/app-check/dist/esm/index.esm.js
  function getStateReference(app) {
    return APP_CHECK_STATES.get(app) || { ...DEFAULT_STATE };
  }
  function setInitialState(app, state) {
    APP_CHECK_STATES.set(app, state);
    return APP_CHECK_STATES.get(app);
  }
  function getDebugState() {
    return DEBUG_STATE;
  }
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  function ensureActivated(app) {
    if (!getStateReference(app).activated) {
      throw ERROR_FACTORY2.create("use-before-activation", {
        appName: app.name
      });
    }
  }
  async function exchangeToken({ url, body }, heartbeatServiceProvider) {
    const headers = {
      "Content-Type": "application/json"
    };
    const heartbeatService = heartbeatServiceProvider.getImmediate({
      optional: true
    });
    if (heartbeatService) {
      const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers["X-Firebase-Client"] = heartbeatsHeader;
      }
    }
    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers
    };
    let response;
    try {
      response = await fetch(url, options);
    } catch (originalError) {
      throw ERROR_FACTORY2.create("fetch-network-error", {
        originalErrorMessage: originalError?.message
      });
    }
    if (response.status !== 200) {
      throw ERROR_FACTORY2.create("fetch-status-error", {
        httpStatus: response.status
      });
    }
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (originalError) {
      throw ERROR_FACTORY2.create("fetch-parse-error", {
        originalErrorMessage: originalError?.message
      });
    }
    const match = responseBody.ttl.match(/^([\d.]+)(s)$/);
    if (!match || !match[2] || isNaN(Number(match[1]))) {
      throw ERROR_FACTORY2.create("fetch-parse-error", {
        originalErrorMessage: `ttl field (timeToLive) is not in standard Protobuf Duration format: ${responseBody.ttl}`
      });
    }
    const timeToLiveAsNumber = Number(match[1]) * 1e3;
    const now = Date.now();
    return {
      token: responseBody.token,
      expireTimeMillis: now + timeToLiveAsNumber,
      issuedAtTimeMillis: now
    };
  }
  function getExchangeDebugTokenRequest(app, debugToken) {
    const { projectId, appId, apiKey } = app.options;
    return {
      url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_DEBUG_TOKEN_METHOD}?key=${apiKey}`,
      body: {
        // eslint-disable-next-line
        debug_token: debugToken
      }
    };
  }
  function getDBPromise() {
    if (dbPromise2) {
      return dbPromise2;
    }
    dbPromise2 = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME2, DB_VERSION2);
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(ERROR_FACTORY2.create("storage-open", {
            originalErrorMessage: event.target.error?.message
          }));
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          switch (event.oldVersion) {
            case 0:
              db.createObjectStore(STORE_NAME2, {
                keyPath: "compositeKey"
              });
          }
        };
      } catch (e) {
        reject(ERROR_FACTORY2.create("storage-open", {
          originalErrorMessage: e?.message
        }));
      }
    });
    return dbPromise2;
  }
  function readTokenFromIndexedDB(app) {
    return read(computeKey2(app));
  }
  function writeTokenToIndexedDB(app, token) {
    return write(computeKey2(app), token);
  }
  function writeDebugTokenToIndexedDB(token) {
    return write(DEBUG_TOKEN_KEY, token);
  }
  function readDebugTokenFromIndexedDB() {
    return read(DEBUG_TOKEN_KEY);
  }
  async function write(key, value) {
    const db = await getDBPromise();
    const transaction = db.transaction(STORE_NAME2, "readwrite");
    const store = transaction.objectStore(STORE_NAME2);
    const request = store.put({
      compositeKey: key,
      value
    });
    return new Promise((resolve, reject) => {
      request.onsuccess = (_event) => {
        resolve();
      };
      transaction.onerror = (event) => {
        reject(ERROR_FACTORY2.create("storage-set", {
          originalErrorMessage: event.target.error?.message
        }));
      };
    });
  }
  async function read(key) {
    const db = await getDBPromise();
    const transaction = db.transaction(STORE_NAME2, "readonly");
    const store = transaction.objectStore(STORE_NAME2);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result.value);
        } else {
          resolve(void 0);
        }
      };
      transaction.onerror = (event) => {
        reject(ERROR_FACTORY2.create("storage-get", {
          originalErrorMessage: event.target.error?.message
        }));
      };
    });
  }
  function computeKey2(app) {
    return `${app.options.appId}-${app.name}`;
  }
  async function readTokenFromStorage(app) {
    if (isIndexedDBAvailable()) {
      let token = void 0;
      try {
        token = await readTokenFromIndexedDB(app);
      } catch (e) {
        logger3.warn(`Failed to read token from IndexedDB. Error: ${e}`);
      }
      return token;
    }
    return void 0;
  }
  function writeTokenToStorage(app, token) {
    if (isIndexedDBAvailable()) {
      return writeTokenToIndexedDB(app, token).catch((e) => {
        logger3.warn(`Failed to write token to IndexedDB. Error: ${e}`);
      });
    }
    return Promise.resolve();
  }
  async function readOrCreateDebugTokenFromStorage(app) {
    let existingDebugToken = void 0;
    try {
      existingDebugToken = await readDebugTokenFromIndexedDB();
    } catch (_e) {
    }
    if (!existingDebugToken) {
      const newToken = crypto.randomUUID();
      let message = `To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${newToken}

`;
      const appId = app?.options.appId;
      const projectId = app?.options.projectId;
      if (projectId && appId) {
        message += `You can do so in the Firebase Console:
https://console.firebase.google.com/project/${projectId}/appcheck/apps?selectedAppId=${appId}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${newToken} --project ${projectId} --app ${appId}

`;
      } else {
        message += `You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`;
      }
      message += `Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`;
      console.log(message);
      writeDebugTokenToIndexedDB(newToken).catch((e) => logger3.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`));
      return newToken;
    } else {
      return existingDebugToken;
    }
  }
  function isDebugMode() {
    const debugState = getDebugState();
    return debugState.enabled;
  }
  async function getDebugToken() {
    const state = getDebugState();
    if (state.enabled && state.token) {
      return state.token.promise;
    } else {
      throw Error(`
            Can't get debug token in production mode.
        `);
    }
  }
  function initializeDebugMode(app) {
    const globals = getGlobal();
    const debugState = getDebugState();
    debugState.initialized = true;
    if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== "string" && globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== true) {
      return;
    }
    debugState.enabled = true;
    const deferredToken = new Deferred();
    debugState.token = deferredToken;
    if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN === "string") {
      deferredToken.resolve(globals.FIREBASE_APPCHECK_DEBUG_TOKEN);
    } else {
      deferredToken.resolve(readOrCreateDebugTokenFromStorage(app));
    }
  }
  function formatDummyToken(tokenErrorData) {
    return base64.encodeString(
      JSON.stringify(tokenErrorData),
      /* webSafe= */
      false
    );
  }
  async function getToken$2(appCheck, forceRefresh = false, shouldLogErrors = false) {
    const app = appCheck.app;
    ensureActivated(app);
    const state = getStateReference(app);
    let token = state.token;
    let error = void 0;
    if (token && !isValid(token)) {
      state.token = void 0;
      token = void 0;
    }
    if (!token) {
      const cachedToken = await state.cachedTokenPromise;
      if (cachedToken) {
        if (isValid(cachedToken)) {
          token = cachedToken;
        } else {
          await writeTokenToStorage(app, void 0);
        }
      }
    }
    if (!forceRefresh && token && isValid(token)) {
      return {
        token: token.token
      };
    }
    let shouldCallListeners = false;
    if (isDebugMode()) {
      try {
        const debugToken = await getDebugToken();
        if (!state.exchangeTokenPromise) {
          state.exchangeTokenPromise = exchangeToken(getExchangeDebugTokenRequest(app, debugToken), appCheck.heartbeatServiceProvider).finally(() => {
            state.exchangeTokenPromise = void 0;
          });
          shouldCallListeners = true;
        }
        const tokenFromDebugExchange = await state.exchangeTokenPromise;
        await writeTokenToStorage(app, tokenFromDebugExchange);
        state.token = tokenFromDebugExchange;
        return { token: tokenFromDebugExchange.token };
      } catch (e) {
        if (e.code === `appCheck/${"throttled"}` || e.code === `appCheck/${"initial-throttle"}`) {
          logger3.warn(e.message);
        } else if (shouldLogErrors) {
          logger3.error(e);
        }
        return makeDummyTokenResult(e);
      }
    }
    try {
      if (!state.exchangeTokenPromise) {
        state.exchangeTokenPromise = state.provider.getToken().finally(() => {
          state.exchangeTokenPromise = void 0;
        });
        shouldCallListeners = true;
      }
      token = await getStateReference(app).exchangeTokenPromise;
    } catch (e) {
      if (e.code === `appCheck/${"throttled"}` || e.code === `appCheck/${"initial-throttle"}`) {
        logger3.warn(e.message);
      } else if (shouldLogErrors) {
        logger3.error(e);
      }
      error = e;
    }
    let interopTokenResult;
    if (!token) {
      interopTokenResult = makeDummyTokenResult(error);
    } else if (error) {
      if (isValid(token)) {
        interopTokenResult = {
          token: token.token,
          internalError: error
        };
      } else {
        interopTokenResult = makeDummyTokenResult(error);
      }
    } else {
      interopTokenResult = {
        token: token.token
      };
      state.token = token;
      await writeTokenToStorage(app, token);
    }
    if (shouldCallListeners) {
      notifyTokenListeners(app, interopTokenResult);
    }
    return interopTokenResult;
  }
  async function getLimitedUseToken$1(appCheck) {
    const app = appCheck.app;
    ensureActivated(app);
    const { provider } = getStateReference(app);
    if (isDebugMode()) {
      const debugToken = await getDebugToken();
      const request = getExchangeDebugTokenRequest(app, debugToken);
      request.body["limited_use"] = true;
      const { token } = await exchangeToken(request, appCheck.heartbeatServiceProvider);
      return { token };
    } else {
      const { token } = await provider.getToken(
        true
        /* isLimitedUse */
      );
      return { token };
    }
  }
  function addTokenListener(appCheck, type, listener, onError) {
    const { app } = appCheck;
    const state = getStateReference(app);
    const tokenObserver = {
      next: listener,
      error: onError,
      type
    };
    state.tokenObservers = [...state.tokenObservers, tokenObserver];
    if (state.token && isValid(state.token)) {
      const validToken = state.token;
      Promise.resolve().then(() => {
        listener({ token: validToken.token });
        initTokenRefresher(appCheck);
      }).catch(() => {
      });
    }
    void state.cachedTokenPromise.then(() => initTokenRefresher(appCheck));
  }
  function removeTokenListener(app, listener) {
    const state = getStateReference(app);
    const newObservers = state.tokenObservers.filter((tokenObserver) => tokenObserver.next !== listener);
    if (newObservers.length === 0 && state.tokenRefresher && state.tokenRefresher.isRunning()) {
      state.tokenRefresher.stop();
    }
    state.tokenObservers = newObservers;
  }
  function initTokenRefresher(appCheck) {
    const { app } = appCheck;
    const state = getStateReference(app);
    let refresher = state.tokenRefresher;
    if (!refresher) {
      refresher = createTokenRefresher(appCheck);
      state.tokenRefresher = refresher;
    }
    if (!refresher.isRunning() && state.isTokenAutoRefreshEnabled) {
      refresher.start();
    }
  }
  function createTokenRefresher(appCheck) {
    const { app } = appCheck;
    return new Refresher(
      // Keep in mind when this fails for any reason other than the ones
      // for which we should retry, it will effectively stop the proactive refresh.
      async () => {
        const state = getStateReference(app);
        let result;
        if (!state.token) {
          result = await getToken$2(appCheck);
        } else {
          result = await getToken$2(appCheck, true);
        }
        if (result.error) {
          throw result.error;
        }
        if (result.internalError) {
          throw result.internalError;
        }
      },
      () => {
        return true;
      },
      () => {
        const state = getStateReference(app);
        if (state.token) {
          let nextRefreshTimeMillis = state.token.issuedAtTimeMillis + (state.token.expireTimeMillis - state.token.issuedAtTimeMillis) * 0.5 + 5 * 60 * 1e3;
          const latestAllowableRefresh = state.token.expireTimeMillis - 5 * 60 * 1e3;
          nextRefreshTimeMillis = Math.min(nextRefreshTimeMillis, latestAllowableRefresh);
          return Math.max(0, nextRefreshTimeMillis - Date.now());
        } else {
          return 0;
        }
      },
      TOKEN_REFRESH_TIME.RETRIAL_MIN_WAIT,
      TOKEN_REFRESH_TIME.RETRIAL_MAX_WAIT
    );
  }
  function notifyTokenListeners(app, token) {
    const observers = getStateReference(app).tokenObservers;
    for (const observer of observers) {
      try {
        if (observer.type === "EXTERNAL" && token.error != null) {
          observer.error(token.error);
        } else {
          observer.next(token);
        }
      } catch (e) {
      }
    }
  }
  function isValid(token) {
    return token.expireTimeMillis - Date.now() > 0;
  }
  function makeDummyTokenResult(error) {
    return {
      token: formatDummyToken(defaultTokenErrorData),
      error
    };
  }
  function factory2(app, heartbeatServiceProvider) {
    return new AppCheckService(app, heartbeatServiceProvider);
  }
  function internalFactory(appCheck) {
    return {
      getToken: (forceRefresh) => getToken$2(appCheck, forceRefresh),
      getLimitedUseToken: () => getLimitedUseToken$1(appCheck),
      addTokenListener: (listener) => addTokenListener(appCheck, "INTERNAL", listener),
      removeTokenListener: (listener) => removeTokenListener(appCheck.app, listener)
    };
  }
  function initializeAppCheck(app = getApp(), options) {
    app = getModularInstance(app);
    const provider = _getProvider(app, "app-check");
    if (!getDebugState().initialized) {
      initializeDebugMode(app);
    }
    if (isDebugMode()) {
      void getDebugToken().then((token) => {
        console.log(`Firebase App Check debug token: ${token}`);
      });
    }
    if (provider.isInitialized()) {
      const existingInstance = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (initialOptions && !!initialOptions.isTokenAutoRefreshEnabled === !!options.isTokenAutoRefreshEnabled && initialOptions.provider?.isEqual(options.provider)) {
        return existingInstance;
      } else {
        throw ERROR_FACTORY2.create("already-initialized", {
          appName: app.name
        });
      }
    }
    const appCheck = provider.initialize({ options });
    _activate(app, options.provider, options.isTokenAutoRefreshEnabled);
    if (getStateReference(app).isTokenAutoRefreshEnabled) {
      addTokenListener(appCheck, "INTERNAL", () => {
      });
    }
    return appCheck;
  }
  function _activate(app, provider, isTokenAutoRefreshEnabled = false) {
    const state = setInitialState(app, { ...DEFAULT_STATE });
    state.activated = true;
    state.provider = provider;
    state.cachedTokenPromise = readTokenFromStorage(app).then((cachedToken) => {
      if (cachedToken && isValid(cachedToken)) {
        state.token = cachedToken;
        notifyTokenListeners(app, { token: cachedToken.token });
      }
      return cachedToken;
    });
    state.isTokenAutoRefreshEnabled = isTokenAutoRefreshEnabled && app.automaticDataCollectionEnabled;
    if (!app.automaticDataCollectionEnabled && isTokenAutoRefreshEnabled) {
      logger3.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh.");
    }
    state.provider.initialize(app);
  }
  function registerAppCheck() {
    _registerComponent(new Component(
      APP_CHECK_NAME,
      (container) => {
        const app = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        return factory2(app, heartbeatServiceProvider);
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ).setInstanceCreatedCallback((container, _identifier, _appcheckService) => {
      container.getProvider(APP_CHECK_NAME_INTERNAL).initialize();
    }));
    _registerComponent(new Component(
      APP_CHECK_NAME_INTERNAL,
      (container) => {
        const appCheck = container.getProvider("app-check").getImmediate();
        return internalFactory(appCheck);
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ));
    registerVersion(name4, version3);
  }
  var APP_CHECK_STATES, DEFAULT_STATE, DEBUG_STATE, BASE_ENDPOINT, EXCHANGE_DEBUG_TOKEN_METHOD, TOKEN_REFRESH_TIME, ONE_DAY, Refresher, ERRORS2, ERROR_FACTORY2, DB_NAME2, DB_VERSION2, STORE_NAME2, DEBUG_TOKEN_KEY, dbPromise2, logger3, defaultTokenErrorData, AppCheckService, name4, version3, APP_CHECK_NAME, APP_CHECK_NAME_INTERNAL;
  var init_index_esm8 = __esm({
    "node_modules/@firebase/app-check/dist/esm/index.esm.js"() {
      init_index_esm4();
      init_index_esm2();
      init_index_esm();
      init_index_esm3();
      APP_CHECK_STATES = /* @__PURE__ */ new Map();
      DEFAULT_STATE = {
        activated: false,
        tokenObservers: []
      };
      DEBUG_STATE = {
        initialized: false,
        enabled: false
      };
      BASE_ENDPOINT = "https://content-firebaseappcheck.googleapis.com/v1";
      EXCHANGE_DEBUG_TOKEN_METHOD = "exchangeDebugToken";
      TOKEN_REFRESH_TIME = {
        /**
         * This is the first retrial wait after an error. This is currently
         * 30 seconds.
         */
        RETRIAL_MIN_WAIT: 30 * 1e3,
        /**
         * This is the maximum retrial wait, currently 16 minutes.
         */
        RETRIAL_MAX_WAIT: 16 * 60 * 1e3
      };
      ONE_DAY = 24 * 60 * 60 * 1e3;
      Refresher = class {
        constructor(operation, retryPolicy, getWaitDuration, lowerBound, upperBound) {
          this.operation = operation;
          this.retryPolicy = retryPolicy;
          this.getWaitDuration = getWaitDuration;
          this.lowerBound = lowerBound;
          this.upperBound = upperBound;
          this.pending = null;
          this.nextErrorWaitInterval = lowerBound;
          if (lowerBound > upperBound) {
            throw new Error("Proactive refresh lower bound greater than upper bound!");
          }
        }
        start() {
          this.nextErrorWaitInterval = this.lowerBound;
          this.process(true).catch(() => {
          });
        }
        stop() {
          if (this.pending) {
            this.pending.reject("cancelled");
            this.pending = null;
          }
        }
        isRunning() {
          return !!this.pending;
        }
        async process(hasSucceeded) {
          this.stop();
          try {
            this.pending = new Deferred();
            this.pending.promise.catch((_e) => {
            });
            await sleep(this.getNextRun(hasSucceeded));
            this.pending.resolve();
            await this.pending.promise;
            this.pending = new Deferred();
            this.pending.promise.catch((_e) => {
            });
            await this.operation();
            this.pending.resolve();
            await this.pending.promise;
            this.process(true).catch(() => {
            });
          } catch (error) {
            if (this.retryPolicy(error)) {
              this.process(false).catch(() => {
              });
            } else {
              this.stop();
            }
          }
        }
        getNextRun(hasSucceeded) {
          if (hasSucceeded) {
            this.nextErrorWaitInterval = this.lowerBound;
            return this.getWaitDuration();
          } else {
            const currentErrorWaitInterval = this.nextErrorWaitInterval;
            this.nextErrorWaitInterval *= 2;
            if (this.nextErrorWaitInterval > this.upperBound) {
              this.nextErrorWaitInterval = this.upperBound;
            }
            return currentErrorWaitInterval;
          }
        }
      };
      ERRORS2 = {
        [
          "already-initialized"
          /* AppCheckError.ALREADY_INITIALIZED */
        ]: "You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.",
        [
          "use-before-activation"
          /* AppCheckError.USE_BEFORE_ACTIVATION */
        ]: "App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.",
        [
          "fetch-network-error"
          /* AppCheckError.FETCH_NETWORK_ERROR */
        ]: "Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.",
        [
          "fetch-parse-error"
          /* AppCheckError.FETCH_PARSE_ERROR */
        ]: "Fetch client could not parse response. Original error: {$originalErrorMessage}.",
        [
          "fetch-status-error"
          /* AppCheckError.FETCH_STATUS_ERROR */
        ]: "Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.",
        [
          "storage-open"
          /* AppCheckError.STORAGE_OPEN */
        ]: "Error thrown when opening storage. Original error: {$originalErrorMessage}.",
        [
          "storage-get"
          /* AppCheckError.STORAGE_GET */
        ]: "Error thrown when reading from storage. Original error: {$originalErrorMessage}.",
        [
          "storage-set"
          /* AppCheckError.STORAGE_WRITE */
        ]: "Error thrown when writing to storage. Original error: {$originalErrorMessage}.",
        [
          "recaptcha-error"
          /* AppCheckError.RECAPTCHA_ERROR */
        ]: "ReCAPTCHA error.",
        [
          "initial-throttle"
          /* AppCheckError.INITIAL_THROTTLE */
        ]: `{$httpStatus} error. Attempts allowed again after {$time}`,
        [
          "throttled"
          /* AppCheckError.THROTTLED */
        ]: `Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}`
      };
      ERROR_FACTORY2 = new ErrorFactory("appCheck", "AppCheck", ERRORS2);
      DB_NAME2 = "firebase-app-check-database";
      DB_VERSION2 = 1;
      STORE_NAME2 = "firebase-app-check-store";
      DEBUG_TOKEN_KEY = "debug-token";
      dbPromise2 = null;
      logger3 = new Logger("@firebase/app-check");
      defaultTokenErrorData = { error: "UNKNOWN_ERROR" };
      AppCheckService = class {
        constructor(app, heartbeatServiceProvider) {
          this.app = app;
          this.heartbeatServiceProvider = heartbeatServiceProvider;
        }
        _delete() {
          const { tokenObservers } = getStateReference(this.app);
          for (const tokenObserver of tokenObservers) {
            removeTokenListener(this.app, tokenObserver.next);
          }
          return Promise.resolve();
        }
      };
      name4 = "@firebase/app-check";
      version3 = "0.13.1";
      APP_CHECK_NAME = "app-check";
      APP_CHECK_NAME_INTERNAL = "app-check-internal";
      registerAppCheck();
    }
  });

  // node_modules/firebase/app-check/dist/esm/index.esm.js
  var init_index_esm9 = __esm({
    "node_modules/firebase/app-check/dist/esm/index.esm.js"() {
      init_index_esm8();
    }
  });

  // src/app.js
  var require_app = __commonJS({
    "src/app.js"() {
      init_index_esm5();
      init_index_esm7();
      init_index_esm9();
      var firebaseConfig = {
        apiKey: "AIzaSyDzuDJY6-JjINLaIaOzmhTtxO7pEgSKvwA",
        authDomain: "privacylens-hybrid.firebaseapp.com",
        projectId: "privacylens-hybrid",
        storageBucket: "privacylens-hybrid.firebasestorage.app",
        messagingSenderId: "754348827987",
        appId: "1:754348827987:web:72bb22f0e82201548ceda6",
        measurementId: "G-MX6BPDB6DX"
      };
      var firebaseApp = initializeApp(firebaseConfig);
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = "privacylens-hybrid-debug-2026";
      initializeAppCheck(firebaseApp, { isTokenAutoRefreshEnabled: true });
      var state = {
        running: false,
        modelReady: false,
        mode: null,
        // "on-device" | "cloud" | null
        log: [],
        deviceModelStatus: "checking"
        // checking | available | downloadable | downloading | unavailable
      };
      var el = (id) => document.getElementById(id);
      function setPill(cls, text) {
        const pill = el("model-pill");
        pill.className = "pill " + cls;
        pill.textContent = text;
      }
      function setBanner(cls, html) {
        const b = el("privacy-badge");
        b.className = "privacy-banner " + cls;
        b.innerHTML = html;
      }
      function now() {
        return (/* @__PURE__ */ new Date()).toLocaleTimeString();
      }
      function log(icon, text, where) {
        state.log.unshift({ icon, text, where, t: now() });
        renderLog();
      }
      function renderLog() {
        const rows = state.log.map(
          (l) => `<div class="log-row"><span class="icon">${l.icon}</span><span>${escapeHtml(l.text)}</span><span class="t">${escapeHtml(l.where || "")} \xB7 ${l.t}</span></div>`
        ).join("");
        el("tab-log").innerHTML = `<div class="log-list">${rows}</div>`;
      }
      function escapeHtml(s) {
        return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
      }
      function showResult(text) {
        el("tab-result").innerHTML = `<div class="result-text">${escapeHtml(text)}</div>`;
        selectTab("result");
      }
      function selectTab(name5) {
        document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name5));
        document.querySelectorAll(".tab-body").forEach((b) => b.classList.toggle("hidden", b.id !== `tab-${name5}`));
      }
      var ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      var deviceModel = getGenerativeModel(ai, {
        mode: InferenceMode.PREFER_ON_DEVICE
      });
      var cloudModel = getGenerativeModel(ai, {
        mode: InferenceMode.ONLY_IN_CLOUD
      });
      async function checkDeviceModel() {
        try {
          if (typeof LanguageModel === "undefined") {
            state.deviceModelStatus = "unavailable";
            setPill("unavailable", "\u26A0\uFE0F Gemini Nano unavailable \u2014 cloud fallback active");
            log("\u2601\uFE0F", "On-device model unavailable in this browser \u2014 all inference will use cloud Gemini (still hybrid-ready: switches to on-device automatically on supported Chrome).", "setup");
            return;
          }
          const availability = await LanguageModel.availability();
          state.deviceModelStatus = availability;
          if (availability === "available") {
            setPill("on-device", "\u{1F7E2} Gemini Nano READY on-device \u2014 private inference active");
            log("\u{1F7E2}", "On-device model (Gemini Nano) is available \u2014 your text can be analyzed without leaving your device.", "setup");
          } else if (availability === "downloadable" || availability === "downloading") {
            setPill("downloading", "\u23F3 Gemini Nano " + availability + " \u2014 will activate once downloaded");
            log("\u23F3", "On-device model is " + availability + " \u2014 cloud used until the download completes.", "setup");
            try {
              const session = await LanguageModel.create({
                monitor(m) {
                  m.addEventListener("downloadprogress", (e) => {
                    setPill("downloading", "\u23F3 Gemini Nano downloading \u2014 " + Math.round(e.loaded * 100) + "%");
                  });
                }
              });
              session.destroy?.();
              state.deviceModelStatus = "available";
              setPill("on-device", "\u{1F7E2} Gemini Nano READY on-device \u2014 private inference active");
              log("\u{1F7E2}", "On-device model downloaded and ready \u2014 private inference active.", "setup");
            } catch (e) {
              log("\u2601\uFE0F", "On-device model download needs more disk/user action \u2014 cloud fallback stays active.", "setup");
            }
          } else {
            setPill("unavailable", "\u26A0\uFE0F Gemini Nano " + availability + " \u2014 cloud fallback active");
            log("\u2601\uFE0F", "On-device model " + availability + " \u2014 cloud fallback active.", "setup");
          }
        } catch (e) {
          state.deviceModelStatus = "unavailable";
          setPill("unavailable", "\u26A0\uFE0F On-device check failed \u2014 cloud fallback active");
          log("\u2601\uFE0F", "On-device check failed: " + e.message, "setup");
        }
      }
      var PROMPTS = {
        summarize: "Summarize the following text in 3-5 concise bullet points. Keep all names, dates and figures exact.",
        redact: "Rewrite the following text with every piece of personally identifying information (names, phone numbers, emails, IDs, account numbers, addresses) replaced with [REDACTED-<TYPE>]. Keep everything else verbatim.",
        sentiment: "Analyze the sentiment and tone of the following text. Reply with: overall sentiment (positive/neutral/negative), tone description in one line, and any notable emotional cues.",
        keypoints: "Extract the key points from the following text as a numbered list. Preserve exact figures, dates, names and obligations.",
        risk: "Flag any risks, red flags, obligations, deadlines or unusual clauses in the following text as a bulleted list. Be specific and quote the source phrases."
      };
      async function runAnalysis() {
        const doc = el("doc-input").value.trim();
        if (!doc || state.running) return;
        const mode = document.querySelector("input[name='mode']:checked").value;
        state.running = true;
        el("run-btn").disabled = true;
        el("run-btn").textContent = "Analyzing\u2026";
        setBanner("neutral", "\u23F3 Analyzing on-device first\u2026");
        const prompt = PROMPTS[mode] + "\n\n---\n\n" + doc;
        let where = "unknown";
        let resultText = "";
        const t0 = Date.now();
        try {
          let response;
          try {
            response = await deviceModel.generateContent(prompt);
            where = state.deviceModelStatus === "available" ? "on-device" : "cloud (fallback)";
          } catch (deviceErr) {
            response = await cloudModel.generateContent(prompt);
            where = "cloud (fallback)";
          }
          resultText = (await response.response).text();
          const ms = Date.now() - t0;
          if (where === "on-device") {
            setBanner("on-device", `\u{1F7E2} <strong>Processed on-device.</strong> Your text never left this machine. Model: Gemini Nano \xB7 ${(ms / 1e3).toFixed(1)}s`);
            log("\u{1F7E2}", mode + " analysis completed ON-DEVICE (" + (ms / 1e3).toFixed(1) + "s) \u2014 data stayed local.", "inference");
          } else {
            setBanner("cloud-run", `\u2601\uFE0F <strong>Processed in cloud (fallback).</strong> Reason: on-device attempt failed or unavailable. Model: Gemini \xB7 ${(ms / 1e3).toFixed(1)}s`);
            log("\u2601\uFE0F", mode + " analysis ran in cloud (" + (ms / 1e3).toFixed(1) + "s) \u2014 on-device attempt failed or unavailable.", "inference");
          }
          showResult(resultText);
          state.mode = where;
        } catch (err) {
          setBanner("warn-run", `\u26A0\uFE0F <strong>Error:</strong> ${escapeHtml(err.message)}`);
          log("\u{1F6D1}", "Error: " + err.message, "inference");
        } finally {
          state.running = false;
          el("run-btn").disabled = false;
          el("run-btn").textContent = "Analyze privately \u{1F512}";
        }
      }
      async function runComplex() {
        const doc = el("doc-input").value.trim();
        const task = el("complex-input").value.trim();
        if (!doc || !task || state.running) return;
        state.running = true;
        el("complex-btn").disabled = true;
        setBanner("cloud-run", "\u2601\uFE0F <strong>Complex task \u2014 running in cloud.</strong> You explicitly invoked this, so the text goes to Gemini cloud.");
        const prompt = task + "\n\n---\n\n" + doc;
        const t0 = Date.now();
        try {
          const response = await cloudModel.generateContent(prompt);
          const text = (await response.response).text();
          const ms = Date.now() - t0;
          setBanner("cloud-run", `\u2601\uFE0F <strong>Complex task completed in cloud.</strong> Model: Gemini \xB7 ${(ms / 1e3).toFixed(1)}s \xB7 You explicitly chose cloud for this deep task.`);
          log("\u2601\uFE0F", "Complex task (user-invoked) ran in cloud (" + (ms / 1e3).toFixed(1) + "s).", "inference");
          showResult(text);
          state.mode = "cloud";
        } catch (err) {
          setBanner("warn-run", `\u26A0\uFE0F <strong>Error:</strong> ${escapeHtml(err.message)}`);
          log("\u{1F6D1}", "Complex task error: " + err.message, "inference");
        } finally {
          state.running = false;
          el("complex-btn").disabled = false;
        }
      }
      var SAMPLES = [
        { name: "\u{1FA7A} Patient notes", text: "Patient: Priya Sharma, DOB 1988-03-12\nMRN: 4471-B\n\nPresenting complaint: Persistent migraines, 3x/week for 2 months.\nCurrent medication: Sumatriptan 50mg PRN.\nAllergies: Penicillin.\n\nAssessment: Suspected chronic migraine without aura. MRI ordered for 2026-11-20.\nPlan: Increase hydration, sleep hygiene counseling. Follow-up in 2 weeks.\nInsurance claim #: CL-2026-88412\nContact: p.sharma@email.com / +91 98200 11223" },
        { name: "\u{1F4DC} Contract clause", text: "CLAUSE 7.2 \u2014 TERMINATION FOR CONVENIENCE\n\nThe Client may terminate this Agreement at any time upon fifteen (15) days' written notice. Upon termination, the Vendor shall be entitled to payment for all Services performed through the effective date of termination, provided however that the Client may, at its sole discretion, withhold up to 20% of the final invoice as a quality assurance retention for a period of ninety (90) days.\n\nCLAUSE 7.3 \u2014 Late payment interest accrues at 1.5% per month on overdue amounts." },
        { name: "\u{1F4B0} Salary negotiation", text: "Hi Mr. Verma,\n\nThank you for the offer. The base of \u20B918,00,000 is below my expectations given my 8 years of experience and the current market. I was targeting \u20B924,00,000 plus ESOPs.\n\nI have a competing offer at \u20B922,50,000 from a Series-B startup. If you can match \u20B923,00,000 with a joining bonus of \u20B92,00,000, I'm ready to sign this week.\n\nRegards,\nAnkit" },
        { name: "\u{1F9FE} Invoice dispute", text: "Invoice #INV-8812 from TechFlow Solutions\nDate: 2026-10-15\nAmount: $4,850.00\n\nServices: UI development sprint (Oct 1-15)\n\nNote: This replaces our earlier quote of $3,200.00 dated 2026-09-30 due to scope changes requested on Oct 8.\nPayment terms: Net 15. Wire to A/C 9987 2210 4455.\n\nDisputed items: Two of three deliverables not accepted by client on Oct 18." }
      ];
      function buildSamples() {
        const wrap2 = el("samples");
        for (const s of SAMPLES) {
          const chip = document.createElement("button");
          chip.className = "chip";
          chip.textContent = s.name;
          chip.addEventListener("click", () => {
            el("doc-input").value = s.text;
            refreshRun();
          });
          wrap2.appendChild(chip);
        }
      }
      function refreshRun() {
        el("run-btn").disabled = !el("doc-input").value.trim() || state.running;
        el("complex-btn").disabled = !el("doc-input").value.trim() || !el("complex-input").value.trim() || state.running;
      }
      el("doc-input").addEventListener("input", refreshRun);
      el("complex-input").addEventListener("input", refreshRun);
      el("run-btn").addEventListener("click", runAnalysis);
      el("complex-btn").addEventListener("click", runComplex);
      el("clear-btn").addEventListener("click", () => {
        el("doc-input").value = "";
        el("complex-input").value = "";
        state.log = [];
        renderLog();
        setBanner("neutral", "\u{1F512} Ready \u2014 nothing has been sent anywhere yet.");
        el("tab-result").innerHTML = `<div class="placeholder">Run an analysis to see results.</div>`;
        refreshRun();
      });
      document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x.dataset.tab === t.dataset.tab));
        document.querySelectorAll(".tab-body").forEach((b) => b.classList.toggle("hidden", b.id !== `tab-${t.dataset.tab}`));
      }));
      buildSamples();
      refreshRun();
      setTabBody("result", `<div class="placeholder">Run an analysis to see results.</div>`);
      setTabBody("log", `<div class="placeholder">Every inference is logged here with where your data went.</div>`);
      function setTabBody(name5, html) {
        el(`tab-${name5}`).innerHTML = html || `<div class="placeholder">Nothing here yet.</div>`;
      }
      checkDeviceModel();
    }
  });
  require_app();
})();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
