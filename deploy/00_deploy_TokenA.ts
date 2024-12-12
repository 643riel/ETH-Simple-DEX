import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployTokenA: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const initialSupply = 1000000

  // Desplegar el contrato con el suministro inicial
  const deployment = await deploy("TokenA", {
    from: deployer,
    args: [initialSupply],  // Pasa el suministro inicial como argumento
    log: true,
    autoMine: true,
  });

  // Obtener la dirección del contrato desplegado
  const tokenAAddress = deployment.address;

  // Obtener el contrato desplegado con getContractAt
  const TokenA = await hre.ethers.getContractAt("TokenA", tokenAAddress);

  // Ejemplo: interactuar con el contrato después de desplegar
  console.log("TokenA deployed at:", tokenAAddress);
};

export default deployTokenA;

// Etiquetas para ejecutar solo este script
deployTokenA.tags = ["TokenA"];
