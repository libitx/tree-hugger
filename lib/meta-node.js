const bitdb = require('./bitdb')

class MetaNode {
  constructor(tx) {
    this.tx = tx;
  }

  get id() {
    return this.tx.node.id;
  }

  get txid() {
    return this.tx.node.tx;
  }

  get address() {
    return this.tx.node.a;
  }

  get isRoot() {
    return !this.tx.parent;
  }

  get isChild() {
    return !this.isRoot;
  }

  get isLeaf() {
    return !this.tx.child || !this.tx.child.length;
  }

  get inputs() {
    return this.tx.in || [];
  }

  get outputs() {
    return this.tx.out || [];
  }

  get opReturn() {
    const output = this.outputs
      .find(o => o.b0.op === 106)

    return output || null;
  }

  async root(opts) {
    if (this.isRoot) return this;
    const find = { "node.id": this.tx.ancestor[0].id }
    return bitdb.findSingle({ find }, opts)
  }

  async parent(opts) {
    if (this.isRoot) return null;
    const find = { "node.id": this.tx.parent.id }
    return bitdb.findSingle({ find }, opts)
  }

  async ancestors(opts) {
    if (this.isRoot) return [];
    const ids = this.tx.ancestor
      .map(a => a.id)
      .filter(id => id !== this.id)
    const query = {
      find: { "node.id": { "$in": ids } },
      sort: { "blk.i": -1, i: -1 }
    }
    return bitdb.findAll(query, opts)
  }

  async siblings(opts) {
    if (this.isRoot) return [];
    const find = {
      "$and": [
        { "parent.id": this.tx.parent.id },
        { "node.id": { "$ne": this.id } }
      ]
    }
    return bitdb.findAll({ find }, opts);
  }

  async children(opts) {
    if (this.isLeaf) return [];
    const find = { "parent.id": this.id }
    return bitdb.findAll({ find }, opts);
  }

  async descendants(opts) {
    if (this.isLeaf) return [];
    const find = {
      "$and": [
        { "ancestor.id": this.id },
        { "node.id": { "$ne": this.id } }
      ]
    }
    return bitdb.findAll({ find }, opts)
  }

  async selfAndAncestors(opts) {
    return this.ancestors(opts)
      .then(ancestors => [this].concat(ancestors))
  }

  async selfAndSiblings(opts) {
    return this.siblings(opts)
      .then(siblings => {
        const i = siblings
          .findIndex(s => s.tx.blk.i >= this.tx.blk.i && s.tx.i > this.tx.i)
        siblings.splice(i, 0, this)
        return siblings
      })
  }

  async selfAndDescendants(opts) {
    return this.descendants(opts)
      .then(descendants => [this].concat(descendants))
  }
}

module.exports = MetaNode;