// Database.js
export let cubeBank = {
  
};

export function updateCubeBank(newData) {
    Object.assign(cubeBank, newData);
    console.log('Updated cubeBank:', cubeBank); // Log the updated cubeBank after population
}