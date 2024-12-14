document.addEventListener("DOMContentLoaded", function () {
  // Configurar el proveedor para conectarse al nodo de Hardhat
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // Clave privada de la cuenta de Hardhat (cuenta #0 por defecto)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  // Crear la billetera con la clave privada y conectarla al proveedor
  const wallet = new ethers.Wallet(privateKey, provider);

  // Inicializar variables para los contratos
  let dexContract, tokenA, tokenB;

  // Variables para manejar la conexión
  let isWalletConnected = false;

  // Actualizar estado de conexión en la UI
  function updateWalletStatus(message, isSuccess) {
    const walletStatus = document.getElementById("wallet-status");
    walletStatus.textContent = message;
    walletStatus.style.color = isSuccess ? "green" : "red";
  }

  // Función principal para conectar la billetera y configurar los contratos
  async function connectHardhatWallet() {
    try {
      console.log("Cuenta conectada:", wallet.address);
      isWalletConnected = true;
      updateWalletStatus(`Billetera conectada: ${wallet.address}`, true);

      // Detectar la red actual
      const network = await provider.getNetwork();
      console.log("Red detectada:", network.name);

      // Cargar las direcciones de contrato según la red
      const contractAddresses = getContractAddresses(network.chainId);
      console.log("Direcciones de contratos cargadas:", contractAddresses);

      // Inicializar los contratos
      initContracts(wallet, contractAddresses);
    } catch (error) {
      console.error("Error al conectar la billetera Hardhat:", error);
      updateWalletStatus("Error al conectar la billetera.", false);
    }
  }

  // Desconectar la billetera
  function disconnectWallet() {
    isWalletConnected = false;
    updateWalletStatus("Billetera desconectada.", true);
    console.log("Billetera desconectada.");
  }

  // Cargar las direcciones de los contratos por red
  function getContractAddresses(chainId) {
    const addresses = {
      31337: { // Hardhat localhost
        dex: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        tokenA: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        tokenB: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      },
    };

    return addresses[chainId] || null;
  }

  // Inicializar contratos con el signer y las direcciones
  function initContracts(wallet, addresses) {
    const DEX_ABI = [
      "function addLiquidity(uint256 amountA, uint256 amountB) external",
      "function removeLiquidity(uint256 amountA, uint256 amountB) external",
      "function swapAforB(uint256 amountAIn) external",
      "function swapBforA(uint256 amountBIn) external",
      "function getPrice(address _token) external view returns (uint256)"
    ];

    const TOKEN_ABI = ["function approve(address spender, uint256 amount) public returns (bool)"];

    dexContract = new ethers.Contract(addresses.dex, DEX_ABI, wallet);
    tokenA = new ethers.Contract(addresses.tokenA, TOKEN_ABI, wallet);
    tokenB = new ethers.Contract(addresses.tokenB, TOKEN_ABI, wallet);

    console.log("Contratos inicializados con la billetera Hardhat.");
  }

  // Conectar y desconectar billetera con los botones
  document.getElementById("connect-wallet").addEventListener("click", () => {
    if (!isWalletConnected) {
      connectHardhatWallet();
    } else {
      alert("La billetera ya está conectada.");
    }
  });

  document.getElementById("disconnect-wallet").addEventListener("click", () => {
    if (isWalletConnected) {
      disconnectWallet();
    } else {
      alert("No hay una billetera conectada.");
    }
  });

  // Función para validar la entrada del usuario
  function validateAmount(amount) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Por favor, ingrese un valor válido (número positivo).");
      return false;
    }
    return true;
  }

  // Función para aprobar tokens con manejo de errores detallado
  async function approveTokens(token, amount) {
    try {
      const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18); // Manejo de decimales
      const tx = await token.approve(dexContract.address, parsedAmount);
      await tx.wait();
      console.log(`Tokens aprobados: ${amount}`);
      return true;
    } catch (error) {
      handleApprovalError(error);
      return false;
    }
  }

  // Función para manejar errores de aprobación
  function handleApprovalError(error) {
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.error("Fondos insuficientes para aprobar tokens.");
    } else if (error.code === "NETWORK_ERROR") {
      console.error("Error de red al aprobar tokens.");
    } else {
      console.error("Error desconocido al aprobar tokens:", error);
    }
  }

  // Reutilización para manejar aprobaciones y validación
  async function handleApprove(buttonId, inputId, token, outputId) {
    const amount = document.getElementById(inputId).value;
    const output = document.getElementById(outputId);

    if (validateAmount(amount)) {
      const success = await approveTokens(token, amount);
      if (success) {
        output.textContent = `Aprobación exitosa: ${amount} tokens.`;
        output.style.color = "green";
      } else {
        output.textContent = `Error al aprobar tokens.`;
        output.style.color = "red";
      }
    } else {
      output.textContent = `Monto inválido.`;
      output.style.color = "red";
    }
  }

  // Manejo de aprobaciones para Token A y Token B
  document.getElementById("approve-a").addEventListener("click", () => {
    handleApprove("approve-a", "approve-amountA", tokenA, "approve-a-output");
  });

  document.getElementById("approve-b").addEventListener("click", () => {
    handleApprove("approve-b", "approve-amountB", tokenB, "approve-b-output");
  });

  // Agregar liquidez
  document.getElementById("add-liquidity").addEventListener("click", async () => {
    const amountA = document.getElementById("liquidity-add-amountA").value;
    const amountB = document.getElementById("liquidity-add-amountB").value;

    if (validateAmount(amountA) && validateAmount(amountB)) {
      try {
        const tx = await dexContract.addLiquidity(amountA, amountB);
        await tx.wait();
        document.getElementById("add-liquidity-output").innerText = "Liquidez agregada exitosamente.";
        console.log(`Liquidez agregada: ${amountA} de Token A y ${amountB} de Token B.`); // Mensaje de éxito en consola
      } catch (error) {
        console.error("Error al agregar liquidez:", error);
        document.getElementById("add-liquidity-output").innerText = "Error al agregar liquidez.";
      }
    }
  });
  
  // Remover liquidez
  document.getElementById("remove-liquidity").addEventListener("click", async () => {
    const amountA = document.getElementById("liquidity-remove-amountA").value;
    const amountB = document.getElementById("liquidity-remove-amountB").value;

    if (validateAmount(amountA) && validateAmount(amountB)) {
      try {
        const tx = await dexContract.removeLiquidity(amountA, amountB);
        await tx.wait();
        document.getElementById("remove-liquidity-output").innerText = "Liquidez removida exitosamente.";
      } catch (error) {
        console.error("Error al remover liquidez:", error);
        document.getElementById("remove-liquidity-output").innerText = "Error al remover liquidez.";
      }
    }
  });

  // Intercambiar Token A por Token B
  document.getElementById("swap-a-for-b").addEventListener("click", async () => {
    const amountAIn = document.getElementById("swap-amountA").value;

    if (validateAmount(amountAIn) && await approveTokens(tokenA, amountAIn)) {
      try {
        const tx = await dexContract.swapAforB(amountAIn);
        await tx.wait();
        document.getElementById("swap-output").innerText = "Intercambio A por B exitoso.";
      } catch (error) {
        console.error("Error al intercambiar A por B:", error);
        document.getElementById("swap-output").innerText = "Error al intercambiar A por B.";
      }
    }
  });

  // Intercambiar Token B por Token A
  document.getElementById("swap-b-for-a").addEventListener("click", async () => {
    const amountBIn = document.getElementById("swap-amountB").value;

    if (validateAmount(amountBIn) && await approveTokens(tokenB, amountBIn)) {
      try {
        const tx = await dexContract.swapBforA(amountBIn);
        await tx.wait();
        document.getElementById("swap-output").innerText = "Intercambio B por A exitoso.";
      } catch (error) {
        console.error("Error al intercambiar B por A:", error);
        document.getElementById("swap-output").innerText = "Error al intercambiar B por A.";
      }
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
});
