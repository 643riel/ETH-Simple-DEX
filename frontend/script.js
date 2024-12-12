// Conexión a la blockchain
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "DIRECCION_DEL_CONTRATO"; // Cambiar por la dirección del contrato
const ABI = [
  "function addLiquidity(uint256 amountA, uint256 amountB) external",
  "function removeLiquidity(uint256 amountA, uint256 amountB) external",
  "function swapAforB(uint256 amountAIn) external",
  "function swapBforA(uint256 amountBIn) external",
  "function getPrice(address _token) external view returns (uint256)"
];
const dexContract = new ethers.Contract(contractAddress, ABI, signer);

// Agregar liquidez
document.getElementById("add-liquidity").addEventListener("click", async () => {
  const amountA = ethers.utils.parseEther(document.getElementById("amountA-add").value);
  const amountB = ethers.utils.parseEther(document.getElementById("amountB-add").value);

  try {
    const tx = await dexContract.addLiquidity(amountA, amountB);
    await tx.wait();
    document.getElementById("add-liquidity-output").innerText = "Liquidez agregada exitosamente.";
  } catch (error) {
    console.error("Error al agregar liquidez:", error);
    document.getElementById("add-liquidity-output").innerText = "Error al agregar liquidez.";
  }
});

// Remover liquidez
document.getElementById("remove-liquidity").addEventListener("click", async () => {
  const amountA = ethers.utils.parseEther(document.getElementById("amountA-remove").value);
  const amountB = ethers.utils.parseEther(document.getElementById("amountB-remove").value);

  try {
    const tx = await dexContract.removeLiquidity(amountA, amountB);
    await tx.wait();
    document.getElementById("remove-liquidity-output").innerText = "Liquidez removida exitosamente.";
  } catch (error) {
    console.error("Error al remover liquidez:", error);
    document.getElementById("remove-liquidity-output").innerText = "Error al remover liquidez.";
  }
});

// Intercambiar Token A por Token B
document.getElementById("swap-a-for-b").addEventListener("click", async () => {
  const amountAIn = ethers.utils.parseEther(document.getElementById("amountA-swap").value);

  try {
    const tx = await dexContract.swapAforB(amountAIn);
    await tx.wait();
    document.getElementById("swap-output").innerText = "Intercambio A por B exitoso.";
  } catch (error) {
    console.error("Error al intercambiar A por B:", error);
    document.getElementById("swap-output").innerText = "Error al intercambiar A por B.";
  }
});

// Intercambiar Token B por Token A
document.getElementById("swap-b-for-a").addEventListener("click", async () => {
  const amountBIn = ethers.utils.parseEther(document.getElementById("amountB-swap").value);

  try {
    const tx = await dexContract.swapBforA(amountBIn);
    await tx.wait();
    document.getElementById("swap-output").innerText = "Intercambio B por A exitoso.";
  } catch (error) {
    console.error("Error al intercambiar B por A:", error);
    document.getElementById("swap-output").innerText = "Error al intercambiar B por A.";
  }
});

// Obtener precio
document.getElementById("get-price").addEventListener("click", async () => {
  const tokenAddress = document.getElementById("price-token").value;

  try {
    const price = await dexContract.getPrice(tokenAddress);
    const formattedPrice = ethers.utils.formatEther(price);
    document.getElementById("price-output").innerText = `Precio: ${formattedPrice}`;
  } catch (error) {
    console.error("Error al obtener el precio:", error);
    document.getElementById("price-output").innerText = "Error al obtener el precio.";
  }
});
