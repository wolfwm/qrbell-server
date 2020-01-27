process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
 
(function() {
  var fetch = require('node-fetch');
 
  var CloudKit = require('./cloudkit');
  var containerConfig = require('./config');
 
  //CloudKit configuration
  CloudKit.configure({
    services: {
      fetch: fetch,
      logger: console
    },
    containers: [ containerConfig ]
  });

  var container = CloudKit.getDefaultContainer();
  var database = container.publicCloudDatabase;

  // A utility function for printing results to the console.
  var println = function(key,value) {
    console.log("--> " + key + ":");
    console.log(value);
    console.log();
  };

  container.setUpAuth()
    .then(function() {
      return database.performQuery({ recordType: 'GrupoCampainha'});
    })
    .then(function(response) {
      var record = response;
      println("Queried Records", record);
    })
    .then(function() {
      return database.performQuery({ recordType: 'Notification'});
    })
    .then(function(response) {
      var record = response;
      println("Queried Records", record);
    })
    .catch(function(error) {
      console.warn(error);
    });

  var express = require('express')
  var app = express()
  var port = process.env.PORT || 3000
  // HTTP: PORT=80
  // HTTPS: PORT=443
  var path = require('path')
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/haspwd', (req, res) => {
    var grpID = req.query.groupID

    container.setUpAuth()
    .then(function() {
      return database.fetchRecords(grpID);
    })
    .then(function(response) {
      var record = response.records[0];
      var passwordField = record.fields.Senha;

      // println("Fetched Record", record);
      
      if (passwordField && passwordField.value != '') {
        res.json({
          hasPwd: 'true'
        })
      } else {
        res.json({
          hasPwd: 'false'
        })
      }
    })
    .catch(function(error) {
      console.warn(error);
      
      res.json({
        hasPwd: 'not found'
      })
    });
  })
  
  app.post('/notification', (req, res) => {
    var password = req.body.password
    var visitorName = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
    var groupID

    if ('groupID' in req.body) {
      groupID = req.body.groupID
    } else {
      groupID = 'Test Group ID'
    }

    var groupPassword
    var doorbellName
    var usrIDs = []

    var records = []

    container.setUpAuth()
    .then(function() {
      return database.fetchRecords(groupID);
    })
    .then(function(response) {
      var fetchedRecord = response.records[0];
      var users = fetchedRecord.fields.Usuarios.value

      if ('Senha' in fetchedRecord.fields) {
        groupPassword = fetchedRecord.fields.Senha.value;
      }

      users.forEach(usrID => {usrIDs.push(usrID.recordName)})
      
      println("Fetched Record", fetchedRecord);
      println("Fetched Record", fetchedRecord);

      return database.fetchRecords(fetchedRecord.fields.Campainha.value.recordName);
    })
    .then(function(response) {
      var fetchedRecord = response.records[0];
      doorbellName = fetchedRecord.fields.Titulo.value

      if (!groupPassword || groupPassword == '' || groupPassword == password) {
        usrIDs.forEach(usrID => {
          records.push({
            recordType: 'Notification',
            fields: {
                NomeVisitante: { value: visitorName, type: 'STRING'},
                NomeCampainha: { value: doorbellName, type: 'STRING'},
                idGrupo: { value: { recordName: groupID, action: 'NONE'}, type: 'REFERENCE'},
                idUsuario: { value: { recordName: usrID, action: 'NONE'}, type: 'REFERENCE'}
            }
          })
        });

        res.json({
          msg: 'success'
        })
      } else {
        res.json({
          msg: 'wrongpsw'
        })
      }

      // println("Fetched Record", fetchedRecord);

      return records
    })
    .then(function(response) {
      if (!groupPassword || groupPassword == '' || password == groupPassword) {
        return database.newRecordsBatch().create(response).commit()
      }
    })
    .then(function(response) {
      // println("Saved Record", response.records[0])
    })
    .catch(function(error) {
      console.warn(error);

      res.json({
        msg: 'fail'
      })
    });
  })
  
  app.listen(port, () => console.log(`QR Bell listening on port ${port}!`))
 
})();