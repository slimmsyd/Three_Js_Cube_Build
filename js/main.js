// main.js
import { CubeViewer } from './CubeViewer.js';
// import { updateCubeBank } from './Database.js';


const cubeViewer = new CubeViewer();
cubeViewer.init();

// const fetchAndUpdateCubeBank = async (walletAddress) => {
//   try {
//     const response = await fetch(`https://creature-cubes-api.vercel.app/api/0x123`);
//     const data = await response.json();

//     console.log("Logging the CUbe Bank data before", data.cubeBank)

//     if (data.cubeBank) {
//       console.log('Fetched cubeBank data from external server:', data.cubeBank);
      
//       // Update the cubeBank with the fetched data
//       updateCubeBank(data.cubeBank);

//       // Now that cubeBank is updated, create the CubeViewer and render the cubes
//       const cubeViewer = new CubeViewer();
//       cubeViewer.init();  // This will render the cubes from the updated cubeBank
//     } else {
//       console.error('No cubeBank data found for this wallet address.');
//     }
//   } catch (error) {
//     console.error('Error fetching wallet and cubeBank data:', error);
//   }
// };

// // Fetch the cubeBank data and initialize the CubeViewer after it's populated
// fetchAndUpdateCubeBank('0x456');
