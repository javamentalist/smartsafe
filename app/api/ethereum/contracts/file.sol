contract FileSharing {
  struct Peer {
    address addr;
    string link;
  }

  struct File {
    address owner;
    string link;
    Peer[] peers;
  }

  mapping (string => File) files;
  string[] fileHashes;
  uint fileLen;

  function saveFile(string hash, string link) returns (uint fileId) {
    files[hash].owner = msg.sender;
    files[hash].link = link;
    fileHashes.push(hash);
  }

  function getLink(string hash) constant returns (string link) {
    link = files[hash].link;
  }

  function getFile() constant returns (address, string) {
    if (fileHashes.length == 0) return;

    for (uint i = 0; i < fileHashes.length; i++) {
        File file = files[fileHashes[i]];
        if (file.peers.length == 0) return (file.owner, file.link);
    }
  }

  function addPeer(string hash, string link) {
    files[hash].peers.push(Peer(msg.sender, link));
  }

  function getPeers(string hash) constant returns (address, string) {
    Peer peer = files[hash].peers[0];
    return (peer.addr, peer.link);
  }
}
