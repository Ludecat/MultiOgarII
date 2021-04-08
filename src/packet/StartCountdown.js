class StartCountdown {
  constructor(countdownTime = 3000) {
    this.countdownTime = countdownTime;
  }

  build() {
    return {
      messageId: "startCountdown",
      countdownTime: this.countdownTime,
    };
  }
}

module.exports = StartCountdown;
