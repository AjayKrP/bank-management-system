/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  await User.destroy({});
  await Address.destroy({});
  await Branch.destroy({});
  //EmailService.sendWelcomeMail({email: 'kajay5080@gmail.com'});
  Branch.create({branchCode: 'SBIN0010203', branchName: 'Midc, Hinjewadi'}).exec(console.log);
  Branch.create({branchCode: 'SBIN0008784', branchName: 'Sanewadipune, Pune'}).exec(console.log);
  Address.create({
    street: 'Hinjewadi',
    city: 'Pune',
    postalCode: '411057',
    state: 'Maharashtra',
    country: 'India'
  }).exec(console.log);
  /*
  User.create({
    customerId: 123,
    password: 'ajay@1234',
    firstName: 'Ajay',
    lastName: 'Kumar',
    email: 'kajay5080@gmail.com',
    phone: 8208643713,
    address: 1
  }).exec(console.log); */
  //User.find({firstName:'Ajay'}).populate('address').exec(function(err,r){console.log(r[0].toJSON())});
};
