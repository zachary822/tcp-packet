# tcp_packet

## Example

```javascript
const raw = require('raw-socket');
const {genSynPacket} = require('tcp_packet');

let s = raw.createSocket({
    protocol: raw.Protocol.TCP
});

// generate the packet.
let p = genSynPacket(srcIp, dstIp, srcPort, dstPort);

// send packet with offset 0, length = packet.length, to the dstIP
// The port data is in the packet already, so we don't worry about that during sending.
// Open tcpdump or wireshark and watch the not quite three way handshake. Useful to test for open ports.
s.send(p, 0, p.length, dstIp, function () {
  console.log("sent TCP SYN");
});
```

## License

[MIT](LICENSE)
