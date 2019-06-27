const bitdb = require('./bitdb')
const MetaNode = require('./meta-node')

bitdb.mapObject = obj => new MetaNode(obj)

const TreeHugger = {
  db: bitdb,

  async findSingleNode(query, opts) {
    return this.db.findSingle(query, opts)
  },

  async findAllNodes(query, opts) {
    return this.db.findAll(query, opts)
  },

  async findNodeById(id, opts) {
    const find = { "node.id": id }
    return this.db.findSingle({ find }, opts)
  },

  async findNodeByTxid(txid, opts) {
    const find = { "node.tx": txid }
    return this.db.findSingle({ find }, opts)
  },

  async findNodesByAddress(addr, opts) {
    const find = { "node.a": addr }
    return this.db.findAll({ find }, opts)
  },

  async findNodesByParentId(id, opts) {
    const find = { "parent.id": id }
    return this.db.findAll({ find }, opts)
  },

  async findNodeAndDescendants(id, opts) {
    const find = {
      "$or": [
        { 'node.id': id },
        { 'ancestor.id': id }
      ]
    }
    return this.db.findAll({ find }, opts)
  }
}

module.exports = TreeHugger;
