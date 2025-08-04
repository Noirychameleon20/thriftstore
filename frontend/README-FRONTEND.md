# Frontend Setup Instructions

## Prerequisites

**You need Node.js installed on your computer first!**

### Install Node.js:
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. **Important**: Make sure to check "Add to PATH" during installation
5. Restart your computer or terminal after installation

### Verify Node.js Installation:
```bash
node --version
npm --version
```

## Quick Setup

### Option 1: Using the Setup Script (Recommended)
1. Double-click `setup-frontend.bat`
2. Follow the instructions
3. Run `start-frontend.bat` to start the development server

### Option 2: Manual Setup
1. Open Command Prompt or PowerShell
2. Navigate to the frontend directory:
   ```bash
   cd C:\Users\Lenovo\Desktop\nodejs\thrift-store\frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Development Server

Once started, the frontend will be available at:
- **URL**: http://localhost:5173
- **Hot Reload**: Changes will automatically refresh the browser

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Restart your terminal after installing Node.js
- Make sure you checked "Add to PATH" during installation

### "npm is not recognized"
- Same as above - Node.js installation issue

### Blank page
- Make sure the development server is running
- Check the terminal for error messages
- Make sure your backend is also running on port 5000

### Port already in use
- Kill existing processes or change the port in `vite.config.js`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Static files
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Features

- ✅ React 18 with Vite
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Responsive design
- ✅ Hot module replacement 