/*
    
    Al Curry          March 15, 2018
    
    GWU Full Stack Web Development program

    Homework 12B - Node JS & mySQL

    Using the inquirer (for terminal prompting) and mysql (for mysql db connectivity) npm packages, create a program that can serve as the product site's management utility.  
    
    This node js program provides a 
    list a set of menu options:
    View Products for Sale
    View Low Inventory
    Add to Inventory
    Add New Product

    If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
    If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
    If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
    If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

    Database schema defined in schema.sql (in bamazon-customer, hw 12A).

    Because of time constraints, most error checking and validation is not included, in a production environment it would be added.   

*/
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt({
      name: "action",   type: "rawlist",  message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
        viewProducts();
        break;

        case  "View Low Inventory":
        viewLowInv();
        break;

      case "Add to Inventory":
        addInv();
        break;

      case "Add New Product":
        addProduct();
        break;

      }
    });
}

/* function viewProducts() {
    var id = "";
    var product = "";
    var price = "";
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
  
      console.log("Items for sale".padStart(43));
      console.log("-------------- ".padStart(44));
      console.log("    id   |     product    |    department    |    price   |    quantity  ");
      for (var i = 0; i < res.length; i++) {
        id = res[i].item_id.toString();
        console.log(id.padStart(5), res[i].product_name.padStart(16), res[i].department_name.padStart(18),res[i].price.toFixed(2).padStart(13), res[i].stock_quantity.toString().padStart(15));
      }
        console.log();
        mainMenu();
    });
} 
 */
function viewProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
  
      console.log("Items for sale".padStart(43));
      console.log("-------------- ".padStart(44));
      console.log("    id   |     product    |    department    |    price   |    quantity  ");
      for (var i = 0; i < res.length; i++) {
        id = res[i].item_id.toString();
        console.log(id.padStart(5), res[i].product_name.padStart(16), res[i].department_name.padStart(18),res[i].price.toFixed(2).padStart(13), res[i].stock_quantity.toString().padStart(15));
      }
        console.log();
        mainMenu();
    });
} 

function viewLowInv() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
      if (err) throw err;
  
      console.log("Items for sale".padStart(43));
      console.log("-------------- ".padStart(44));
      console.log("    id   |     product    |    department    |    price   |    quantity  ");
      for (var i = 0; i < res.length; i++) {
        id = res[i].item_id.toString();
        console.log(id.padStart(5), res[i].product_name.padStart(16), res[i].department_name.padStart(18),res[i].price.toFixed(2).padStart(13), res[i].stock_quantity.toString().padStart(15));
      }
        console.log();
        mainMenu();
    });
} 
  
function addInv() {
    inquirer
      .prompt([
        {
          name: "id",  type: "input",  message: "Enter id to increase inventory: ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          name: "quantity",  type: "input",  message: "Enter new quantity: ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ]).then(function (answer) {
        console.log("Entered id = " + answer.id + ",  quantity = " + answer.quantity + "\n");
        var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
        connection.query(query, [answer.quantity,answer.id], function (err, res) {
          if (err) throw err;  
          
        });
          mainMenu();  
      })
  }
  
  function addProduct() {
    inquirer
      .prompt([
        {
          name: "productName",  type: "input",  message: "Enter product name to add: ",
        },
        {
          name: "departmentName",  type: "input",  message: "Enter department name of new product: ",
        },
        {
            name: "price",  type: "input",  message: "Enter price of new product: ",
        },
        {
            name: "quantity",  type: "input",  message: "Enter quantity of new product: ",
        }
      ]).then(function (answer) {
          console.log("Add product : " + answer.productName + ",  department :" + answer.departmentName + ", price : " + answer.price + ", quantity : " + answer.quantity + "\n");
        
          var query = connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ? ,?, ?)",[answer.productName, answer.productName, answer.price, answer.quantity],

              function (err, res) {
                if (err) throw err;  
              console.log(res.affectedRows + " product inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              //updateProduct();
            }
          );
          mainMenu();  
      })
  }
  






