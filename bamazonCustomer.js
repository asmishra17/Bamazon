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
                
                // get information about the chosen item
                var chosenItem;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.itemID)) {
                        chosenItem = results[i];
                    }
                }

                console.log(chosenItem);

                // determine if stock is sufficient 
                if (chosenItem.stock_quantity < parseInt(answer.units)) {
                    console.log("Insufficient quantity!");
                    // do something...
                } else {
                    // fulfull order
                    console.log("Order filled");
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
                            console.log("Stock updated!")
                        }
                    )
                    displayTotal();
                }
            });
    });
}

function updateStock() {
    connection.query(
        "UPDATE products SET ? WHERE ?", 
        [
            {
                stock_quantity : stock_quantity - answer.units
            },
            {
                item_id : parseInt(answer.itemID)
            }
        ],
        function (error) {
            if (error) {
                throw error
            }
            console.log("Stock updated!")
        }
    )
};


function displayTotal() {

}
