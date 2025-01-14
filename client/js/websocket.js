const url = `ws://${window.OrdControl.wsurl}:8765`;

socket = new ReconnectingWebSocket(url);

socket.debug = true

socket.onclose = ()=>{
    $('#status-websocket').removeClass('open').addClass('reconnecting')
}

socket.onmessage = (msg)=>{
    console.log('msg', msg);
    let data = {};

    try {
        data = msg.data && JSON.parse(msg.data);
    } catch(err) {
        console.log('cannot parse websocket data', err);
    }

    if (data['bitcoind_status']) {
        setBitcoindStatus(data['bitcoind_status'])
    }

    if (data['ord_index_service_status']) {
        setOrdIndexServiceStatus(data['ord_index_service_status'])
    }    

    if (data['ord_wallet']) {
        setOrdWalletInfo(data['ord_wallet'])
    }

    if (data['boto3_credentials_not_found']) {
        setEc2BotoCredsError();
    }

    if (data['journalctl_alerts']) {
        setJournalCtlAlerts(data['journalctl_alerts']);
    }

    if (data['control_log']) {
        setControlLog(data['control_log'])
    }

    if (data['cloudinit_status']) {
        setCloudinitStatus(data['cloudinit_status'])
    }

    if (data['seed_phrase']) {
        showSeedPhrase(data['seed_phrase'])
    }

    if (data['inscription_files']) {
        printInscriptionQueue(data['inscription_files'])
        console.log('inscription_files', data['inscription_files']);
    }
}

socket.onopen = ()=>{
    socket.send(`token:${window.OrdControl.password}`);
    $('#status-websocket').removeClass('reconnecting').addClass('open')
}


window.socket = socket;