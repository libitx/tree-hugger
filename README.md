# Tree Hugger

*Tree Hugger* is a small JavaScript library for traversing the Metanet.  It is a higher-level interface over the top of the [Metanaria API](https://metanaria.planaria.network/), providing a simple API for finding Metanet nodes and traversing tree structures.

*Tree Hugger* works in both NodeJS and ~browser~ *(soon)* environments.

## Installation

Install with `npm` or `yarn`.

```bash
npm install meta-tree-hugger
# or
yarn add meta-tree-hugger
```

## Find a Metanet node

Lookup a Metanet node either by it's node `id` or `txid`.

```javascript
import TreeHugger from 'meta-tree-hugger'

// Find a single node
await TreeHugger.findNodeById(id)
await TreeHugger.findNodeByTxid(txid)
// returns a <MetaNode> object

// For more complex custom queries
await TreeHugger.findSingleNode({
  q: {
    find: { "node.id": id },
    project: { node: 1, parent: 1 }
  }
})

// Find a collection of nodes
// Optional second parameter allows defining additional
// bitquery config
await TreeHugger.findNodesByAddress(address)
await TreeHugger.findNodesByParentId(id)
await TreeHugger.findNodeAndDescendants(id, {
  q: { limit: 10 }
})
// Returns flat, topologically ordered array
// [<MetaNode>, <MetaNode>, <MetaNode>, ...]

// For complex queries
await TreeHugger.findAllNodes({
  q: {
    find: {
      mem: 1,
      "$and": [{
        "ancestor.tx": id,
      }, {
        child: { "$exists": true, "$eq": [] }
      }]
    },
    sort: { "blk.i": -1, i: -1 },
    project: { node: 1, parent: 1 }
  }
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
await node.selfAndAncestors()
await node.selfAndSiblings()
await node.selfAndChildren()
await node.selfAndDescendants()
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
node.opReturn   // Shortcut to the OP_RETURN output object
```

## License

*Tree Hugger* is open source and released under the [MIT License](LICENSE.md).

Copyright (c) 2018 libitx.