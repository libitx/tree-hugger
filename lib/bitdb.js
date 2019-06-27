const axios = require('axios')
const merge = require('deepmerge')

const bitdb = {
  baseUrl: 'https://metanaria.planaria.network/q/',
  headers: {},

  async find(qry, opts = {}) {
    const query = this._buildQuery(qry, opts),
          path  = this._encodeQuery(query),
          url   = this.baseUrl + path,
          head  = { ...this.headers, ...opts.headers };

    if (opts.debug) {
      console.log(query)
      console.log(url)
    }

    return axios.get(url, { headers: head })
      .then(r => r.data.metanet.map(obj => new MetaNode(obj)))
  },

  async findSingle({ q, r }, opts) {
    const sort = { "blk.i": -1, i: -1 },
          limit = 1,
          query = { q: { sort, limit, ...q }, r };

    return this.find(query, opts)
      .then(data => data[0] || null)
  },

  async findAll({ q, r }, opts) {
    const sort = { "blk.i": 1, i: 1 },
          query = { q: { sort, ...q }, r };

    return this.find(query, opts)
  },

  _buildQuery(qry, { q, r } = {}) {
    const q1 = { v: 3, ...qry },
          q2 = { q: { ...q }, r: { ...r } };
    return merge(q1, q2)
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