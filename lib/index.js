const bitdb = require('./bitdb')
const MetaNode = require('./meta-node')

bitdb.mapObject = obj => new MetaNode(obj)

const TreeHugger = {
  db: bitdb,

  findSingleNode(query, opts) {
    return this.db.findSingle(query, opts)
  },

  findAllNodes(query, opts) {
    return this.db.findAll(query, opts)
  },

  findNodeById(id, opts) {
    const find = { "node.id": id }
    return this.db.findSingle({ find }, opts)
  },

  findNodeByTxid(txid, opts) {
    const find = { "node.tx": txid }
    return this.db.findSingle({ find }, opts)
  },

  findNodesByAddress(addr, opts) {
    const find = { "node.a": addr }
    return this.db.findAll({ find }, opts)
  },

  findNodesByParentId(id, opts) {
    const find = {
      "parent.id": id,
      "head": true
    }
    return this.db.findAll({ find }, opts)
  },

  findNodeAndDescendants(id, opts) {
    const find = {
      "$or": [
        { "node.id": id },
        { "ancestor.id": id }
      ],
      "head": true
    }
    return this.db.findAll({ find }, opts)
  }
}

module.exports = TreeHugger;
