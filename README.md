# Minecraft Skin Merger

## Description
Minecraft Skin Merger is a web application designed to allow users to merge various elements of different Minecraft skins into a single customized skin. This tool is perfect for Minecraft players who want to create a unique look by combining parts of existing skins.

## Features
- Upload multiple skin files.
- Select parts to merge from each skin.
- Download the merged skin as a single image file.
- User-friendly interface.

## Installation

### Prerequisites
- Node.js
- npm

### Setup
To set up the Minecraft Skin Merger application on your local machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/minecraft-skin-merger.git
   cd minecraft-skin-merger
   ```

2. **Install dependencies**
   This project is split into two parts: the client and the server. You need to install dependencies for both.
   ```bash
   npm run install-all
   ```

3. **Build the client application**
   Before running the server, make sure to build the client application.
   ```bash
   npm run build
   ```

## Usage

### Development
To run both the client and the server in development mode with hot reloading, use:
```bash
npm run dev
```
This command will start the frontend development server on `http://localhost:3000` and the backend server on `http://localhost:5000`.

### Production
To run the application in production mode:
```bash
npm start
```
Ensure that all environment variables are set correctly for production environments.

## API Endpoints
- POST `/api/merge-skins`: Endpoint to upload skins and receive a URL to the merged skin image.
- GET `/download/:filename`: Endpoint to download the merged skin image directly.

## Contributing
Contributions are welcome! Please feel free to submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
- Spencer Frost

```

### Additional Notes:
- **GitHub URL**: Replace `"https://github.com/yourusername/minecraft-skin-merger.git"` with the actual URL of your GitHub repository.
- **Ports**: Make sure the ports mentioned match your configuration in the `server.js` file.
- **License File**: Include a `LICENSE` file in your repository if it's mentioned in the README.

This README provides a comprehensive guide to getting started with the Minecraft Skin Merger project, ensuring that anyone who wants to use or contribute to the project has all the information they need.