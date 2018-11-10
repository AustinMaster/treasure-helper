function crawlRooms() {
  const rooms = [];
  document.querySelectorAll('a[rel=noreferrer]').forEach(elem =>{
    const url = elem.getAttribute('href');
    if (url.startsWith('http://www.douyu.com') || url.startsWith('https://www.douyu.com')) {
      try {
        const startTime = elem.children[0].children[1].children[0].children[1].textContent;
        const surplusTime = elem.children[0].children[1].children[1].children[1].textContent;
        rooms.push({
          url,
          startTime,
          surplusTime,
        });
      } catch (e) {
        // nothing to do
      }
    }
  });
  return rooms;
}

const port = chrome.runtime.connect({ name: 'xiaohulu' });
port.onMessage.addListener(msg => {
  const { type } = msg;
  if (type === 'enable') {
    const data = crawlRooms();
    console.log('data:', data);
    port.postMessage({ type: 'update_rooms', data });
  }
});
