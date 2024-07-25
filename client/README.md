# Minecraft Skin Merger - Frontend

This is the frontend application for the Minecraft Skin Merger project. It allows users to upload and merge Minecraft skins, providing both 2D and 3D previews of the results.

## Features

- Upload multiple Minecraft skins
- Select specific parts from different skins to merge
- Preview uploaded skins and merged results in both 2D and 3D
- Responsive design for desktop and mobile use

## Technologies Used

- React
- skinview3d (for 3D skin rendering)
- Tailwind CSS (for styling)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your_username/minecraft-skin-merger-frontend.git
   cd minecraft-skin-merger-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_API_URL=http://localhost:3002/api
   ```
   Replace the URL with your backend API URL.

### Running the Application

To start the development server:

```
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `build` directory.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (use with caution)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
