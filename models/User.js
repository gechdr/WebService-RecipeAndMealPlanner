const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t3_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class User extends Model {}

User.init(
	{
		user_id: {
			type: DataTypes.STRING(14),
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		dob: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		gender: {
			type: DataTypes.STRING(1),
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: false,
		modelName: "User",
		tableName: "users",
	}
);

module.exports = User;
