# P2P Transfer 🚀

A modern, secure peer-to-peer file transfer and messaging application that works directly in your browser without any servers.

## ✨ Features

- **🔒 Secure P2P Connection** - Direct peer-to-peer communication with no intermediary servers
- **📁 File Transfer** - Send files of any size directly between devices
- **💬 Real-time Messaging** - Chat with your connected peer in real-time
- **📱 Mobile Responsive** - Beautiful interface that works on desktop and mobile
- **🎨 Modern UI** - Sleek cyber-glow themed interface with smooth animations
- **📋 QR Code Sharing** - Generate QR codes for easy connection setup
- **🌐 Browser-based** - No downloads required, works in any modern web browser

## 🚀 Quick Start

1. Open the application in your web browser
2. Share your Session ID or QR code with another user
3. Have them enter your Session ID to connect
4. Start chatting and sharing files instantly!

## 🔧 Technical Details

### Technologies Used
- **PeerJS** - WebRTC peer-to-peer connections
- **Tailwind CSS** - Modern utility-first CSS framework
- **QR Code Styling** - Beautiful QR code generation
- **File System Access API** - Native file saving capabilities

### Browser Support
- Chrome/Edge 86+
- Firefox 90+
- Safari 14+

### File Transfer
- Uses chunked transfer for large files
- Supports multiple file selection
- Automatic file download on receive
- Progress indication for transfers

### Security
- All communication is encrypted end-to-end via WebRTC
- No data passes through external servers
- Session IDs are randomly generated 5-digit codes

## 📱 Usage

### Connecting Peers
1. **Host**: Share your 5-digit Session ID or QR code
2. **Client**: Enter the host's Session ID and press Enter
3. **Both**: Enjoy instant P2P communication!

### Sending Files
1. Click or drag files into the upload area
2. Files are automatically sent to your connected peer
3. Large files are transferred in chunks for reliability

### Messaging
1. Type your message in the input field
2. Press Enter or click the send button
3. Messages appear instantly for both users

## 🎨 Customization

The application uses CSS custom properties for easy theming:

```css
:root {
  --background: #0d0c22;
  --foreground: #e0e7ff;
  --card: #19183a;
  --primary: #c026d3;
  --border: #312e81;
  --input: #1e1b4b;
}
```

## 🔒 Privacy & Security

- **No Server Storage** - Files and messages are never stored on any server
- **Direct Connection** - Communication happens directly between browsers
- **Temporary Sessions** - Session IDs are generated fresh each time
- **Local Processing** - All file processing happens locally in your browser

## 🐛 Troubleshooting

### Connection Issues
- Ensure both devices are on the same network or have internet access
- Check that WebRTC is enabled in your browser
- Try refreshing the page and generating a new Session ID

### File Transfer Problems
- Verify your browser supports the File System Access API
- For large files, ensure stable internet connection
- Some browsers may require HTTPS for certain features

## 🛠️ Development

### Local Setup
1. Clone the repository
2. Serve the files using any HTTP server
3. Access via `localhost` or your preferred development URL

### File Structure
```
p2p/
├── index.html          # Main application interface
├── style.css           # Custom styles and theme
├── script.js           # Application logic and P2P handling
├── favicon.svg         # Application icon
├── manifest.json       # PWA manifest
└── README.md          # This documentation
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Made with ❤️ for secure, private file sharing**
