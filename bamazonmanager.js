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
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    addNew();
                    break;
            }
        });
    })
};

function viewProducts() {

};

function viewLow() {

};

function addInv() {

};

function addNew() {

};