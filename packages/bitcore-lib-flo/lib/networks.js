'use strict';
var _ = require('lodash');

var BufferUtil = require('./util/buffer');
var JSUtil = require('./util/js');
var networks = [];
var networkMaps = {};

/**
 * A network is merely a map containing values that correspond to version
 * numbers for each flocoin network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnet".
 * @constructor
 */
function Network() {}

Network.prototype.toString = function toString() {
  return this.name;
};

/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name matches
 * @return Network
 */
function get(arg, keys) {
  if (~networks.indexOf(arg)) {
    return arg;
  }
  if (keys) {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    var containsArg = function(key) {
      return networks[index][key] === arg;
    };
    for (var index in networks) {
      if (_.some(keys, containsArg)) {
        return networks[index];
      }
    }
    return undefined;
  }
  return networkMaps[arg];
}

/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {string} data.bech32prefix - The native segwit prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */
function addNetwork(data) {

  var network = new Network();

  JSUtil.defineImmutable(network, {
    name: data.name,
    alias: data.alias,
    pubkeyhash: data.pubkeyhash,
    privatekey: data.privatekey,
    privatekey2: data.privatekey2,
    scripthash: data.scripthash,
    scripthash2: data.scripthash2,
    bech32prefix: data.bech32prefix,
    xpubkey: data.xpubkey,
    xprivkey: data.xprivkey
  });

  if (data.networkMagic) {
    JSUtil.defineImmutable(network, {
      networkMagic: BufferUtil.integerAsBuffer(data.networkMagic)
    });
    networkMaps[network.networkMagic.toString('hex')] = network;
  }

  if (data.port) {
    JSUtil.defineImmutable(network, {
      port: data.port
    });
  }

  if (data.dnsSeeds) {
    JSUtil.defineImmutable(network, {
      dnsSeeds: data.dnsSeeds
    });
  }

  if (data.bech32prefix) {
    JSUtil.defineImmutable(network, {
      bech32prefix: data.bech32prefix
    });
  }

  _.each(network, function(value) {
    if (!_.isUndefined(value) && !_.isObject(value)) {
      networkMaps[value] = network;
    }
  });

  networks.push(network);

  return network;

}

/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */
function removeNetwork(network) {
  for (var i = 0; i < networks.length; i++) {
    if (networks[i] === network) {
      networks.splice(i, 1);
    }
  }
  for (var key in networkMaps) {
    if (networkMaps[key] === network) {
      delete networkMaps[key];
    }
  }
}

addNetwork({
  name: 'livenet',
  alias: 'mainnet',
  pubkeyhash: 0x46, // F
  privatekey: 0x52, // R
  privatekey2: 0x34, // 4
  scripthash: 0x54, // T
  scripthash2: 0x65, // e
  bech32prefix: 'flo',
  xpubkey: 0x0134406b,
  xprivkey: 0x01343c31,
  networkMagic: 0xfdc0a5f1,
  port: 7312,
  dnsSeeds: [
    'seed1.florincoin.org',
    'node.oip.fun',
    'flodns.oip.li',
    'flodns.oip.fun',
    'flodns.seednode.net'
  ]
});

/**
 * @instance
 * @member Networks#livenet
 */
var livenet = get('livenet');

addNetwork({
  name: 'testnet',
  alias: 'test',
  pubkeyhash: 0x73,
  privatekey: 0xef,
  privatekey2: 0xef,
  scripthash: 0x54,
  scripthash2: 0x65,
  bech32prefix: 'tf',
  xpubkey: 0x013440e2,
  xprivkey: 0x01343c23,
  networkMagic: 0xfdc05af2,
  port: 17312,
  dnsSeeds: [
    'testnet.oip.fun'
  ]
});

/**
 * @instance
 * @member Networks#testnet
 */
 var testnet = get('testnet');

 addNetwork({
   name: 'regtest',
   alias: 'dev',
   pubkeyhash: 0x73,
   privatekey: 0xef,
   privatekey2: 0xef,
   scripthash: 0x54,
   scripthash2: 0x65,
   bech32prefix: 'fcrt',
   xpubkey: 0x043587CF,
   xprivkey: 0x04358394,
   networkMagic: 0xfabfb5da,
   port: 17412,
   dnsSeeds: [
     'dummySeed.invalid.'
   ]
 });
 
 /**
  * @instance
  * @member Networks#testnet
  */
 var regtest = get('regtest');
 
 /**
  * @function
  * @deprecated
  * @member Networks#enableRegtest
  * Will enable regtest features for testnet
  */
 function enableRegtest() {
   testnet.regtestEnabled = true;
 }
 
 /**
  * @function
  * @deprecated
  * @member Networks#disableRegtest
  * Will disable regtest features for testnet
  */
 function disableRegtest() {
   testnet.regtestEnabled = false;
 }
 
 /**
  * @namespace Networks
  */
 module.exports = {
   add: addNetwork,
   remove: removeNetwork,
   defaultNetwork: livenet,
   livenet: livenet,
   mainnet: livenet,
   testnet: testnet,
   regtest: regtest,
   get: get,
   enableRegtest: enableRegtest,
   disableRegtest: disableRegtest
 };
