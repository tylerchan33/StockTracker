'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_cryptos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_cryptos.init({
    userId: DataTypes.INTEGER,
    cryptoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_cryptos',
  });
  return users_cryptos;
};