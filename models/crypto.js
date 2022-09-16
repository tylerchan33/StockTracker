'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class crypto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  crypto.init({
    crypto_symbol: DataTypes.TEXT,
    crypto_price_bought: DataTypes.FLOAT,
    crypto_amount_bought: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'crypto',
  });
  return crypto;
};