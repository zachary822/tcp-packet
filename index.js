/**
 * Created by zacharyjuang on 2016-05-26.
 */
"use strict";
var ip = require('ip');
var crypto = require('crypto');
var raw = require('raw-socket');
// tcp packet generator functions.
var genPseudoHeader = function (srcIp, dstIp, tcpPacketLength) {
  var pseudoHeader = Buffer.alloc(12);
  ip.toBuffer(srcIp).copy(pseudoHeader, 0);
  ip.toBuffer(dstIp).copy(pseudoHeader, 4);
  pseudoHeader.writeUInt8(6, 9);
  pseudoHeader.writeUInt16BE(tcpPacketLength, 10);
  return pseudoHeader;
};

var genSynPacket = function (src, dst, srcPort, dstPort) {
  var p = new Buffer('0000000000000000000000005002200000000000', 'hex');
  crypto.randomBytes(4).copy(p, 4);
  p.writeUInt16BE(srcPort, 0);
  p.writeUInt16BE(dstPort, 2);

  var sum = raw.createChecksum(genPseudoHeader(src, dst, p.length), p);
  p.writeUInt16BE(sum, 16);

  return p;
};

module.exports = {
  genPseudoHeader,
  genSynPacket
};
