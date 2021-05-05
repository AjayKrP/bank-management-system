const Queue = require('bull');

/**
 * Create History service provider
 */
class HistoryServiceQueue {
  constructor() {
    // initialize queue
    this.queue = new Queue('email');
    // add a worker
    this.queue.process('email', job => {
      this.sendEmail(job);
    });
  }

  /**
   * Adding account history provider here
   * @param data
   */
  addEmailToQueue(data) {
    this.queue.add('email', data);
  }

  /**
   * Send email after job successfully completed
   * @param job
   * @returns {Promise<void>}
   */
  async sendEmail(job) {
    const {email, url} = job.data;
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
