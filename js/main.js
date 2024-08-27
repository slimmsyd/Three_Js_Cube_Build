// main.js
import { CubeViewer } from './CubeViewer.js';
import { updateCubeBank } from './Database.js';

const fetchAndUpdateCubeBank = async (walletAddress) => {
  try {
    const response = await fetch(`http://localhost:3001/api/wallet/${walletAddress}`);
    const data = await response.json();

    if (data.data.cubeBank) {
      console.log('Fetched cubeBank data from external server:', data.data.cubeBank);
      
      // Update the cubeBank with the fetched data
      updateCubeBank(data.data.cubeBank);

      // Now that cubeBank is updated, create the CubeViewer and render the cubes
      const cubeViewer = new CubeViewer();
      cubeViewer.init();  // This will render the cubes from the updated cubeBank
    } else {
      console.error('No cubeBank data found for this wallet address.');
    }
  } catch (error) {
    console.error('Error fetching wallet and cubeBank data:', error);
  }
};

// Fetch the cubeBank data and initialize the CubeViewer after it's populated
fetchAndUpdateCubeBank('0x123');
