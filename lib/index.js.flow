// @flow
import _ from 'lodash';
import stringify from 'json-stable-stringify';

type Key = Object | string | number;
type Value = *;

export type MemoryKeyValueStore = {|
  find: Key => Value | null,
  save: (Key, Value) => MemoryKeyValueStore,
  set: (Key, Value) => MemoryKeyValueStore,
  delete: Key => MemoryKeyValueStore,
  secondaryKey: (Key, Key | Array<Key>) => MemoryKeyValueStore,
|};

const ks = (key: Key): string =>
  _.isObject(key) ? stringify(key) : String(key);

export default (store: Map<string, Value> = new Map()): MemoryKeyValueStore => {
  const self = {
    find: key => {
      const d = store.get(ks(key));
      return (d && d.value && _.clone(d.value)) || null;
    },
    save: (keyRaw, value) => {
      const key = ks(keyRaw);
      const d = store.get(key);
      if (d && d.value) {
        _.extend(d.value, value);
      } else if (d) {
        d.value = value;
      } else {
        store.set(key, { value });
      }
      return self;
    },
    set: (keyRaw, value) => {
      const key = ks(keyRaw);
      const d = store.get(key);
      if (d) {
        d.value = value;
      } else {
        store.set(key, { value });
      }
      return self;
    },
    delete: keyRaw => {
      const key = ks(keyRaw);
      const d = store.get(key);
      if (d) {
        d.value = null;
      }
      return self;
    },
    secondaryKey: (originalRaw, secondaryRaw) => {
      const original = ks(originalRaw);
      let d = store.get(original);
      if (!d) {
        d = {};
        d.value = null;
        store.set(original, d);
      }

      const secondaries = Array.isArray(secondaryRaw)
        ? _.map(secondaryRaw, ks)
        : [ks(secondaryRaw)];

      _.each(secondaries, secondary => {
        const s = store.get(secondary);
        if (s && s !== d) {
          throw new Error(
            `Cannot associate with secondaryKey:${secondary}. This key is already set with another value`
          );
        }
        store.set(secondary, d);
      });

      return self;
    },
  };

  return self;
};
