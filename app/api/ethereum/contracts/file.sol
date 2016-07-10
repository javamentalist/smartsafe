contract FileSharing {
  struct Peer {
    address addr;
    string link;
  }

  struct File {
    address owner;
    string link;
  }

  mapping (string => File) files;
  File[] fileArr;
  uint fileLen;

  function saveFile(string hash, string link) returns (uint fileId) {
    files[hash].owner = msg.sender;
    files[hash].link = link;
    fileArr.push(File(msg.sender, link));
  }

  function getLink(string hash) returns (string link) {
    link = files[hash].link;
  }

  function getFile() returns (address, string) {
    if (fileArr.length == 0) return (0, '');
    address owner = fileArr[1].owner;
    string link = fileArr[1].link;
    return (owner, link);
  }
}
