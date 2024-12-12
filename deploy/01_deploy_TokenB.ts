import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployTokenB: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const initialSupply = 1000000 

  // Desplegar el contrato y pasar el argumento al constructor
  const deployment = await deploy("TokenB", {
    from: deployer,
    args: [initialSupply],  // Pasa el argumento initialSupply al contrato
    log: true,
    autoMine: true,
  });

  // Obtener la dirección del contrato desplegado
  const TokenBAddress = deployment.address;

  // Obtener el contrato desplegado con getContractAt
  const TokenB = await hre.ethers.getContractAt("TokenB", TokenBAddress);

  // Ejemplo: interactuar con el contrato después de desplegar
  console.log("TokenB deployed at:", TokenBAddress);
};

export default deployTokenB;

// Etiquetas para ejecutar solo este script
deployTokenB.tags = ["TokenB"];
