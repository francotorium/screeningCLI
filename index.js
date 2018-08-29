//keybase is a json object that is exported from secrets with the respective apiKey and baseID
//for the Airtable API
const {keyBase} = require('./secrets/secrets');
const Airtable = require('airtable');
const base = new Airtable({apiKey: `${keyBase['apiKey']}`}).base(`${keyBase['baseID']}`);
const {officers, gmFit} = require('./fields/fields');
const {table} = require('table'); 
const readline = require('readline');

const rl = readline.createInterface( process.stdin, process.stdout );
const question = function(question) {
    return new Promise( (res, req) => {
        rl.question( question, answer => {
            res(answer);
        })
    });
};

var data,output;
var wow;

data = [
    ['Name', '0b'],
    ['Why do you want to join ANova? How do you personally resonate with ANova\'s mission statement? (max 300 words)', 'answer'],
];
options = {
  columns: {
      0: {
          alignment: 'left',
          width: 50 
      },
      1: {
          alignment: 'center',
          minWidth: 50
      },
      2: {
          alignment: 'right',
          minWidth: 20
      }
  }
};
output = table(data, options);
console.log(output);
console.log(officers);
console.log(gmFit);

//creates a syncronous function program
(async function main() {
  var canScreen = false;
  var officersCandidates = {}
  //tracking which officer is reviewing applications 
  while (canScreen != true) {
      officer = await question('Hello ANova Officer! Please enter your name: ');
      officer = officer.toString().trim();
      if (officer) {
        officers.map(anovaOfficer => {
          if (anovaOfficer === officer) {
            canScreen = true;
          };
        });
      };
  };

  console.log( 'Thank you for your time and energy in reading these applications :)');
  console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
  rl.close();
  base('Screening').select({
    // Selecting all records from what have been screened so far 
    view: "Grid view"
  }).all().then((records) => {
      //method for automatically fetching all records across all pages 
      records.forEach(function(record) {
          console.log('Retrieved', record.get('Candidate Name'));
      });
      console.log("all candidates screened so far");
  }).catch(err => {
    if (err) { console.error(err); return; }
  });

  base('All Applications').select({
      view: "Grid view"
  }).all().then((records) => {
      //method for automatically fetching all records across all pages 
      records.forEach(function(record) {
          // console.log('Retrieved', record.get('Name'));
          //console.log(record.get('Name'));
          //console.log(record.get('Why do you want to join ANova? How do you personally resonate with ANova\'s mission statement? (max 300 words)'));
          //console.log(">>>>Next Candidate\n\n\n\n\n\n\n\n");
      });
      console.log("all applicants that have yet to to be reviewed");
  }).catch(err => {
    if (err) { console.error(err); return; }
  });
})();