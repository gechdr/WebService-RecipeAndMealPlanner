const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t3_6958", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

class Restriction extends Model {};

Restriction.init(
	{
		restriction_id: {
			type: DataTypes.BIGINT(11),
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.STRING(14),
			allowNull: false
		},
		restriction: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Restriction",
		tableName: "restrictions",
	}
);

module.exports = Restriction;