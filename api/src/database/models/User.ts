import { Sequelize, Model, DataTypes } from "sequelize";
import { database } from "../db";

export const User = database.define('user', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('username');
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('firstName');
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('lastName');
            },
        },
        lastAccess: {
            type: DataTypes.DATE,
            allowNull: true,
            get() {
                return this.getDataValue('lastAccess');
            },
        }
    }, 
    {
        timestamps: false // https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
    }
)