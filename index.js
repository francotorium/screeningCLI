//keybase is a json object that is exported from secrets with the respective apiKey and baseID
//for the Airtable API
const { keyBase } = require('./secrets/secrets');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: `${keyBase['apiKey']}` }).base(`${keyBase['baseID']}`);
const { officers, gmFit } = require('./fields/fields');
const { queries, queries_screening } = require('./fields/queries');
const { table } = require('table');
const readline = require('readline');
const terminalLink = require('terminal-link');
const link = terminalLink('My Website', 'https://francotorium.com');
console.log(link);
var screenLst = [];
var screenNames = [];
var candidateLst = [];

//implements the Fisher Yates shuffle algorithm 
//https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
fyShuffle = (array) => {
      for (let index = array.length - 1; index !== 0; index--) {
          var randomIndex = Math.floor(Math.random() * index);  
          var currVal = array[index];
          array[index] = array[randomIndex];
          array[randomIndex] = currVal; 
      }
    return array;
  }

const hasNextCandidate = () => {
    return candidateLst.length != 0;
};

const nextCandidate = () => {
    return candidateLst.pop();
};

const addCandidate = (candidateToAdd) => {
    console.log(candidateToAdd);
    candidateLst.push(candidateToAdd);
    candidateLst = fyShuffle(candidateLst);
};

const rl = readline.createInterface(process.stdin, process.stdout);

const validateOfficer = function (question) {
    return new Promise((res, req) => {
        rl.question(question, answer => {
            res(answer);
        })
    });
};

const screenDecision = function (question) {
    return new Promise((res, req) => {
        rl.question(question, answer => {
            res(answer);
        });
    });
};
console.log(officers);
//creates a syncronous function program
(async function startScreen() {
    var canScreen = false;
    var currOfficer = 'Carmen+Jesse';
    //tracking which officer is reviewing applications 
    while (canScreen != true) {
        const officer = await validateOfficer('Hello ANova Officer! Please enter your name: ');
        currOfficer = officer.toString().trim();
        if (currOfficer) {
            officers.map(anovaOfficer => {
                if (anovaOfficer === currOfficer) {
                    canScreen = true;
                };
            });
        };
    };
    rl.pause();
    await base('Screening').select({
        // Selecting all records from what have been screened so far 
        // Select only Candidate records that have been screened by the Current Officer
        filterByFormula: `{Officer}="${currOfficer}"`,
        view: "Grid view"
    }).all().then((records) => {
        //method for automatically fetching all records across all pages 
        records.forEach(function (record) {
            const candidateScreen = {
                "00_name": record.get(`${queries_screening["00_name"]}`),
                "01_gm_fit": record.get(`${queries_screening["01_gm_fit"]}`),
                "02_officer": record.get(`${queries_screening["02_officer"]}`),
                "03_timestamp": record.get(`${queries_screening["03_timestamp"]}`),
                "04_comments": record.get(`${queries_screening["04_comments"]}`),
                "05_portfolio": record.get(`${queries_screening["05_portfolio"]}`),
                "06_resume": record.get(`${queries_screening["06_resume"]}`)
            }
            screenLst.push(candidateScreen);
            screenNames.push(candidateScreen["00_name"]);
        });
        console.log(screenLst);
        console.log("all candidates screened so far");
    }).catch(err => {
        if (err) { console.error(err); return; }
    });

    await base('All Applications').select({
        view: "Grid view"
    }).all().then((records) => {
        //method for automatically fetching all records across all pages 
        records.forEach(function (record) {
            const candidateToReview = {
                "00_name": record.get(`${queries["00_name"]}`),
                "00_name": record.get(`${queries["00_name"]}`),
                "01_mission": record.get(`${queries["01_mission"]}`),
                "02_teach": record.get(`${queries["02_teach"]}`),
                "03_first": record.get(`${queries["03_first"]}`),
                "04_first_explain": record.get(`${queries["04_first_explain"]}`),
                "05_second": record.get(`${queries["05_second"]}`),
                "06_second_explain": record.get(`${queries["06_second_explain"]}`),
                "07_commitments": record.get(`${queries["07_commitments"]}`),
                "08_retreat": record.get(`${queries["08_retreat"]}`),
                "09_questions": record.get(`${queries["09_questions"]}`),
                "10_time": record.get(`${queries["10_time"]}`),
                "11_email": record.get(`${queries["11_email"]}`),
                "12_number": record.get(`${queries["12_number"]}`),
                "13_number": record.get(`${queries["13_number"]}`),
                "14_number": record.get(`${queries["14_timestamp"]}`),
                "15_systemic": record.get(`${queries["15_systemic"]}`),
                "16_classes": record.get(`${queries["16_classes"]}`),
                "17_languages": record.get(`${queries["17_languages"]}`),
                "18_social": record.get(`${queries["18_social"]}`),
                "19_retreat": record.get(`${queries["19_retreat"]}`),
                "20_publicity": record.get(`${queries["20_publicity"]}`),
                "21_pd": record.get(`${queries["21_pd"]}`)
            }
            const found = screenNames.find((element) => {
                return element === candidateToReview["00_name"];
            });
            //not of undefined is true
            if (!found) {
                candidateLst.push(candidateToReview);
            }
        });
        console.log("all applicants that have yet to to be reviewed");
    }).catch(err => {
        if (err) { console.error(err); return; }
    });
    while (await hasNextCandidate()) {
        const candidateToEval = await nextCandidate();
        //visualize information
        console.log(candidateToEval);
        rl.resume();
        const decision = await screenDecision('From a Scale of 1 to 5 how would you rate this candidate as a General Member?: or Press \'s\' to skip this candidate');
        rl.pause();
        var outcome = decision.toString().trim();
        if (outcome === 's') {
            await addCandidate(candidateToEval);
        } else if(outcome === '0' || outcome === '1' || outcome === '2' || outcome === '3' || outcome === '4' || outcome === '5') {

            rl.resume();
            const comments = await  screenDecision('Comments to add');
            var thoughts = comments.toString().trim();
            rl.pause();
            rl.resume();
            const pd = await screenDecision('From a Scale of 1 to 5 how would you score this candidate\'s resume?');
            const pdScore= pd.toString().trim();
            const pub = await screenDecision('From a Scale of 1 to 5 how would you score this candidate\'s portfolio?');
            const pubScore= pub.toString().trim();

            await base('Screening').create({
                "Name": `${candidateToEval["00_name"]}`,
                "General Member Fit": `${outcome}`,
                "Officer": `${currOfficer}`,
                "Comments": `${thoughts}`,
                "Resume": `${pdScore}`,
                "Portfolio": `${pubScore}` 
            }, function (err, record) {
                if (err) { console.error(err); return; }
                console.log(`${record.getId()} screen submission is a success!  \n\n\n`);
            });
        } else {
            console.log(`You entered ${outcome} which is not a valid command`);
            await addCandidate(candidateToEval);
        }
        rl.pause();
    }
    rl.close();
    console.log("Thank you for your time and energy on this officer team!");
})();