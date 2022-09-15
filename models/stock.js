'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.stock.belongsToMany(models.user, { through: "users_stocks "})
    }
  }
  stock.init({
    stock_symbol: DataTypes.TEXT,
    price_bought: DataTypes.FLOAT,
    shares_bought: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'stock',
  });
  return stock;
};