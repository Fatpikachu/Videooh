const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');

const {
  database,
  username,
  password,
  host,
  port,
} = require('../../config/config.js');

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  operatorsAliases: false,
  logging: false,
  pool: { maxConnections: 5, maxIdleTime: 15 },
  dialectOptions: {
    requestTimeout: 5000,
  },
});

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  imageurl: Sequelize.STRING,
});



/// USE THIS TO SEED DB ///////

// sequelize.sync({ force: true, logging: console.log }).then(async () => {
//   /////////////////////////////
// })
// .catch((error) => {
//   console.log("error in sequelize sync:", error);
// });

/////////////////////////////

module.exports = {
  User,
};
