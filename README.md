# SimpleDEX Deployment Guide

## Configuración inicial
1. Asegurate de tener **Node.js** instalado en tu sistema.
2. Abrí la terminal y navegá al directorio donde se encuentra tu proyecto:

```
   cd /mnt/<letra disco>/<directorio>
```

3. Iniciá el nodo local de Hardhat:

```
   npx hardhat node
```

## Configuración de la red localhost
La red localhost se configura por defecto en Hardhat de la siguiente manera:

```
localhost: {
  url: "http://127.0.0.1:8545", // URL de la red local
  accounts: [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Cuenta 0 predefinida de Hardhat
  ],
}
```

Cuando desplegás contratos usando esta configuración, las direcciones de los contratos serán consistentes en cada despliegue porque Hardhat reinicia el estado de la blockchain local cada vez que se inicia el nodo.

## Salida esperada del despliegue
Después de desplegar los contratos, deberías ver esta salida en la terminal:

```
deploying "TokenA" (tx: 0x3dd50c174abf10249fb712a7b2f5b9f007e0b3fcb633632f163cd01382c6e0d8)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 966313 gas
TokenA deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

deploying "TokenB" (tx: 0xa0cf8a640bb6c895468cf794384a3ad08bac46543e065e4a49bdc96cd2b614ed)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 966313 gas
TokenB deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

deploying "SimpleDEX" (tx: 0x9ec4a4289fc21d4e7941a9345bd150a058dcae790d0718e16394f6618e0fe87b)...: deployed at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 with 1488610 gas
SimpleDEX deployed at: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

📝 Updated TypeScript contract definition file on ../nextjs/contracts/deployedContracts.ts
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```