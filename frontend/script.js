document.addEventListener("DOMContentLoaded", function () {
  // Inicializar variables para los contratos
  let dexContract, tokenA, tokenB;
  let isWalletConnected = false;
  let signer;

  // Actualizar estado de conexión en la UI
  function updateWalletStatus(message, isSuccess) {
    const walletStatus = document.getElementById("wallet-status");
    walletStatus.textContent = message;
    walletStatus.style.color = isSuccess ? "green" : "red";
  }

  // Función para conectarse a Metamask
  async function connectMetamaskWallet() {
    try {
      if (!window.ethereum) {
        alert("Metamask no está instalado.");
        return;
      }
  
      // Solicitar acceso a la cuenta
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      console.log("Cuenta conectada:", walletAddress);
      isWalletConnected = true;
      updateWalletStatus(`Billetera conectada: ${walletAddress}`, true);

      // Detectar la red actual
      const network = await provider.getNetwork();
      if (network.chainId !== 43981) {  // 0xAA36A7 es 43981 en decimal (Scroll Sepolia)
        // Intentar cambiar a Scroll Sepolia automáticamente
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xAA36A7" }], // 0xAA36A7 es 43981 en hexadecimal
          });
          alert("Se cambió automáticamente a la red Scroll Sepolia.");
        } catch (switchError) {
          // Si la red no está configurada, mostrar un mensaje
          if (switchError.code === 4902) {
            alert("Scroll Sepolia no está configurada en Metamask. Por favor agrégala manualmente.");
          } else {
            throw switchError;
          }
          updateWalletStatus("Red incorrecta. Cambia a Scroll Sepolia.", false);
          return;
        }
      }
  
      console.log("Red detectada:", network.name);
  
      // Cargar las direcciones de contrato
      const contractAddresses = getContractAddresses(43981); // Scroll Sepolia
      console.log("Direcciones de contratos cargadas:", contractAddresses);
  
      // Inicializar los contratos
      initContracts(signer, contractAddresses);
    } catch (error) {
      console.error("Error al conectar la billetera Metamask:", error);
      updateWalletStatus("Error al conectar la billetera.", false);
    }
  }

  // Desconectar la billetera
  function disconnectWallet() {
    isWalletConnected = false;
    updateWalletStatus("Billetera desconectada.", true);
    console.log("Billetera desconectada.");
  }

  // Direcciones de los contratos para la red Scroll Sepolia
  function getContractAddresses(chainId) {
    const addresses = {
      43981: { // Scroll Sepolia
        dex: "0x5a5d8ebcedee9cb88f2a00151e6c723a062c6e27",
        tokenA: "0xe652b0f103561052cdd0B143c0171eCbb6b0e683",
        tokenB: "0xbD997ab4c6B41f82ef996079940a73da5C32f520",
      },
    };

    return addresses[chainId] || null;
  }

  // Inicializar contratos con el signer y las direcciones
  function initContracts(signer, addresses) {
    const DEX_ABI = [
      "function addLiquidity(uint256 amountA, uint256 amountB) external",
      "function removeLiquidity(uint256 amountA, uint256 amountB) external",
      "function swapAforB(uint256 amountAIn) external",
      "function swapBforA(uint256 amountBIn) external",
      "function getPrice(address _token) external view returns (uint256)"
    ];

    const TOKEN_ABI = ["function approve(address spender, uint256 amount) public returns (bool)"];

    dexContract = new ethers.Contract(addresses.dex, DEX_ABI, signer);
    tokenA = new ethers.Contract(addresses.tokenA, TOKEN_ABI, signer);
    tokenB = new ethers.Contract(addresses.tokenB, TOKEN_ABI, signer);

    console.log("Contratos inicializados con la billetera Metamask.");
  }

  // Conectar y desconectar billetera con los botones
  document.getElementById("connect-wallet").addEventListener("click", () => {
    if (!isWalletConnected) {
      connectMetamaskWallet();
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

  // Funciones de validación y lógica (igual que en el script original)
  function validateAmount(amount) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Por favor, ingrese un valor válido (número positivo).");
      return false;
    }
    return true;
  }

  async function approveTokens(token, amount) {
    try {
      const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);
      const tx = await token.approve(dexContract.address, parsedAmount);
      await tx.wait();
      console.log(`Tokens aprobados: ${amount}`);
      return true;
    } catch (error) {
      console.error("Error al aprobar tokens:", error);
      return false;
    }
  }

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

  // --------------------------------------------
 
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
        document.getElementById("swap-output").innerText = `Intercambio realizado: ${amountAIn} Token A por Token B.`;
      } catch (error) {
        console.error("Error al intercambiar tokens:", error);
        document.getElementById("swap-output").innerText = "Error al intercambiar tokens.";
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
        document.getElementById("swap-output").innerText = `Intercambio realizado: ${amountBIn} Token B por Token A.`;
      } catch (error) {
        console.error("Error al intercambiar tokens:", error);
        document.getElementById("swap-output").innerText = "Error al intercambiar tokens.";
      }
    }
  });
});
