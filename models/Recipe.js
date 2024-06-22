const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t3_6958", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

class Recipe extends Model {};

Recipe.init(
	{
		recipe_id: {
			type: DataTypes.STRING(6),
			primaryKey: true,
			allowNull: false
		},
		user_id: {
			type: DataTypes.STRING(14),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		ingredients: {
			type: DataTypes.JSON,
			allowNull: false
		},
		steps: {
			type: DataTypes.JSON,
			allowNull: false
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Recipe",
		tableName: "recipes",
	}
);

module.exports = Recipe;