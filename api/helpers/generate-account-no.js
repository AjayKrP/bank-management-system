module.exports = {


  friendlyName: 'Generate account no',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    return Math.floor(Math.random() * 1000000000);
  }


};

