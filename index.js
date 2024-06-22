const express = require("express");

const app = express();
app.set("port", 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t3_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const User = require("./models/User");
const Recipe = require("./models/Recipe");
const Restriction = require("./models/Restriction");
const Rating = require("./models/Rating");
const Comment = require("./models/Comment");

User.hasMany(Recipe, { foreignKey: "user_id" });
Recipe.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Comment, { foreignKey: "user_id"});
Comment.belongsTo(User, {foreignKey: "user_id"});

Recipe.hasMany(Comment, { foreignKey: "recipe_id"});
Comment.belongsTo(Recipe, { foreignKey: "recipe_id"});

// Functions
function isValidDate(date) {
	if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return false;

	var tempDate = date.split("/");
	if (tempDate.length == 0) {
		return false;
	}

	var day = parseInt(tempDate[0], 10);
	var month = parseInt(tempDate[1], 10);
	var year = parseInt(tempDate[2], 10);

	if (year < 1000 || year > 3000 || month <= 0 || month > 12) return false;

	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;

	return day > 0 && day <= monthLength[month - 1];
}

async function generateUserID(year) {
	// USR<DDMM><YYYY><3 digit nomor serial>
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth() + 1;

	let tempID = "USR" + day.toString().padStart(2, "0") + month.toString().padStart(2, "0") + year.toString();

	// Find Last ID
	let users = await User.findAll({
		where: {
			user_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (users.length > 0) {
		users.forEach((user) => {
			let user_id = user.user_id;
			lastID = user_id.substring(11, 14);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

async function generateRecipeID() {
	let tempID = "REC";

	// Find Last ID
	let recipes = await Recipe.findAll({
		where: {
			recipe_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (recipes.length > 0) {
		recipes.forEach((recipe) => {
			let recipe_id = recipe.recipe_id;
			lastID = recipe_id.substring(3, 6);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

async function getRating(recipe_id){
	let ratings = await Rating.findAll({
		where: {
			recipe_id : {
				[Op.like] : '%' + recipe_id + '%'
			}
		}
	});

	if (ratings.length == 0) {
		return null;
	}

	let sumRating = 0.00;
	ratings.forEach(rating => {
		sumRating += parseFloat(rating.rating);
	});
	let curRating = sumRating / ratings.length;
	let newRating = (Math.round(curRating * 100) / 100).toFixed(2);

	return newRating;
}

// Points
// 1
app.post("/api/users", async (req, res) => {
	let { email, display_name, dob, gender } = req.body;

	// Empty Input
	if (!email || !display_name || !dob || !gender) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Unique Email
	let users = await User.findAll({
		where: {
			email: {
				[Op.eq]: email,
			},
		},
	});

	if (users.length > 0) {
		return res.status(400).send({
			message: "Email is already registered",
		});
	}

	// DOB Format
	if (!isValidDate(dob)) {
		return res.status(400).send({
			message: "Invalid date of birth format",
		});
	}

	// Gender
	if (gender.toUpperCase() != "L" && gender.toUpperCase() != "P") {
		return res.status(400).send({
			message: "Invalid gender",
		});
	}

	// Generate ID
	let tempDate = dob.split("/");
	let year = parseInt(tempDate[2], 10);
	let newID = await generateUserID(year);

	// Insert
	try {
		user = await User.create({
			user_id: newID,
			name: display_name,
			email: email,
			dob: dob,
			gender: gender.toUpperCase(),
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		user_id: newID,
		display_name: display_name,
		email: email,
	});
});

// 2
app.post("/api/recipes", async (req, res) => {
	let { user_id, name, description, ingredients, steps } = req.body;

	// Empty Input
	if (!user_id || !name || !description || !ingredients || !steps) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid UserID
	let users = await User.findAll({
		where: {
			user_id: {
				[Op.eq]: user_id,
			},
		},
	});

	if (users.length == 0) {
		return res.status(404).send({
			message: "User not found",
		});
	}

	// Generate ID
	let newID = await generateRecipeID();

	// Insert
	try {
		recipe = await Recipe.create({
			recipe_id: newID,
			user_id: user_id,
			name: name,
			description: description,
			ingredients: ingredients,
			steps: steps,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	// Get Data
	let user = await User.findByPk(user_id);
	let username = user.dataValues.name;

	return res.status(201).send({
		recipe_id: newID,
		user_id: user_id,
		name: name,
		description: description,
		by: username,
		total_ingredients: ingredients.length,
		total_steps: steps.length,
	});
});

// 3
app.post("/api/restrictions", async (req, res) => {
	let { keyword, user_id } = req.body;

	// Empty Input
	if (!keyword || !user_id) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid User
	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send({
			message: "User not found",
		});
	}

	// Duplicate Entry
	let dupli = await Restriction.findAll({
		where: {
			restriction: {
				[Op.eq]: keyword,
			},
		},
	});

	if (dupli.length > 0) {
		return res.status(400).send({
			message: "Duplicate restriction",
		});
	}

	// Insert
	try {
		restriction = await Restriction.create({
			user_id: user_id,
			restriction: keyword,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	// Get Data
	let tempRestriction = await Restriction.findAll({
		where: {
			user_id: {
				[Op.eq]: user_id,
			},
		},
	});

	let restrictions = [];
	tempRestriction.forEach((restriction) => {
		restrictions.push(restriction.restriction);
	});

	return res.status(201).send({
		message: "Restriction successfully added",
		restrictions: restrictions,
	});
});

// 4
app.put("/api/recipes", async (req, res) => {
	let { recipe_id, user_id, name, description } = req.body;

	if (!recipe_id || !user_id) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid RecipeID
	let recipe = await Recipe.findByPk(recipe_id);
	if (!recipe) {
		return res.status(404).send({
			message: "Recipe does not exist",
		});
	}

	// Valid Recipe-User
	let tempRecipeUserID = recipe.dataValues.user_id;
	if (tempRecipeUserID != user_id) {
		return res.status(401).send({
			message: "Unauthorized access!",
		});
	}

	// Get Data
	let recipeName = recipe.dataValues.name;
	let recipeDescription = recipe.dataValues.description;
	let recipeIngredients = JSON.parse(recipe.dataValues.ingredients);
	let recipeSteps = JSON.parse(recipe.dataValues.steps);

	// Update
	try {
		recipe = await Recipe.update(
			{
				name: name ? name : recipeName,
				description: description ? description : recipeDescription,
			},
			{
				where: {
					recipe_id: recipe_id,
				},
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Update Failed",
			error,
		});
	}

	return res.status(200).send({
		recipe_id: recipe_id,
		name: name ? name : recipeName,
		description: description ? description : recipeDescription,
		total_ingredients: recipeIngredients.length,
		total_steps: recipeSteps.length,
	});
});

// 5
app.get("/api/recipes", async (req, res) => {
	let { name, user_id, filter } = req.query;

	// Empty Input
	if (!user_id) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid UserID
	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send({
			message: "User not found",
		});
	}

	// Searching
	let recipes;
	if (filter == 1) {
		// ON
		let restriction = await Restriction.findAll({
			where: {
				user_id: {
					[Op.like]: '%' + user_id + '%'
				}
			},
			attributes: [
				"restriction"
			]
		})
		let avoid = [];
		restriction.forEach(restriction => {
			let res = restriction.restriction;
			avoid.push(res);
		});

		recipes = await Recipe.findAll({
			where: {
				name: {
					[Op.like]: name ? "%" + name + "%" : "%%",
					[Op.notLike]: `%${avoid.join('%')}%`
				},
			},
			attributes: {
				exclude: ["user_id", "description", "ingredients", "steps"],
				include: [[Sequelize.col("User.name"), "by"]],
			},
			include: [
				{
					model: User,
					attributes: [],
				},
			],
		});
		
	} else if (!filter || filter == 0) {
		// OFF
		recipes = await Recipe.findAll({
			where: {
				name: {
					[Op.like]: name ? "%" + name + "%" : "%%",
				},
			},
			attributes: {
				exclude: ["user_id", "description", "ingredients", "steps"],
				include: [[Sequelize.col("User.name"), "by"]],
			},
			include: [
				{
					model: User,
					attributes: [],
				},
			],
		});
	}

	return res.status(200).send({
		total: recipes.length,
		recipes: recipes,
	});
});
app.get("/api/recipes/:recipe_id", async (req, res) => {
	let { recipe_id } = req.params;

	// Empty Input
	if (!recipe_id) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Get Data
	let recipe = await Recipe.findByPk(recipe_id);
	let recipeName = recipe.dataValues.name;
	let recipeDesc = recipe.dataValues.description;
	let recipeUser = recipe.dataValues.user_id;
	let recipeIngredients = JSON.parse(recipe.dataValues.ingredients);
	let recipeSteps = JSON.parse(recipe.dataValues.steps);

	let user = await User.findByPk(recipeUser);
	let userName = user.dataValues.name;

	let curRating = await getRating(recipe_id);

	let comments = await Comment.findAll({
		where: {
			recipe_id:{
				[Op.like]: '%' + recipe_id + '%'
			}
		},
		attributes: {
			exclude: [
				"comment_id",
				"recipe_id",
				"user_id"
			],
			include: [
				[Sequelize.col("User.name"), "by"]
			]
		},
		include: [
			{
				model: User,
				attributes: []
			}
		]
	})

	let result = {
		name: recipeName,
		description: recipeDesc,
		by: userName,
		rating: curRating,
		ingredients: recipeIngredients,
		steps: recipeSteps,
		comments: comments
	}


	return res.status(200).send(result);
});

// 6
app.get("/api/users", async (req, res) => {
	let { name } = req.query;

	// Searching
	let users = await User.findAll({
		where: {
			name: {
				[Op.like]: name ? "%" + name + "%" : "%%",
			},
		},
		attributes: ["user_id", "name"],
	});

	if (users.length == 0) {
		return res.status(404).send({
			message: "User not found",
		});
	}

	return res.status(200).send({
		users: users,
	});
});

// 7
app.post("/api/ratings", async (req, res) => {
	let { user_id, recipe_id, rating } = req.body;

	// Empty Input
	if (!user_id || !recipe_id || !rating) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid UserID
	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send({
			message: "User not found"
		})
	}

	// Valid RecipeID
	let recipe = await Recipe.findByPk(recipe_id);
	if (!recipe) {
		return res.status(404).send({
			message: "Recipe not found"
		})
	}

	// Valid Rating
	if (rating < 1 || rating > 5) {
		return res.status(400).send({
			message: "Invalid input"
		})
	}

	// Duplicate Rating
	let dupli = await Rating.findAll({
		where: {
			recipe_id: {
				[Op.eq]: recipe_id
			},
			user_id: {
				[Op.eq]: user_id
			}
		}
	})
	if (dupli.length > 0) {
		return res.status(400).send({
			message: "You've already rated this recipe"
		})
	}

	// Insert
	try {
		rating = await Rating.create({
			recipe_id: recipe_id,
			user_id: user_id,
			rating: rating
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	// Get Data
	let recipeName = recipe.dataValues.name;
	let curRating = await getRating(recipe_id);

	return res.status(201).send({
		message: "Rating successfully updated",
		name: recipeName,
		current_rating: curRating
	})
});

// 8
app.post("/api/comments", async (req,res) => {
	let {user_id, recipe_id, comment} = req.body;

	// Empty Input
	if (!user_id || !recipe_id || !comment) {
		return res.status(400).send({
			message: "Invalid input"
		})
	}

	// Valid UserID
	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send({
			message: "User does not exist"
		})
	}

	// Valid RecipeID
	let recipe = await Recipe.findByPk(recipe_id);
	if (!recipe) {
		return res.status(404).send({
			message: "Recipe does not exist"
		})
	}

	// Insert
	try {
		tempComment = await Comment.create({
			recipe_id: recipe_id,
			user_id: user_id,
			content: comment
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	// Get Data
	let recipeUser = recipe.dataValues.user_id;
	let comments = await Comment.findAll({
		where: {
			recipe_id:{
				[Op.like]: '%' + recipe_id + '%'
			}
		},
		attributes: {
			exclude: [
				"comment_id",
				"recipe_id",
				"user_id"
			],
			include: [
				[Sequelize.col("User.name"), "by"]
			]
		},
		include: [
			{
				model: User,
				attributes: []
			}
		],
		limit: 3,
		order: [
			["comment_id","DESC"]
		]
	})

	return res.status(201).send({
		recipe_id: recipe_id,
		user_id: recipeUser,
		latest_comments: comments
	})
})

// 9
app.delete("/api/recipes/:recipe_id", async (req, res) => {
	let { recipe_id } = req.params;

	// Empty Input
	if (!recipe_id) {
		return res.status(400).send({
			message: "Invalid input",
		});
	}

	// Valid RecipeID
	let recipe = await Recipe.findByPk(recipe_id);
	if (!recipe) {
		return res.status(404).send({
			message: "Recipe not found",
		});
	}

	// Delete
	try {
		recipe = await Recipe.destroy({
			where: {
				recipe_id: recipe_id,
			},
		});
	} catch (error) {
		return res.status(400).send({
			message: "Delete Failed",
			error,
		});
	}

	return res.status(200).send({
		recipe_id: recipe_id,
		message: "Recipe is successfully deleted",
	});
});

app.listen(app.get("port"), () => {
	console.log(`Server started at http://localhost:${app.get("port")}`);
});
