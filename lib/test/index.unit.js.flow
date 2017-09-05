// @flow
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import createStore from '../index';
import stringify from 'json-stable-stringify';
const { expect } = chai;

describe('index.unit', () => {
  let store;
  let map;

  beforeEach(() => {
    map = new Map();
    store = createStore(map);
  });

  describe('find', () => {
    it('should find value', () => {
      map.set('a', { value: { foo: 'bar' } });
      expect(store.find('a')).to.deep.equal({ foo: 'bar' });
    });

    it('should handle object key', () => {
      map.set(stringify({ a: 1, b: 2 }), { value: { foo: 'bar' } });
      expect(store.find({ b: 2, a: 1 })).to.deep.equal({ foo: 'bar' });
    });

    it('should return null if no value', () => {
      expect(store.find('a')).to.be.null;
    });
  });

  describe('save', () => {
    it('should create new value', () => {
      store.save('a', { foo: 'bar' });
      expect(map.get('a')).to.deep.equal({ value: { foo: 'bar' } });
    });

    it('should handle object key', () => {
      store.save({ a: 1, b: 2 }, { foo: 'bar' });
      expect(map.get(stringify({ b: 2, a: 1 }))).to.deep.equal({
        value: { foo: 'bar' },
      });
    });

    it('should update existing value', () => {
      map.set('a', { value: { foo: 'bar', ball: 'baz' } });
      store.save('a', { foo: 'flub', nar: 'whal' });
      expect(map.get('a')).to.deep.equal({
        value: {
          foo: 'flub',
          ball: 'baz',
          nar: 'whal',
        },
      });
    });
  });

  describe('set', () => {
    it('should create new value', () => {
      store.set('a', { foo: 'bar' });
      expect(map.get('a')).to.deep.equal({ value: { foo: 'bar' } });
    });

    it('should handle object key', () => {
      store.set({ a: 1, b: 2 }, { foo: 'bar' });
      expect(map.get(stringify({ b: 2, a: 1 }))).to.deep.equal({
        value: { foo: 'bar' },
      });
    });

    it('should replace existing value', () => {
      map.set('a', { value: { foo: 'bar' } });
      store.set('a', { ball: 'baz' });
      expect(map.get('a')).to.deep.equal({ value: { ball: 'baz' } });
    });
  });

  describe('delete', () => {
    it('should delete value', () => {
      map.set('a', { value: { foo: 'bar' } });
      store.delete('a');
      expect(map.get('a')).to.deep.equal({ value: null });
    });

    it('should handle object key', () => {
      map.set(stringify({ a: 1, b: 2 }), { value: { foo: 'bar' } });
      store.delete({ b: 2, a: 1 });
      expect(map.get(stringify({ a: 1, b: 2 }))).to.deep.equal({ value: null });
    });

    it('should handle value that doesnt exists', () => {
      store.delete('a');
      expect(map.get('a')).to.be.undefined;
    });
  });

  describe('secondaryKey', () => {
    it('should assign new key to reference of existing value', () => {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      expect(map.get('a')).to.equal(map.get('b'));
    });

    it('should handle object key', () => {
      map.set(stringify({ a: 3, b: 4 }), { value: { foo: 'bar' } });
      store.secondaryKey({ b: 4, a: 3 }, { a: 1, b: 2 });
      expect(map.get(stringify({ a: 3, b: 4 }))).to.equal(
        map.get(stringify({ a: 1, b: 2 }))
      );
    });

    it('should create new empty object if none exists', () => {
      store.secondaryKey('a', 'b');
      expect(map.get('a')).to.deep.equal({ value: null });
    });

    it('should associate on find', () => {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on save', () => {
      store.secondaryKey('a', 'b');
      store.save('a', { foo: 'bar' });
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on set', () => {
      store.secondaryKey('a', 'b');
      store.set('a', { foo: 'bar' });
      expect(store.find('b')).to.deep.equal({ foo: 'bar' });
    });

    it('should associate on delete', () => {
      map.set('a', { value: { foo: 'bar' } });
      store.secondaryKey('a', 'b');
      store.delete('a');
      expect(store.find('b')).to.be.null;
    });

    it('should handle array of associations', () => {
      store.secondaryKey('a', ['b', 'c']);
      expect(map.get('a')).to.equal(map.get('b'));
      expect(map.get('a')).to.equal(map.get('c'));
    });
  });
});
