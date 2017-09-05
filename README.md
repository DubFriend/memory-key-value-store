# memory-key-value-store

In Memory Key Value Datastore with option to associate multiple keys to an object and object keys

`npm install --save memory-key-value-store`

## Example Usage

```javascript
const memoryKeyValueStore = require('memory-key-value-store');

const store = memoryKeyValueStore();

store.set('a', { foo: 'bar' });
store.find('a');
```

## API

Note that in all cases, simple javascript objects as well as numbers can be used for keys. All keys get converted to strings internally. Javascript objects are serialized using [json-stable-stringify](https://github.com/substack/json-stable-stringify)

Also note that values should always be javascript objects if you intend on using the `save` method.

### Methods

#### find

Find item by its key. Returns `null` if item is not found.

```javascript
store.find('a');
```

#### save

Create a new item, or extend the old one.

```javascript
store.save('a', { foo: 'bar', ball: 'baz' });
store.save('a', { ball: 'bash', car: 'mash' });
// the final value is: { foo: 'bar', ball: 'bash', car: 'mash' }
```

#### set

Create a new item or replace the old one.

```javascript
store.set('a', { foo: 'bar', ball: 'baz' });
store.set('a', { ball: 'bash', car: 'mash' });
// the final value is: { ball: 'bash', car: 'mash' }
```

#### delete

Delete an item by its key (has no effect if the item doesnt already exist)

```javascript
store.delete('a');
```

#### secondaryKey

Associate two keys with a reference to the same value. This will cause subsequent calls to edit the values of either key to edit the values of both keys.

```javascript
store.secondaryKey('a', 'b');
store.set('a', { foo: 'bar' });
// the value of "b" is now also { foo: 'bar' }
```

You can optionally associate an array of keys with the original

```javascript
store.secondaryKey('a', ['b', 'c']);
```

### Method Chaining

The methods: `save`, `set`, `delete`, and `secondaryKey` can be chained

```javascript
store.save('a', { foo: 'bar' })
  .set('b', { ball: 'baz' })
  .delete('a')
  .secondaryKey('b', 'c');
```

## Development

To setup the development environment and run tests:

1. `npm install`
1. `flow-typed install`
1. `gulp test`
