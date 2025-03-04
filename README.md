# BuildAuth - intelligent alarm system

**BuildAuth** is a building alarm system that can be controlled by multiple users. Each user must authenticate using a username and password within the application developed for this project.

## Features

- [x] Motion detection using a dedicated sensor when the device is set to **"Locked"** mode.
- [x] Displaying the device's current status (**"Locked" / "Unlocked"**) along with a specific icon on the OLED screen.
- [x]  Changing the status using a dedicated mobile application, with communication between the **ESP32** and the mobile phone via **Bluetooth Low Energy (BLE)**.
- [x] Managing users who have access to control the device from the mobile application.
- [x] Querying all detected motions/status changes within the application.

## Hardware parts
| Part | Image |
| ------------- | ------------- |
| HC-SR501 PIR Sensor  | ![HC-SR501 PIR Sensor](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLhsupLZDAN6ut_Hbs8-72XEEJCEhBqPumRg&s =150x)  |
| SSD1306 Display  | ![SSD1306 Display](https://docs.sunfounder.com/projects/umsk/en/latest/_images/27_OLED.png =150x)  |
| Active buzzer | ![Active buzzer](https://eph.com.pk/wp-content/uploads/2024/06/ssive-buzzer-module-for-arduino-new-diy-kit_3_.jpg =150x)|
|ESP32 | ![ESP32](https://s13emagst.akamaized.net/products/70974/70973239/images/res_ab0cc32c3a43b799d40afecc4c9ed9c6.jpg =150x)

## Android app
The mobile application for this project is used to set the device status by users, with each user having their own account. It also allows viewing logs of detected movements and status changes ("Locked"/"Unlocked").

The application was created using the React Native framework.
Used libraries:

 - React Native
 - Expo
 - React Native Paper - for UI components
 - react-native-ble-plx - Bluetooth connection

**Building the app**:
In the ``app`` directory run ``npm run build-android``.

**Screenshots:**
![](https://i.imgur.com/R0mOZw7.jpeg =200x)       ![](https://i.imgur.com/l53dEQ7.jpeg =200x) ![](https://i.imgur.com/QshaGJ4.jpeg =200x) ![](https://i.imgur.com/VTaYrZD.jpeg =200x)

## API server

The API is used for user authentication, sending any status changes and detected movements from the device to the database, and retrieving this data in the application.

The chosen database for storing the data is **MariaDB**.

The code for creating this API is written using Node.js, using the following libraries:

 - **express** – for the web server part
 - **sequelize** – for database connection
 - **bcrypt** – for password encryption

## Schemes
![](https://i.imgur.com/XAUfZuQ.png)
![](https://i.imgur.com/SWZgxcp.png)
