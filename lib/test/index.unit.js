'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;
/* eslint-disable no-unused-expressions */

describe('index.unit', function () {
  var store = void 0;
  var map = void 0;

  beforeEach(function () {
    map = new Map();
    store = (0, _index2.default)(map);
  });

  describe('find', function () {
    it('should find value', function () {
      map.set('a', { value: { foo: 'bar' } });
      expect(store.find('a')).to.deep.equal({ foo: 'bar' });
    });

    it('should handle object key', function () {
      map.set((0, _jsonStableStringify2.default)({ a: 1, b: 2 }), { value: { foo: 'bar' } });
      expect(store.find({ b: 2, a: 1 })).to.deep.equal({ foo: 'bar' });
    });

    it('should return null if no value', function () {
      expect(store.find('a')).to.be.null;
    });
  });

  describe('save', function () {
    it('should create new value', function () {
      store.save('a', { foo: 'bar' });
      expect(map.get('a')).to.deep.equal({ value: { foo: 'bar' } });
    });

    it('should handle object key', function () {
      store.save({ a: 1, b: 2 }, { foo: 'bar' });
      expect(map.get((0, _jsonStableStringify2.default)({ b: 2, a: 1 }))).to.deep.equal({
        value: { foo: 'bar' }
      });
    });

    it('should update existing value', function () {
      map.set('a', { value: { foo: 'bar', ball: 'baz' } });
      store.save('a', { foo: 'flub', nar: 'whal' });
      expect(map.get('a')).to.deep.equal({
        value: {
          foo: 'flub',
          ball: 'baz',
          nar: 'whal'
        }
      });
    });
  });

  describe('set', function () {
    it('should create new value', function () {
      store.set('a', { foo: 'bar' });
      expect(map.get('a')).to.deep.equal({ value: { foo: 'bar' } });
    });

    it('should handle object key', function () {
      store.set({ a: 1, b: 2 }, { foo: 'bar' });
      expect(map.get((0, _jsonStableStringify2.default)({ b: 2, a: 1 }))).to.deep.equal({
        value: { foo: 'bar' }
      });
    });

    it('should replace existing value', function () {
      map.set('a', { value: { foo: 'bar' } });
      store.set('a', { ball: 'baz' });
      expect(map.get('a')).to.deep.equal({ value: { ball: 'baz' } });
    });
  });

  describe('delete', function () {
    it('should delete value', function () {
      map.set('a', { value: { foo: 'bar' } });
      store.delete('a');
      expect(map.get('a')).to.deep.equal({ value: null });
    });

    it('should handle object key', function () {
      map.set((0, _jsonStableStringify2.default)({ a: 1, b: 2 }), { value: { foo: 'bar' } });
      store.delete({ b: 2, a: 1 });
      expect(map.get((0, _jsonStableStringify2.default)({ a: 1, b: 2 }))).to.deep.equal({ value: null });
    });

    it('should handle value that doesnt exists', function () {
      store.delete('a');
      expect(map.get('a')).to.be.undefined;
    });
  });

  describe('secondaryKey', function () {
    it('should assign new key to reference of existing value', function () {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      expect(map.get('a')).to.equal(map.get('b'));
    });

    it('should handle object key', function () {
      map.set((0, _jsonStableStringify2.default)({ a: 3, b: 4 }), { value: { foo: 'bar' } });
      store.secondaryKey({ b: 4, a: 3 }, { a: 1, b: 2 });
      expect(map.get((0, _jsonStableStringify2.default)({ a: 3, b: 4 }))).to.equal(map.get((0, _jsonStableStringify2.default)({ a: 1, b: 2 })));
    });

    it('should create new empty object if none exists', function () {
      store.secondaryKey('a', 'b');
      expect(map.get('a')).to.deep.equal({ value: null });
    });

    it('should associate on find', function () {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on save', function () {
      store.secondaryKey('a', 'b');
      store.save('a', { foo: 'bar' });
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on set', function () {
      store.secondaryKey('a', 'b');
      store.set('a', { foo: 'bar' });
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on delete', function () {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      store.delete('a');
      expect(store.find('b')).to.be.null;
    });

    it('should handle array of associations', function () {
      store.secondaryKey('a', ['b', 'c']);
      expect(map.get('a')).to.equal(map.get('b'));
      expect(map.get('a')).to.equal(map.get('c'));
    });
  });
});