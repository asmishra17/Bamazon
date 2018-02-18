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
    displayProducts();
    takeOrder();
});

function displayProducts () {
    connection.query("SELECT * FROM products", function(err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log("");
            console.log(`Item ID: ${results[i].item_id}`);
            console.log(`Name: ${results[i].product_name}`);
            console.log(`Price: $${results[i].price}`);
            console.log("");
        }
    });
};

function takeOrder () {
    connection.query("SELECT * FROM products", function (err, results) {
        inquirer 
            .prompt ([
                {
                    name: "itemID", 
                    type: "input",
                    message: "What is the ID of the product you would like to buy?"
                }, 
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to buy?"
                }
            ]).then(function(answer) {
                
                // get information about the chosen item
                var chosenItem;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.itemID)) {
                        chosenItem = results[i];
                    }
                }

                // determine if stock is sufficient 
                if (chosenItem.stock_quantity < parseInt(answer.units)) {
                    console.log("Insufficient quantity!");
                    // do something...restart or end?
                } else {
                    // fulfull order
                    var total = answer.units * chosenItem.price;
                    var test = chosenItem.stock_quantity - answer.units;
                    connection.query(
                        "UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity : test
                            },
                            {
                                item_id : parseInt(answer.itemID)
                            }
                        ],
                        function (error) {
                            if (error) {
                                throw error
                            }
                        }
                    )
                    displayTotal(total);
                }
            });
    });
}

function displayTotal(total) {
    console.log(`Your total is: $${total}`);
    console.log(`Thanks for shopping!`)
    // restart or end?
}

