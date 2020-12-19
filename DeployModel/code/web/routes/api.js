const express = require('express')
const fetch = require('node-fetch')
const router = express.Router()

require('dotenv').config()
const NAPA_API = process.env.NAPA_API

function callNode() {
  return fetch(NAPA_API + '/api/serve/topology/node/', {
    headers: {
      Authorization: 'Basic c2Rib3g6c2Rib3g=',
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err)
      throw err
    })
}

function callLink() {
  return fetch(NAPA_API + '/api/serve/topology/link/', {
    headers: {
      Authorization: 'Basic c2Rib3g6c2Rib3g=',
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err)
      throw err
    })
}

function callPortUsg(port_id) {
  body = {
    data_volume: 5,
    groups: 1,
    type: 'rate',
    port_id,
  }
  return fetch(NAPA_API + '/api/monitor/Port_USG/', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      Authorization: 'Basic c2Rib3g6c2Rib3g=',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err)
      throw err
    })
}

router.get('/all-data', async (req, res, next) => {
  let node, link, port_usg
  try {
    node = await callNode()
    link = await callLink()
    port_id = []
    for (const l of link) {
      port_id.push(l.port[0].id)
    }
    console.log(port_id)
    port_usg = await Promise.all(port_id.map(callPortUsg))
  } catch (error) {
    return next(error)
  }

  port_usg = port_usg.filter((x) => !x.ERROR)

  res.json({ node, link, port_usg })
})

module.exports = router
