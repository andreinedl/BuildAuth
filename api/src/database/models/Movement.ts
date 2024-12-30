import { Sequelize, DataTypes } from "sequelize";
import { database } from "../db";

export const Movement = database.define('movement', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: false // https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
    }
)