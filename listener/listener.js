var eosws       = require('eosws');
var WebSocket   = require('ws');
var axios       = require('axios');
var figlet      = require('figlet');
var config      = require ('config');

const eosws_token = config.get('eosws_token');
const eoswsAddress = config.get('eosws_address_prefix') + "?token=" + eosws_token;
const origin = config.get('origin');
const contract = config.get('listen_to_contract');
const action = config.get('listen_to_action');

const ws = new WebSocket(eoswsAddress, {origin});
const pr_req_id = eosws.generateReqId();

figlet('EOS Listener', {
    font: "Big",
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    console.log("");
    console.log("----- Using Configuration ---- ")
    console.log(config);
    console.log("----- End Configuration ---- ")
    console.log ("\n\n ")


    console.log ("Listening on EOS for: ");
    console.log ("  Contract    :   ", contract);
    console.log ("  Action      :   ", action);

});

ws.onopen = () => {
    ws.send(eosws.get_actions(contract, action, contract, {req_id: pr_req_id}));
};

ws.onmessage = (message) => {
    const pr_actions = eosws.parse_actions(message.data, pr_req_id);

    if (pr_actions) {
        var data = pr_actions.data.trace.act.data;
        console.log ()
        console.log (new Date().toISOString()) 
        console.log (`-- Received event on ${contract}::${action} --`)
        console.log (JSON.stringify(data, null, 4));
      
        if (config.has('post_to')) {
            axios.post(config.get('post_to'), {
                data
            })
            .then(function (response) {
                console.log(response.status);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        console.log ("Listening on EOS for: ");
        console.log ("  Contract    :   ", contract);
        console.log ("  Action      :   ", action);
    }
};




