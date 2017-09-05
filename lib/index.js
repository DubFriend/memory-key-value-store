'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ks = function ks(key) {
  return _lodash2.default.isObject(key) ? (0, _jsonStableStringify2.default)(key) : String(key);
};

exports.default = function () {
  var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();

  var self = {
    find: function find(key) {
      var d = store.get(ks(key));
      return d && d.value && _lodash2.default.clone(d.value) || null;
    },
    save: function save(keyRaw, value) {
      var key = ks(keyRaw);
      var d = store.get(key);
      if (d && d.value) {
        _lodash2.default.extend(d.value, value);
      } else if (d) {
        d.value = value;
      } else {
        store.set(key, { value: value });
      }
      return self;
    },
    set: function set(keyRaw, value) {
      var key = ks(keyRaw);
      var d = store.get(key);
      if (d) {
        d.value = value;
      } else {
        store.set(key, { value: value });
      }
      return self;
    },
    delete: function _delete(keyRaw) {
      var key = ks(keyRaw);
      var d = store.get(key);
      if (d) {
        d.value = null;
      }
      return self;
    },
    secondaryKey: function secondaryKey(originalRaw, secondaryRaw) {
      var original = ks(originalRaw);
      var d = store.get(original);
      if (!d) {
        d = {};
        d.value = null;
        store.set(original, d);
      }

      var secondaries = Array.isArray(secondaryRaw) ? _lodash2.default.map(secondaryRaw, ks) : [ks(secondaryRaw)];

      _lodash2.default.each(secondaries, function (secondary) {
        var s = store.get(secondary);
        if (s && s !== d) {
          throw new Error('Cannot associate with secondaryKey:' + secondary + '. This key is already set with another value');
        }
        store.set(secondary, d);
      });

      return self;
    }
  };

  return self;
};