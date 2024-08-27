const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

let walletAddress = ""; // This will store the wallet address

// Dummy data tied to wallet addresses
const walletData = {
  "0x123": {
    name: "John Doe",
    balance: 100,
    transactions: [],
    cubeBank: {
        "2b37e4f8-a7b4-42fa-84fa-6efb13fa67a1": {
            file: "CR_ForestMeditating1.glb",
            animation: true
        },
        "ed4a9b88-9059-4900-8585-bae7a5e57615": {
            file: "CR_Forest_PickingBerries1.1.glb",
            animation: true
        },
        "330b7258-9513-4303-aba8-0148e13646b0": {
            file: "CR_Forest_Swimming1.1.glb",
            animation: true
        },
        "c0ddaa6e-d301-42c1-a448-14ece64d54bd": {
            file: "CR_Forest_ClimbingTree1.1.glb",
            animation: true
        },
        "dd745c43-1919-4561-a558-c685186f0400": {
            file: "CR_Forest_Hiding1.glb",
            animation: true
        },
        "1555464b-c909-4ebc-9045-4f395ef50bf4": {
            file: "Metallic-emerald2.1.glb",
            animation: true
        },
        "f2855794-bea5-4095-9f19-0132c3250d63": {
            file: "Metallic-Gold.glb",
            animation: true
        },
        "d17a7e41-a4dc-4bb9-a70c-b89d6189f9ab": {
            file: "Metallic-Aquamarine.glb",
            animation: true
        }
    }
    
  },
  "0x456": {
    name: "Jane Smith",
    balance: 200,
    transactions: [],
    cubeBank: {
      // Different cubeBank data for another wallet
      "dd745c43-1919-4561-a558-c685186f0400": {
        file: "CR_Forest_Hiding1.glb",
        animation: true,
      },
      "1555464b-c909-4ebc-9045-4f395ef50bf4": {
        file: "Metallic-emerald2.1.glb",
        animation: true,
      },
      "f2855794-bea5-4095-9f19-0132c3250d63": {
        file: "Metallic-Gold.glb",
        animation: true,
      },
      "d17a7e41-a4dc-4bb9-a70c-b89d6189f9ab": {
        file: "Metallic-Aquamarine.glb",
        animation: true,
      },
    },
  },
};

app.post("/api/wallet", (req, res) => {
  walletAddress = req.body.walletAddress;
  console.log("Received wallet address:", walletAddress);

  const data = walletData[walletAddress];

  res.status(200).json({ status: "success", walletAddress, data });
});

app.get("/api/wallet/:walletAddress", (req, res) => {
  const walletAddress = req.params.walletAddress;
  const data = walletData[walletAddress] || {
    name: "Unknown",
    balance: 0,
    transactions: [],
  };

  res.status(200).json({ walletAddress, data });
});

app.get("/api/wallet", (req, res) => {
  if (!walletAddress) {
    return res.status(404).json({ error: "No wallet address found" });
  }

  const data = walletData[walletAddress];

  res.status(200).json({ walletAddress, data });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
