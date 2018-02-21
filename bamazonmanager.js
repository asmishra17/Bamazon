// global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // username
    user: "root",
  
    // password
    password: "",
    database: "bamazon"
  });

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) {
        throw err;
    }
    // run the start function after the connection is made to prompt the user
    start();
});

function start () {
    connection.query("SELECT * FROM products", function (err, results) {
        inquirer 
        .prompt ([
            {
                name: "action",
                type: "list",
                message: "Welcome. What would you like to do?", 
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]
            }
        ]).then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts(results);
                    break;
                case "View Low Inventory":
                    viewLow(results);
                    break;
                case "Add to Inventory":
                    addInv(results);
                    break;
                case "Add New Product":
                    addNew(results);
                    break;
            }
        });
    })
};

function viewProducts(results) {
    for (var i = 0; i < results.length; i++) {
        console.log("");
        console.log(`Item ID: ${results[i].item_id}`);
        console.log(`Name: ${results[i].product_name}`);
        console.log(`Price: $${results[i].price}`);
        console.log(`Quantity: ${results[i].stock_quantity}`);
        console.log("");
    }
    restart();
};

function viewLow(results) {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log("");
            console.log(`Item ID: ${results[i].item_id}`);
            console.log(`Name: ${results[i].product_name}`);
            console.log(`Price: $${results[i].price}`);
            console.log(`Quantity: ${results[i].stock_quantity}`);
            console.log("");
        }
    });
    restart();
};

function addInv(results) {

    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "Which product would you like to add stock to?", 
        },
        {
            name: "units",
            type: "input",
            message: "How many units would you like to add?"
        }
    ]).then(function(answer) {
        // update database
        // get information about chosen item
        var chosenItem;

        for (var i = 0; i < results.length; i++) {

            if (results[i].product_name === answer.name) {
                chosenItem = results[i];
            }
        }

        var updatedStock = chosenItem.stock_quantity + parseInt(answer.units);
        connection.query(
            "UPDATE products SET ? WHERE ?", 
            [
                {
                    stock_quantity : updatedStock
                },
                {
                    product_name : answer.name
                }
            ],
            function (error) {
                if (error) {
                    throw error
                }
            },

            console.log(`${answer.name} added!`)
        )
    })
};
    

function addNew() {
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you'd like to add?", 
        },
        {
            name: "department",
            type: "input",
            message: "What department does it belong to?",
        },
        {
            name: "price",
            type: "input",
            message: "What is the price?",
        },
        {
            name: "units",
            type: "input",
            message: "How many units would you like to add?",
        }
    ]).then(function(answer) {
        connection.query(
            "INSERT INTO products SET ?",
                {
                    product_name : answer.name,
                    department_name : answer.department,
                    price : answer.price,
                    stock_quantity : answer.units
                },
            function (error) {
                if (error) {
                    throw error
                }
            },

            console.log(`${answer.name} added!`)
        )
    })
};

function restart () {
    connection.query("SELECT * FROM products", function (err, results) {
        inquirer 
        .prompt ([
            {
                name: "action",
                type: "list",
                message: "What would you like to do?", 
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ]
            }
        ]).then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts(results);
                    break;
                case "View Low Inventory":
                    viewLow(results);
                    break;
                case "Add to Inventory":
                    addInv(results);
                    break;
                case "Add New Product":
                    addNew(results);
                    break;
            }
        });
    })
};