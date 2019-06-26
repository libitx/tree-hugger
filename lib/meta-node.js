const bitdb = require('./bitdb')

class MetaNode {
  constructor(data) {
    this.id     = data.node.id;
    this.txid   = data.node.txid;
    this.data   = data;
  }

  get isRoot() {
    return !this.data.parent;
  }

  get isChild() {
    return !this.isRoot;
  }

  get isLeaf() {
    return !this.data.child || !this.data.child.length;
  }

  async root(opts) {
    if (this.isRoot) return this;
    return bitdb.findSingle({
      "node.id": this.data.ancestor[0].id
    }, opts);
  }

  async parent(opts) {
    if (this.isRoot) return null;
    return bitdb.findSingle({
      "node.id": this.data.parent.id
    }, opts);
  }

  async children(opts) {
    if (this.isLeaf) return [];
    return bitdb.findAll({
      "parent.id": this.id
    }, opts);
  }

  async ancestors(opts) {
    if (this.isRoot) return [];
    const ids = this.data.ancestor
      .map(a => a.id)
      .filter(id => id !== this.id)
    return bitdb.findAll({
      "node.id": { "$in": ids }
    }, {
      q: {
        sort: { "blk.i": -1, i: -1 }
      },
      ...opts
    })
  }

  async selfAndAncestors(opts) {
    return this.ancestors(opts)
      .then(ancestors => [this].concat(ancestors))
  }

  async siblings(opts) {
    if (this.isRoot) return [];
    return bitdb.findAll({
      "$and": [
        { "parent.id": this.data.parent.id },
        { "node.id": { "$ne": this.id } }
      ]
    }, opts);
  }

  async selfAndSiblings(opts) {
    return this.siblings(opts)
      .then(siblings => {
        const i = siblings
          .findIndex(s => s.data.blk.i >= this.data.blk.i && s.data.i > this.data.i)
        siblings.splice(i, 0, this)
        return siblings
      })
  }

  async descendants(opts) {
    if (this.isLeaf) return [];
    return bitdb.findAll({
      "$and": [
        { "ancestor.id": this.id },
        { "node.id": { "$ne": this.id } }
      ]
    }, opts)
  }

  async selfAndDescendants(opts) {
    return this.descendants(opts)
      .then(descendants => [this].concat(descendants))
  }

}

module.exports = MetaNode;