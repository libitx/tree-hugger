const bitdb = require('./bitdb')
const MetaNode = require('./meta-node')

const TreeHugger = {
  async findNode(id, opts) {
    return bitdb.findSingle({
      "node.id": id
    }, opts)
  },

  async findNodeAndDescendants(id, opts) {
    return bitdb.findAll({
      "$or": [
        { "node.id": id },
        { "ancestor.id": id }
      ]
    }, opts)
  }
}

module.exports = TreeHugger;