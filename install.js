var inquirer = require("inquirer");
var ui = new inquirer.ui.BottomBar();
var exec = require("child_process").exec;
const fs = require("fs");

inquirer
  .prompt([
    {
      type: "list",
      message:
        "\n\nLet's get SonicJs up and running!\n\nWhich database would you like to use?",
      name: "database",
      choices: [
        "Flat File",
        "MongoDB",
        "MySQL",
        { name: "SQL Server", value: "mssql" },
        "PostgreSQL",
        "Oracle",
        "Redis",
        "SQLite3",
        "In-Memory",
        "Cassandra",
        "Cloudant",
        "DashDB",
        "Db2",
        { name: "DB2 iSeries", value: "DB2iSeries" },
        { name: "DB2 for z/OS", value: "db2z" },
        "Informix",
        "OpenAPI",
      ],
    },
  ])
  .then((answers) => {
    // console.log(answers);

    let dbType = answers.database.toLowerCase();
    // installDBDriver(dbType);
    getDBConfig(dbType);
  })
  .catch((error) => {
    console.log(error);
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });

function installDBDriver(dbType) {
  if (doesRequireInstallation(dbType)) {
    var cmd = exec(`npm install loopback-connector-${dbType} --save`, function (
      err,
      stdout,
      stderr
    ) {
      if (err) {
        // handle error
        console.log(`Error has occurred: ${err}`);
      }
      console.log(stdout);
    });

    dir.on("exit", function (code) {
      // return value from "npm build"
      // console.log(`Installing successful. Now run "npm start"`);
    });
  } else {
    console.log(`Installing successful. Now run "npm start"`);
  }
}

function doesRequireInstallation(dbType) {
  if (dbType === "flat file" || dbType === "in-memory") {
    return false;
  }
  return true;
}

function getDBConfig(dbType) {
  if (!doesRequireInstallation(dbType)) {
    return;
  }

  // "host": "localhost",
  // "port": 27017,
  // "url": "mongodb://localhost:27017/sonicjs",
  // "database": "sonicjs",
  // "password": "",
  // "name": "mongodb",
  // "user": "",
  ui.log.write(
    "Press [enter] if you want to accepts the default value or type your own."
  );

  inquirer
    .prompt([
      {
        name: "host",
        message: "MongoDB Host:",
        default: "localhost",
      },
      {
        name: "port",
        message: "MongoDB Port:",
        default: "27017",
      },
      {
        name: "url",
        message: "MongoDB Url:",
        default: "mongodb://localhost:27017/sonicjs",
      },
      {
        name: "database",
        message: "MongoDB Database Name:",
        default: "sonicjs",
      },
      {
        name: "user",
        message: "MongoDB User:",
      },
      {
        name: "password",
        message: "MongoDB Port:",
      },
    ])
    .then((answers) => {
      answers.name = "db";
      answers.connector = "mongodb";
      writeConfig(answers);
      // Use user feedback for... whatever!!
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
}

function writeConfig(config) {
  // console.log(config);
  let data = fs.readFileSync("server/datasources.json");
  let configFile = JSON.parse(data);
  // console.log(configFile);

  //remove db and db-user
  delete configFile.db;
  delete configFile["db-user"];

  //add new config
  configFile.primary = config;
  // console.log(configFile);

  //write new config
  let newConfigFile = JSON.stringify(configFile, null, 2);

  fs.writeFile("server/datasources.json", newConfigFile, (err) => {
    if (err) throw err;
    console.log("Config file updated (server/datasources.json)");
  });
}
