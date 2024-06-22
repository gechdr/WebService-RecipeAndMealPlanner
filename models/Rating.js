const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t3_6958", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

class Rating extends Model {};

Rating.init(
	{
		rating_id: {
			type: DataTypes.BIGINT(11),
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		recipe_id: {
			type: DataTypes.STRING(6),
			allowNull: false
		}, 
		user_id: {
			type: DataTypes.STRING(14),
			allowNull: false
		},
		rating: {
			type: DataTypes.STRING(1),
			allowNull: false
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Rating",
		tableName: "ratings",
	}
);

module.exports = Rating;