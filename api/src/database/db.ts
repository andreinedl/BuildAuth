const { Sequelize } = require('sequelize');
const db = new Sequelize('mariadb://app:password@localhost:3306/db');

export async function tryConnection() {
    try {
        await db.authenticate();
        return true;
    } catch (error) {
        return false;
    }
}

let connectionStatus = false;

async function checkConnectionStatus() {
    connectionStatus = await tryConnection();
    console.log('Current connection status:', connectionStatus ? 'Connected' : 'Disconnected');
}

// Check connection status every 10 seconds
setInterval(checkConnectionStatus, 10000);

// Initial check
checkConnectionStatus();