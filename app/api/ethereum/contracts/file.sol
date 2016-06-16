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

  function saveFile(string hash, string link) returns (uint fileId) {
    files[hash].owner = msg.sender;
    files[hash].link = link;
  }

  function getLink(string hash) returns (string link) {
    link = files[hash].link;
  }
}
