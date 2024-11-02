import { Sequelize, Model } from 'sequelize'
export const database = new Sequelize('db', 'app', 'password', {
    dialect: 'mariadb',
    logging: false,
    pool: {
        max: 5,
        idle: 30000,
        acquire: 60000,
    },
})

import { User } from './models/User'
import { Log } from './models/Log';

export async function initDb() {
    async function connect() {
        try {
            await database.authenticate();
            return true
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false
        }
    }

    await connect()

    let connectionStatus = false // define false by default
    async function checkConnectionStatus() {
        let connectionStatus = await connect()
       if(connectionStatus == false){
           console.log('MariaDB connection lost, trying to reconnect...')
       }
    }

    // check @ 10 seconds
    setInterval(checkConnectionStatus, 10000)

    //sync models
    await User.sync();
    await Log.sync();
    
}