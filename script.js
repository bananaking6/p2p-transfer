//  Math.floor(Math.random() * 1e5).toString().padStart(5, '0') Math.random().toString(36).substring(2, 7)
let numValues = '123456789'.split('');
let num = Array.from({ length: 5 }, () => numValues[Math.floor(Math.random() * numValues.length)]).join('');
let peer = new Peer('p2pfiles_' + num);

const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "" + peer.id,
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