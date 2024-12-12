import * as fs from "fs";
import prettier from "prettier";
import { DeployFunction } from "hardhat-deploy/types";

const generatedContractComment = `/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
`;

const DEPLOYMENTS_DIR = "./deployments";
const ARTIFACTS_DIR = "./artifacts";

function getDirectories(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function getContractNames(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith(".json"))
    .map(dirent => dirent.name.split(".")[0]);
}

function getInheritedFunctions(sources: Record<string, any>, contractName: string) {
  const inheritedFunctions: Record<string, any> = {};

  const sourcePath = Object.keys(sources).find(key => key.includes(`/${contractName}`));
  if (sourcePath) {
    // Verificar si sourcePath es un archivo y no un directorio
    if (fs.lstatSync(`${ARTIFACTS_DIR}/${sourcePath}`).isFile()) {
      const { abi } = JSON.parse(fs.readFileSync(`${ARTIFACTS_DIR}/${sourcePath}`).toString());
      for (const functionAbi of abi) {
        if (functionAbi.type === "function") {
          inheritedFunctions[functionAbi.name] = sourcePath;
        }
      }
    } else {
      // console.error(`Expected a file but found a directory: ${sourcePath}`);   :D
    }
  }

  return inheritedFunctions;
}

function getContractDataFromDeployments() {
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    throw Error("At least one other deployment script should exist to generate an actual contract.");
  }

  const output: Record<string, any> = {};
  for (const chainName of getDirectories(DEPLOYMENTS_DIR)) {
    const chainId = fs.readFileSync(`${DEPLOYMENTS_DIR}/${chainName}/.chainId`).toString();
    const contracts: Record<string, any> = {};
    for (const contractName of getContractNames(`${DEPLOYMENTS_DIR}/${chainName}`)) {
      const contractFilePath = `${DEPLOYMENTS_DIR}/${chainName}/${contractName}.json`;

      // Verificar si el archivo es un archivo JSON válido
      if (fs.lstatSync(contractFilePath).isFile()) {
        const { abi, address, metadata } = JSON.parse(fs.readFileSync(contractFilePath).toString());
        const inheritedFunctions = getInheritedFunctions(JSON.parse(metadata).sources, contractName);
        contracts[contractName] = { address, abi, inheritedFunctions };
      } else {
        console.error(`Expected a file but found a directory: ${contractFilePath}`);
      }
    }
    output[chainId] = contracts;
  }
  return output;
}

const generateTsAbis: DeployFunction = async function () {
  const TARGET_DIR = "../nextjs/contracts/";
  const allContractsData = getContractDataFromDeployments();

  const fileContent = Object.entries(allContractsData).reduce((content, [chainId, chainConfig]) => {
    return `${content}${parseInt(chainId).toFixed(0)}:${JSON.stringify(chainConfig, null, 2)},`;
  }, "");

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  fs.writeFileSync(
    `${TARGET_DIR}deployedContracts.ts`,
    await prettier.format(
      `${generatedContractComment} import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract"; \n\n
 const deployedContracts = {${fileContent}} as const; \n\n export default deployedContracts satisfies GenericContractsDeclaration`,
      {
        parser: "typescript",
      },
    ),
  );

  console.log(`📝 Updated TypeScript contract definition file on ${TARGET_DIR}deployedContracts.ts`);
};

export default generateTsAbis;

generateTsAbis.tags = ["generateTsAbis"];
generateTsAbis.runAtTheEnd = true;