const Queue = require('bull');

class HistoryServiceQueue {
  constructor() {
    // initialize queue
    this.queue = new Queue('accountHistory');
    // add a worker
    this.queue.process('email', job => {
      this.sendEmail(job);
    });
  }

  addEmailToQueue(data) {
    this.queue.add('history', data);
  }

  async sendEmail(job) {
    const { email, url } = job.data;
    try {
      EmailService.sendMail({email: email, attachment: url});
      await job.moveToCompleted('done', true);
    } catch (error) {
      if (error.response) {
        job.moveToFailed({message: 'job failed'});
      }
    }
  }
}

module.exports = {
  history: new HistoryServiceQueue()
};
