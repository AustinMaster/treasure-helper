async function sleep (timeout) {
  return new Promise((resolve) => setTimeout(() => resolve(), timeout));
}

class AutoAnswer {
  constructor ({ setting }) {
    this.setting = setting;
    this.state = 'INIT';
  }

  findAnswer () {
    const content = document.getElementsByClassName('Barrage-main')[0].innerText.toUpperCase();
    const answerContent = content.replace(/[^ABC]/g, '');
    const statistic = { A: 0, B: 0, C: 0 };
    answerContent.split('').map(c => ++statistic[c]);
    return Object.entries(statistic).sort((a, b) => b[1] - a[1])[0][0];
  }

  async bfMainLoop (ans) {
    console.log('auto_answer[bf] started');
    while (true) {
      const preview = document.querySelectorAll("div[class^='answerPreview']");
      const elems = document.querySelectorAll("div[class^='answerProblem'] ul li");
      if (preview && preview.length > 0 && elems && elems.length > 0) {
        const answer = ans || this.findAnswer();
        console.log('answer: ', answer);
        for (let i = 0; i < 20; ++i) {
          try {
            if (answer === 'A') {
              elems[0].click();
            } else if (answer === 'B') {
              elems[1].click();
            } else if (answer === 'C') {
              elems[2].click();
            }
          } catch (e) {
            // do nothing
          }
          await sleep(20);
        }
        await sleep(1000);
        setTimeout(() => window.location.reload(), 18 * 60 * 1000);
      }
      await sleep(100);
    }
  }

  async smartMainLoop (ans) {
    console.log('auto_answer[smart] started');
    this.state = 'IDLE';

    while (true) {
      console.log('state:', this.state);
      if (this.state === 'IDLE') {
        const preview = document.querySelectorAll("div[class^='answerPreview']");
        if (preview && preview.length > 0) {
          console.log('prepare to answer the problem');
          this.state = 'READY';
        }
      } else if (this.state === 'READY') {
        const elems = document.querySelectorAll("div[class^='answerProblem'] ul li");
        if (elems && elems.length > 0) {
          const answer = ans || this.findAnswer();
          console.log('answer: ', answer);
          for (let i = 0; i < 20; ++i) {
            try {
              if (answer === 'A') {
                elems[0].click();
              } else if (answer === 'B') {
                elems[1].click();
              } else if (answer === 'C') {
                elems[2].click();
              }
            } catch (e) {
              // do nothing
            }
            await sleep(20);
          }
          this.state = 'IDLE';

          setTimeout(() => window.location.reload(), 18 * 60 * 1000);
        }
      }
      await sleep(this.state === 'IDLE' ? 5000 : 50);
    }
  }

  install () {
    const { setting } = this;
    if (!setting.autoAnswerEnabled) {
      return;
    }
    setting.autoAnswerMode === 'smart' ? this.smartMainLoop() : this.bfMainLoop();
  }
};

module.exports = AutoAnswer;
