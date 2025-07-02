//  Math.floor(Math.random() * 1e5).toString().padStart(5, '0') Math.random().toString(36).substring(2, 7)
let numValues = '123456789'.split('');
let num = Array.from({ length: 5 }, () => numValues[Math.floor(Math.random() * numValues.length)]).join('');
let peer = new Peer('p2pfiles_' + num);
let conn;

const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "https://projects.skibidi.is-a.dev/files/?id=" + peer.id,
        image: "favicon.svg",
        dotsOptions: {
            color: "goldenrod",
            type: "classy-rounded"
        },
        backgroundOptions: {
            color: "black",
        },
        margin: 3,
    });

qrCode.append(document.getElementById("qrCode"));
document.querySelector('#peerIDValue').innerText = num.toUpperCase();

function copyPeerId() {
    const peerId = document.querySelector('#peerIDValue').innerText;
    navigator.clipboard.writeText(peerId).then(() => {
        document.querySelector('#peerIDCopy').innerText = 'Copied!';
        setTimeout(() => {
            document.querySelector('#peerIDCopy').innerText = 'COPY';
        }, 1000);
        //toast.success('Copied ID: ' + peerId);
    }, (err) => {
        //toast.error('Failed to copy ID');
        console.error('Could not copy text: ', err);
    });
}

function connectToPeer() {
    const peerId = document.querySelector('#connectToPeerID').value;
    if (!peerId || peerId === num || peerId.length < 5) {
        alert('Please enter a valid Peer ID to connect to.');
        return;
    }
    
    // Add the prefix to the user-entered ID
    const fullPeerId = 'p2pfiles_' + peerId;
    
    conn = peer.connect(fullPeerId);

    conn.on('open', () => {
        onConnected();
    });

    conn.on('error', (err) => {
        console.error('Connection failed: ', err);
        alert('Connection failed. Please check the Peer ID and try again.');
    });
}

peer.on('connection', (connection) => {
    conn = connection;
    conn.on('open', () => {
        onConnected();
    });
});

// A unified function to handle the post-connection state
function onConnected() {
    console.log('Connected to ' + conn.peer);
    
    // Hide the connection screen and show the transfer screen
    document.querySelector('#connection-screen').classList.add('hidden');
    document.querySelector('#chat-screen').classList.remove('hidden');

    // Set up data listener
    conn.on('data', (data) => {
        switch (data.type) {
            case 'file':
                // This logic seems incomplete, assuming it will be built out
                const file = data.file;
                const url = URL.createObjectURL(new Blob([file.data], { type: file.type }));
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                break;
            case 'message':
                const message = data.text;
                const chatBox = document.querySelector('#messages');
                const messageElement = document.createElement('div');
                messageElement.className = 'message';
                messageElement.textContent = message;
                chatBox.appendChild(messageElement);
                chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
                break;
        }
    });

    conn.on('close', () => {
        alert('Connection closed.');
        location.reload();
    });
}

function sendFiles(files) {
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            conn.send({ type: 'file', file: { name: file.name, data: event.target.result, type: file.type } });
        };
        reader.readAsArrayBuffer(file);
    }
}
function sendMessage() {
    const message = document.querySelector('#message-input').value;
    if (message.trim() === '') {
        return;
    }

    const chatBox = document.querySelector('#messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = '<b>You:</b> ' + message.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape HTML to prevent XSS
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    
    conn.send({ type: 'message', text: message });
    document.querySelector('#message-input').value = '';
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    deferredPrompt.prompt();
});
