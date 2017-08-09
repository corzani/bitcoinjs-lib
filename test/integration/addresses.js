/* global describe, it */

var assert = require('assert')
var bigi = require('bigi')
var bitcoin = require('../../')

// deterministic RNG for testing only
function rng () { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

describe('bitcoinjs-lib (addresses)', function () {
  it('can generate a random address', function () {
    var keyPair = bitcoin.ECPair.makeRandom({ rng: rng })
    var address = keyPair.getAddress()

    assert.strictEqual(address, '1F5VhMHukdnUES9kfXqzPzMeF1GPHKiF64')
  })

  it('can generate an address from a SHA256 hash', function () {
    var hash = bitcoin.crypto.sha256('correct horse battery staple')
    var d = bigi.fromBuffer(hash)

    var keyPair = new bitcoin.ECPair(d)
    var address = keyPair.getAddress()

    assert.strictEqual(address, '1C7zdTfnkzmr13HfA2vNm5SJYRK6nEKyq8')
  })

  it('can import an address via WIF', function () {
    var keyPair = bitcoin.ECPair.fromWIF('Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct')
    var address = keyPair.getAddress()

    assert.strictEqual(address, '19AAjaTUbRjQCMuVczepkoPswiZRhjtg31')
  })

  it('can generate a 2-of-3 multisig P2SH address', function () {
    var pubKeys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
    ].map(function (hex) {
      return Buffer.from(hex, 'hex')
    })

    var redeemScript = bitcoin.script.multisig.output.encode(2, pubKeys) // 2 of 3
    var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
    var address = bitcoin.address.fromOutputScript(scriptPubKey)

    assert.strictEqual(address, '36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7')
  })

  // other networks
  it('can generate a Testnet address', function () {
    var testnet = bitcoin.networks.testnet
    var keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng })
    var wif = keyPair.toWIF()
    var address = keyPair.getAddress()

    assert.strictEqual(address, 'mubSzQNtZfDj1YdNP6pNDuZy6zs6GDn61L')
    assert.strictEqual(wif, 'cRgnQe9MUu1JznntrLaoQpB476M8PURvXVQB5R2eqms5tXnzNsrr')
  })

  it('can generate a Litecoin address', function () {
    var litecoin = bitcoin.networks.litecoin
    var keyPair = bitcoin.ECPair.makeRandom({ network: litecoin, rng: rng })
    var wif = keyPair.toWIF()
    var address = keyPair.getAddress()

    assert.strictEqual(address, 'LZJSxZbjqJ2XVEquqfqHg1RQTDdfST5PTn')
    assert.strictEqual(wif, 'T7A4PUSgTDHecBxW1ZiYFrDNRih2o7M8Gf9xpoCgudPF9gDiNvuS')
  })
})
