const axios = require('axios')
const merge = require('deepmerge')


const bitdb = {
  baseUrl: 'https://metanaria.planaria.network/q/',
  headers: {},

  async find(query, { q, r, headers } = {}) {
    const sort  = { "blk.i": 1, i: 1 },
          q1    = { v: 3, q: { sort, ...q }, r },
          q2    = { q: query },
          qry   = merge(q1, q2),
          path  = this._encodeQuery(qry),
          url   = this.baseUrl + path,
          head  = { ...this.headers, ...headers };

    return axios.get(url, { headers: head })
      .then(r => r.data.metanet.map(obj => new MetaNode(obj)))
  },

  async findAll(find, opts) {
    return this.find({ find }, opts)
  },

  async findSingle(find, opts) {
    return this.find({
      find,
      limit: 1
    }, opts)
      .then(data => data[0])
  },

  _encodeQuery(query) {
    const str = JSON.stringify(query);
    if (typeof btoa == 'function') {
      return btoa(str);
    } else {
      return Buffer.from(str).toString('base64');
    }
  }
}

module.exports = bitdb;

// Inject at bototm to prevent circular dependency
const MetaNode = require('./meta-node')