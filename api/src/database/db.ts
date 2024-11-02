import { Sequelize, Model } from 'sequelize'
export const database = new Sequelize('db', 'app', 'password', {
    dialect: 'mariadb',
    logging: false,
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

    async function checkConnectionStatus() {
       console.log('Current connection status:', await connect() ? 'Connected' : 'Disconnected');
    }

    // check @ 10 seconds
    setInterval(checkConnectionStatus, 10000)

    //sync models
    await User.sync({force: true});
    await Log.sync({force: true});
    
}