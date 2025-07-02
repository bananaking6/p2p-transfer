// get the ?id= parameter from the URL
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
if (urlParams.has('darkMode')) {
    document.body.classList.add('dark-mode');
}
if (urlParams.has('connectToPeer')) {
    document.body.innerHTML = '<div id="container"><h1>Connecting...</h1></div>';
    setTimeout(() => {
    connectToPeer(urlParams.get('connectToPeer'));
    }, 1500)
}

// establish the peer to later make a connection
let numValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let num = '';
if (id) {
    // if the id parameter is provided, use it
    num = id;
} else {
    // if the id parameter is not provided, generate a random id
    for (let i = 0; i < 5; i++) {
        num += numValues[Math.floor(Math.random() * numValues.length)];
    }
}

document.title = 'P2P Files - ' + num;

let conn;

let peer = new Peer('p2pfiles_' + num);
console.log(peer.id);
document.querySelector('#peerIDValue').innerText = num.toUpperCase();

// toast library
const toast = new Notyf();

// stream saver library
streamSaver.mitm = './m/mitm.html';

// handle the connection to the peer
function connectToPeer(id) {
    id = id ? id : document.querySelector('#connectToPeerID').value;
    if (id == num) {alert("You can't connect to yourself!");return;}
    conn = peer.connect('p2pfiles_' + id)
    console.log('Connecting to: ' + id);
    conn.on('open', function(){
        console.log('Connected to: ' + conn.peer);
        connectedToPeer()
    });
}

peer.on('connection', function (connection) {
    conn = connection;
    console.log('Connected to: ' + conn.peer);
    connectedToPeer()
});

window.onload = function() {
    document.getElementById('connectToPeerID').focus();
};

function connectedToPeer() {
    document.querySelector('#container').innerHTML = '<input id="fileInput" type="file" multiple onchange="sendFiles(this.files)"><h1 id="fileInputText">Click to select file(s) to send</h1>';
    document.title = 'P2P Files - Connected';
    toast.success('Connected to peer ' + conn.peer.replace('p2pfiles_', ''));
    
    conn.on('data', async function (data) {
        // File metadata received once for each file
        if (data.type === 'file-meta') {
            console.log('Received metadata', data);
            if (!window.receivedStreams) {
                window.receivedStreams = {};
            }
            // Initialize receiver context for this file
            if (!window.receivedStreams[data.id]) {
                window.receivedStreams[data.id] = {
                    size: data.size,
                    receivedSize: 0,
                    stream: streamSaver.createWriteStream(data.name, { size: data.size }),
                    writer: null
                };
                window.receivedStreams[data.id].writer = window.receivedStreams[data.id].stream.getWriter();
                toast.success('Receiving file: ' + data.name);
            }
            return;
        }

        // File chunk received
        if (data.type === 'file-chunk') {
            // Ensure that metadata was received and writer is ready.
            if (window.receivedStreams && window.receivedStreams[data.id]) {
                window.receivedStreams[data.id].receivedSize += data.content.byteLength;
                await window.receivedStreams[data.id].writer.write(new Uint8Array(data.content));
                if (window.receivedStreams[data.id].receivedSize >= window.receivedStreams[data.id].size) {
                    window.receivedStreams[data.id].writer.close();
                    toast.success('Finished file: ' + data.name);
                    delete window.receivedStreams[data.id];
                }
            } else {
                console.error('No metadata for file-chunk', data.id);
            }
            return;
        }
        console.log('Received (unknown)', data);
    });

    conn.on('close', function () {
        console.log('Connection closed');
        toast.error('Connection closed');
        document.location.reload();
    });
}

async function sendFiles(files) {
    toast.success('Sending file(s)...');
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    const MAX_BUFFERED_AMOUNT = 10 * CHUNK_SIZE; // backpressure threshold

    for (let i = 0; i < files.length; i++) {
        sendFile(files[i]).catch(err => {
            console.error("Error transferring file:", err);
            toast.error("Error transferring " + files[i].name);
        });
    }

    async function sendFile(file) {
        let fileId = generateUniqueId();
        let offset = 0;
        const totalSize = file.size;

        // Send metadata message once for the file
        conn.send({
            type: "file-meta",
            id: fileId,
            name: file.name,
            size: totalSize
        });

        while (offset < totalSize) {
            let chunk = file.slice(offset, offset + CHUNK_SIZE);
            let buffer = await chunk.arrayBuffer();

            while (conn.bufferedAmount > MAX_BUFFERED_AMOUNT) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Send only essential chunk data
            conn.send({
                type: "file-chunk",
                id: fileId,
                content: buffer,
                offset: offset
            });

            offset += CHUNK_SIZE;
        }
        console.log("File transfer complete:", file.name);
    }
}

function generateUniqueId() {
    return 'file_' + Math.random().toString(36).substr(2, 9);
}