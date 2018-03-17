/**
 * Created by zacharyjuang on 2016-05-26.
 */
"use strict";
const ip = require('ip');
const crypto = require('crypto');
const raw = require('raw-socket');

/**
 * generate pseudo-header. Used to calculate package checksum.
 * @param {number} srcIp - source ip as an integer
 * @param {number} dstIp - destination ip as an integer
 * @param {number} tcpPacketLength - tcp packet length
 * @return {Buffer} the pseudo-header, used later
 */
function genPseudoHeader(srcIp, dstIp, tcpPacketLength) {
  let pseudoHeader = Buffer.alloc(12);
  ip.toBuffer(srcIp).copy(pseudoHeader, 0);
  ip.toBuffer(dstIp).copy(pseudoHeader, 4);
  pseudoHeader.writeUInt8(6, 9);
  pseudoHeader.writeUInt16BE(tcpPacketLength, 10);
  return pseudoHeader;
}

/**
 * generate SYN packet
 * @param {number} srcIp - source ip as an integer
 * @param {number} dstIp - destination ip as an integer
 * @param {number} srcPort - source port
 * @param {number} dstPort - destination port
 * @return {Buffer} the TCP SYN packet
 */
function genSynPacket(srcIp, dstIp, srcPort, dstPort) {
  // A scaffolding TCP syn packet. Notice all zeroes except a few options.
  // The "few options" include setting the SYN flags.
  // Don't change it if you don't know what you're doing.
  let p = new Buffer('0000000000000000000000005002200000000000', 'hex');

  // Need 4 random bytes as sequence. Needs to be random to avoid collision.
  // You can choose your own random source. I chose the crypto module.
  crypto.randomBytes(4).copy(p, 4);
  p.writeUInt16BE(srcPort, 0);
  p.writeUInt16BE(dstPort, 2);

  // generate checksum with utility function
  // using a pseudo header and the tcp packet scaffold
  let sum = raw.createChecksum(genPseudoHeader(srcIp, dstIp, p.length), p);
  p.writeUInt16BE(sum, 16);

  return p;
}

module.exports = {
  genPseudoHeader,
  genSynPacket
};
