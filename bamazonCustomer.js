// global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
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
        console.log(`ID: Name: Price:`);
        for (var i = 0; i < results.length; i++) {
            console.log(`${results[i].item_id} ${results[i].product_name} ${results[i].price}`)
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
                var chosenItem;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.itemID)) {
                        chosenItem = results[i].product_name;
                    }
                }
                
                console.log(chosenItem);
                
            });
    });
}

