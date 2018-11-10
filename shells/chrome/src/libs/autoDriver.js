async function sleep(timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout));
}

class AutoDriver {
  constructor() {
    this.state = 'IDLE';
  }

  update(rooms) {
    const { state } = this;
    if (state === 'IDLE') {
      this.state = 'DRIVING';
      this.drive(rooms);
    }
  }

  async drive(rooms) {
    const finishedRooms = new Set();
    const openingRooms = new Set();
    while (rooms && rooms.length > 0) {
      const room = rooms.shift();
      if (finishedRooms.has(room.url)) {
        continue;
      }
      console.log(openingRooms.size);
      while (openingRooms.size >= 1) {
        console.log('>=1');
        await sleep(1000);
      }
      openingRooms.add(room.url);
      chrome.tabs.create({ url: room.url, selected : false });
      await sleep(333);
    }
    this.state = 'DRIVING';
  }
};

module.exports = AutoDriver;
