import { Sequelize, Model, DataTypes } from "sequelize";
import { database } from "../db";

export const User = database.define('user', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        allowed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        lastAccess: {
            type: DataTypes.DATE,
            allowNull: true,
            set(value) {
                this.setDataValue('lastAccess', value)
            }
        }
    }, 
    {
        timestamps: true // https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
    }
)