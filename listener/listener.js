var { EoswsClient, createEoswsSocket, InboundMessageType } = require( '@dfuse/eosws-js');

var WebSocket   = require('ws');
var axios       = require('axios');
var figlet      = require('figlet');
var config      = require ('config');

const eosws_token = config.get('eosws_token');
const origin = config.get('origin');
const contract = config.get('listen_to_contract');
const action = config.get('listen_to_action');
const endpoint = config.get('eosws_endpoint');

const client = new EoswsClient(createEoswsSocket(() =>
    new WebSocket(`wss://${endpoint}/v1/stream?token=${eosws_token}`, {origin})))

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

client.connect().then(() => {
    client
        .getActionTraces({ account: contract, action_name: action })
        .onMessage((message) => {
            if (message.type === InboundMessageType.ACTION_TRACE) { 
                var data = message.data.trace.act.data;
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
        })
}).catch((error) => {
    console.log('Unable to connect to dfuse endpoint.', error)
})