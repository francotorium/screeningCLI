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

const rl = readline.createInterface(process.stdin, process.stdout);
// rl.on('line', function(cmd){
//     console.log("you just typed: " + cmd);
// });

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
console.log(gmFit);

//creates a syncronous function program
(async function startScreen() {
    var canScreen = false;
    var currOfficer= 'Carmen+Jesse'; 
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
    console.log(`Current officer reviewing apps is ${currOfficer}`);

    console.log('Thank you for your time and energy in reading these applications :)');
    console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
    rl.pause();
    await base('Screening').select({
        // Selecting all records from what have been screened so far 
        view: "Grid view"
    }).all().then((records) => {
        //method for automatically fetching all records across all pages 
        records.forEach(function (record) {
            console.log("wow first candidate");
            console.log(record.get(`${queries_screening["00_name"]}`));
            console.log(record.get(`${queries_screening["01_gm_fit"]}`));
            console.log(record.get(`${queries_screening["02_officer"]}`));
            console.log(record.get(`${queries_screening["03_timestamp"]}`));

            // record.get(`${queries_screening["00_name"]}`);
            // record.get(`${queries_screening["01_gm_fit"]}`);
            // record.get(`${queries_screening["02_officer"]}`);
            // record.get(`${queries_screening["03_timestamp"]}`);
        });
        console.log("all candidates screened so far");
    }).catch(err => {
        if (err) { console.error(err); return; }
    });

    await base('All Applications').select({
        view: "Grid view"
    }).all().then((records) => {
        //method for automatically fetching all records across all pages 
        records.forEach(function (record) {

            // console.log(record.get(`${queries["00_name"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["01_mission"]}`));
            // console.log('\n')
            // console.log(record.get(`${queries["02_teach"]}`));
            // console.log('\n')
            // console.log(record.get(`${queries["03_first"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["04_first_explain"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["05_second"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["06_second_explain"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["07_commitments"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["08_retreat"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["09_questions"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["10_time"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["11_email"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["12_number"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["13_number"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["14_timestamp"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["15_systemic"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["16_classes"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["17_languages"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["18_social"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["19_retreat"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["20_publicity"]}`));
            // console.log('\n');
            // console.log(record.get(`${queries["21_pd"]}`));
            // console.log(">>>>Next Candidate\n\n\n\n\n\n\n\n");
            // console.log(`Current officer reviewing apps is ${currOfficer}`);
        });
        console.log("all applicants that have yet to to be reviewed");
    }).catch(err => {
        if (err) { console.error(err); return; }
    });
    while(hasNextCandidate()) {
        //grab next Candidate
        //nextCandidate() => returns a candidate
    }
    rl.resume();
    const decision = await screenDecision('From a Scale of 1 to 5 how would you rate this candidate as a General Member?: ');
    rl.pause();
    var canScreen = false;
    var currOfficer= 'Carmen+Jesse'; 
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
    console.log(decision.toString().trim())
    rl.resume();
    const skip = await screenDecision('Would you like to Skip this Candidate? Y/N: ');
    rl.pause();
    console.log(decision.toString().trim());
    rl.close();
})();
// record.get(`${queries["01_mission"]}`);
// record.get(`${queries["02_teach"]}`);
// record.get(`${queries["03_first"]}`);
// record.get(`${queries["04_first_explain"]}`);
// record.get(`${queries["05_second"]}`);
// ecord.get(`${queries["06_second_explain"]}`);
// record.get(`${queries["07_commitments"]}`);
// record.get(`${queries["08_retreat"]}`);
// record.get(`${queries["09_questions"]}`);
// record.get(`${queries["10_time"]}`);
// record.get(`${queries["11_email"]}`);
// record.get(`${queries["12_number"]}`);
// record.get(`${queries["13_number"]}`);
// record.get(`${queries["14_timestamp"]}`);
// record.get(`${queries["15_systemic"]}`);
// record.get(`${queries["16_classes"]}`);
// record.get(`${queries["17_languages"]}`);
// record.get(`${queries["18_social"]}`);
// record.get(`${queries["19_retreat"]}`);
// record.get(`${queries["20_publicity"]}`);
// record.get(`${queries["21_pd"]}`);
