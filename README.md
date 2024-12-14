# SimpleDEX Deployment Guide

## Configuración inicial

### Requisitos previos

Aseguráte de tener **Node.js** instalado en tu sistema. 
Si no lo tenés, puedes descargarlo desde [https://nodejs.org/en](https://nodejs.org/en).

### Clonar el repositorio

Si aún no clonaste el repositorio, ejecutá el siguiente comando en tu terminal:

```bash
git clone <URL_del_repositorio>
cd /mnt/<letra disco>/<directorio>
```

### Instalar dependencias

Ejecutá los siguientes comandos para instalar las dependencias necesarias:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox@^5.0.0 --verbose
npm install --save-dev @types/node@^22.10.2 --verbose
npm install --save-dev hardhat-deploy@^0.14.0 --verbose
npm install --save-dev ts-node@^10.0.0 --verbose
npm install --save-dev typescript@^5.0.0 --verbose
npm install @openzeppelin/contracts@^5.1.0 --verbose
npm install dotenv@^16.4.7 --verbose
npm install ethers@^6.13.4 --verbose
```

### Abrir el proyecto en VSCode (opcional)

Si usás Visual Studio Code, podés abrir el proyecto ejecutando:

```bash
code .
```

### Compilar los contratos

En caso de ser necesario, compila los contratos con el siguiente comando:

```bash
npx hardhat compile
```

## Configuración de la red localhost

La red localhost está configurada por defecto en **Hardhat** de la siguiente manera en el archivo `hardhat.config.ts`:

```javascript
localhost: {
  url: "http://127.0.0.1:8545", // URL de la red local
  accounts: [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Cuenta 0 predefinida de Hardhat
  ],
}
```

### Levantar el nodo local de Hardhat

Para iniciar el nodo local de Hardhat, ejecutá el siguiente comando:

```bash
npx hardhat node
```

Esto levanta una red de pruebas en `http://127.0.0.1:8545`.

## Despliegue de contratos

Los contratos se desplegarán automáticamente al iniciar el nodo local. 
Si deseas verificar el estado del despliegue, revisá la salida en la terminal.

### Salida esperada del despliegue

Después de desplegar los contratos, deberías ver una salida como la siguiente:

```plaintext
deploying "TokenA" (tx: 0x3dd50c174abf10249fb712a7b2f5b9f007e0b3...)
TokenA deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

deploying "TokenB" (tx: 0xa0cf8a640bb6c895468cf794384a3ad08bac46543e065e4a49bdc96cd2b614ed)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 966313 gas
TokenB deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

deploying "SimpleDEX" (tx: 0x9ec4a4289fc21d4e7941a9345bd150a058dcae790d0718e16394f6618e0fe87b)...: deployed at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 with 1488610 gas
SimpleDEX deployed at: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

🖍 Updated TypeScript contract definition file on ../nextjs/contracts/deployedContracts.ts
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

## Documentación adicional

Para más información, consultá el manual incluido en el repositorio. El archivo PDF está disponible dentro del proyecto.
