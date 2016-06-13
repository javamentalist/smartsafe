contract FileSharing {
  struct Peer {
    address addr;
    string link;
  }

  struct File {
    address owner;
    string link;
  }

  mapping (bytes24 => File) filesMap;
  File[] filesArr;

  function saveFile(bytes24 hash, string link) constant returns(bool success) {
    filesMap[hash] = File(msg.sender, link);
    filesArr.push(File(msg.sender, link));
    return true;
  }

  function getFile() constant returns(uint length) {
    return filesArr.length;
  }
}
