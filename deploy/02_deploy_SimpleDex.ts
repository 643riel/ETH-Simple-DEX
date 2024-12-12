import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deploySimpleDEX: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Obtener las direcciones de los contratos TokenA y TokenB ya desplegados
  const tokenAAddress = (await hre.deployments.get("TokenA")).address;
  const tokenBAddress = (await hre.deployments.get("TokenB")).address;

  // Desplegar el contrato SimpleDEX
  const deployment = await deploy("SimpleDEX", {
    from: deployer,
    args: [tokenAAddress, tokenBAddress],  // Direcciones de los tokens A y B
    log: true,
    autoMine: true,
  });

  // Obtener la dirección del contrato desplegado
  const simpleDEXAddress = deployment.address;

  // Obtener el contrato desplegado con getContractAt
  const SimpleDEX = await hre.ethers.getContractAt("SimpleDEX", simpleDEXAddress);

  // Ejemplo: interactuar con el contrato después de desplegar
  console.log("SimpleDEX deployed at:", simpleDEXAddress);
};

export default deploySimpleDEX;

// Etiquetas para ejecutar solo este script
deploySimpleDEX.tags = ["SimpleDEX"];
