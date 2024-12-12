async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy(1000); 

  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy(2000); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
