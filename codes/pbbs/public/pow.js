importScripts("/sha256-uint8array.min.js");

onmessage = e => {
  const task = e.data;
  for (let i=0; ; i++) {
    if (i%0x1000==0) {
      postMessage({progress: i/0x1000000});
    }
    const hash = SHA256.createHash().update(i.toString()+task).digest();
    if (hash[0]==0 && hash[1]==0 && hash[2]==0) {
      postMessage({result: i.toString()});
      break;
    }
  }
};
