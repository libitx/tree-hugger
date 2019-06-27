const axios = require('axios')
const merge = require('deepmerge')

const bitdb = {
  baseUrl: 'https://metanaria.planaria.network/q/',
  headers: {},

  async find(qry, { q, r, headers } = {}) {
    const q1    = { v: 3, ...qry },
          q2    = { q: { ...q }, r: { ...r } },
          query = merge(q1, q2),
          path  = this._encodeQuery(query),
          url   = this.baseUrl + path,
          head  = { ...this.headers, ...headers };

    return axios.get(url, { headers: head })
      .then(r => r.data.metanet.map(obj => new MetaNode(obj)))
  },

  async findSingle({ q, r }, opts) {
    const sort = { "blk.i": -1, i: -1 },
          limit = 1,
          query = { q: { sort, limit, ...q }, r };

    return this.find(query, opts)
      .then(data => data[0])
  },

  async findAll({ q, r }, opts) {
    const sort = { "blk.i": 1, i: 1 },
          query = { q: { sort, ...q }, r };

    return this.find(query, opts)
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