contract FileSharing {
  struct Peer {
    address addr;
    string link;
  }

  struct File {
    address owner;
    string link;
  }

  mapping (bytes24 => File) files;

  function saveFile(bytes24 hash, string link) constant returns(bool success) {
    files[hash] = File(msg.sender, link);
    return true;
  }
}
