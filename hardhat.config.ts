import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"; // Importa las herramientas de Hardhat
import "hardhat-deploy"; // Importa el plugin hardhat-deploy
import dotenv from "dotenv";

dotenv.config();

// Configuración de variables de entorno
const ALCHEMY_URL = process.env.ALCHEMY_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API = process.env.ETHERSCAN_API || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: ALCHEMY_URL, // URL de Alchemy para la red Sepolia
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // Usa la cuenta privada definida en .env
    },
    hardhat: {
      chainId: 1337, // Configuración por defecto de Hardhat
    },
    localhost: {
      url: "http://127.0.0.1:8545", // URL de la red local
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Cuenta 0 predefinida de Hardhat
      ],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API, // API Key para verificar contratos en Etherscan (Sepolia)
    },
  },
  paths: {
    sources: "./contracts", // Ruta para contratos inteligentes
    tests: "./test", // Ruta para tests
    cache: "./cache", // Ruta para la cache
    artifacts: "./artifacts", // Ruta para los artefactos compilados
  },
  namedAccounts: {
    deployer: {
      default: 0, // Cuenta 0 se usará como "deployer" por defecto
    },
  },
};

export default config;
