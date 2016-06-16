contract FileSharing {
  struct Peer {
    address addr;
    string link;
  }

  struct File {
    address owner;
    string link;
  }

  mapping (uint => File) files;
  uint numFiles;

  function saveFile(string link) returns (uint fileId) {
    fileId = numFiles++;
    files[fileId].owner = msg.sender; 
    files[fileId].link = link;
  }

  function getLink(uint id) returns (string link) {
    link = files[id].link;
  }
}
