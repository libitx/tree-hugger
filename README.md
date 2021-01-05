# Tree Hugger

> Project is no longer maintained

Tree Hugger depends on Planaria APIs which are now deprecated. For this reason Tree Hugger is no longer maintained and this repo has been archived.

---

*Tree Hugger* is a small JavaScript library for traversing the Metanet.  It is a higher-level interface over the top of the [MOM API](https://mom.planaria.network/), providing a simple API for finding Metanet nodes and traversing tree structures.

*Tree Hugger* works in both NodeJS and browser environments.

## Installation

Install with `npm` or `yarn`.

```bash
npm install meta-tree-hugger
# or
yarn add meta-tree-hugger
```

Include *Tree Hugger* in your NodeJS project:

```javascript
import TreeHugger from 'meta-tree-hugger'
```

... or in a browser:

```html
<script src="https://unpkg.com/meta-tree-hugger/dist/tree-hugger.min.js"></script>
```

## Find a Metanet node

Lookup a Metanet node either by it's node `id` or `txid`. All query functions are asyncronous and return a `Promise`.

```javascript
// Find a single node
await TreeHugger.findNodeById(id)
await TreeHugger.findNodeByTxid(txid)
// returns a <MetaNode> object

// Find a collection of nodes
await TreeHugger.findNodesByAddress(address)
await TreeHugger.findNodesByParentId(id)
await TreeHugger.findNodeAndDescendants(id)
// Returns flat, topologically ordered array
// [<MetaNode>, <MetaNode>, <MetaNode>, ...]

// Optional second parameter allows defining additional
// bitquery config
await TreeHugger.findNodesByParentId(id, {
  limit: 10
})

// For more complex custom queries
await TreeHugger.findSingleNode({
  find: { "node.id": id },
  project: { node: 1, parent: 1 }
})

// For complex queries
await TreeHugger.findAllNodes({
  find: {
    mem: 1,
    "$and": [
      { "ancestor.tx": id, },
      { child: { "$exists": true, "$eq": [] } }
    ]
  },
  sort: { "blk.i": -1, i: -1 }
})

```

## Traverse the tree

From any `MetaNode` instance, the tree can be traversed in any direction.

```javascript
await node.root()
await node.parent()
await node.ancestors()
await node.siblings()
await node.children()
await node.descendants()
await node.versions()
await node.selfAndAncestors()
await node.selfAndSiblings()
await node.selfAndChildren()
await node.selfAndDescendants()
await node.selfAndVersions()

// All traversal methods accept an optional parameter
// which can be used to define additional bitquery config
await node.selfAndDescendants({
  limit: 10
})
```

## Node attributes

A `MetaNode` instance has the following attributes:

```javascript
node.id         // Metanet node id - hash(address + txid)
node.txid       // Transaction id
node.address    // Metanet node address

node.isRoot     // Boolean
node.isChild    // Boolean
node.isLeaf     // Boolean

node.tx         // Access the Planaria tx object

node.inputs     // Shortcut to node.tx.in
node.outputs    // Shortcut to node.tx.out
node.opReturn   // Shortcut to the OP_RETURN tape
```

## License

*Tree Hugger* is open source and released under the [MIT License](LICENSE.md).

Copyright (c) 2019 libitx.