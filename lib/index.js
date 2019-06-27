const bitdb = require('./bitdb')

const TreeHugger = {
  db: bitdb,

  async findSingleNode(query, opts) {
    return this.db.findSingle(query, opts)
  },

  async findAllNodes(query, opts) {
    return this.db.findAll(query, opts)
  },

  async findNodeById(id, opts) {
    const q = {
      find: { "node.id": id }
    }
    return this.db.findSingle({ q }, opts)
  },

  async findNodeByTxid(txid, opts) {
    const q = {
      find: { "node.tx": txid }
    }
    return this.db.findSingle({ q }, opts)
  },

  async findNodesByAddress(addr, opts) {
    const q = {
      find: { "node.a": addr }
    }
    return this.db.findAll({ q }, opts)
  },

  async findNodesByParentId(id, opts) {
    const q = {
      find: { "parent.id": id }
    }
    return this.db.findAll({ q }, opts)
  },

  async findNodeAndDescendants(id, opts) {
    const q = {
      find: {
        "$or": [
          { 'node.id': id },
          { 'ancestor.id': id }
        ]
      }
    }
    return this.db.findAll({ q }, opts)
  }
}

module.exports = TreeHugger;