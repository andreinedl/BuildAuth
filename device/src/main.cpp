#include <Arduino.h>
//wifi
#include <WiFi.h>
#include "HTTPClient.h"

//Include the libraries for the BLE
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

// Include the libraries for the OLED display
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

//Include the icons
#include "lockIcon.cpp"
#include "unlockIcon.cpp"

#define SCREEN_WIDTH 128 // pixels
#define SCREEN_HEIGHT 64 // pixels
#define DEVICE_NAME "BuildAuth"
#define SERVICE_UUID "0ffe0862-658c-4783-a3d6-9d31211c795f" //generated using https://www.uuidgenerator.net/
#define STATUS_CHARACTERISTIC_UUID "3d46c16c-17ac-45c7-8638-0e75b4fed4e7" //generated using https://www.uuidgenerator.net/
#define COMMUNICATION_CHARACTERISTIC_UUID "e8fa2592-5b6a-4bfa-8a86-f8dccb89f488" //generated using https://www.uuidgenerator.net/
#define LED_PIN 5
#define BUZZER_PIN 4
#define MOTIONSENSOR_PIN 23
#define SDA_PIN 32
#define SCL_PIN 33

//wifi
const char* ssid = "########";
const char* password = "###########";
unsigned long previousMillis = 0;
unsigned long interval = 30000;
const char* apiUrl = "http://158.101.197.72/api/";
HTTPClient http;
WiFiClient client;

void initWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to the WiFi network");
  }
  Serial.println(WiFi.localIP());
}

//code generation timers
unsigned long codeGenMillis = 0;
int codeDuration = 0;

//BT
BLEServer *pServer;
BLECharacteristic *BuildAuthStatusCharacteristic;
BLECharacteristic *BuildAuthCommunicationCharacteristic;
boolean deviceConnected = false;
boolean oldDeviceConnected = false;

int connectCode;
volatile boolean codeCountdown = false;
String lastActionUsername = "";

//define the screen object
TwoWire DISPLAY_PINS = TwoWire(0);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &DISPLAY_PINS, -1);

//Motion sensor
int pinStateCurrent   = LOW;  // current state of pin
int pinStatePrevious  = LOW;  // previous state of pin

boolean lockStatus;

int devicesConnected = 0;

void playBuzzerShortBeep() {
  digitalWrite(BUZZER_PIN, LOW);
  delay(100);
  digitalWrite(BUZZER_PIN, HIGH);
}

//Send the action log to the API
void sendActionLog(String username, String action) {
  if(!username || !action || username == "" || action == "") {
    return;
  }

  String logApiUrl = String(apiUrl) + "logs/create";

  http.begin(client, logApiUrl);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"username\":\"" + username + "\",\"message\":\"" + action + "\"}";
  int httpResponseCode = http.POST(payload);
  if(httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void sendMovementLog() {
  String logApiUrl = String(apiUrl) + "movements/create";

  http.begin(client, logApiUrl);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"message\":\"Movement detected\"}";
  int httpResponseCode = http.POST(payload);
  if(httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void checkForMovement() {
  pinStatePrevious = pinStateCurrent; // store old state
  pinStateCurrent = digitalRead(MOTIONSENSOR_PIN);   // read new state
  if (pinStatePrevious == LOW && pinStateCurrent == HIGH) {   // pin state change: LOW -> HIGH
    Serial.println("Motion detected!");
    // TODO: turn on alarm, light or activate a device ... here
  }
  else
  if (pinStatePrevious == HIGH && pinStateCurrent == LOW) {   // pin state change: HIGH -> LOW
    Serial.println("Motion stopped!");
    // TODO: turn off alarm, light or deactivate a device ... here
  }
}

void setLockStatus(boolean status, String username) {
  boolean previousLockStatus = lockStatus;
  lockStatus = status;
  BuildAuthStatusCharacteristic->setValue(lockStatus ? "true" : "false");
  BuildAuthStatusCharacteristic->notify();

  codeCountdown = false;
  connectCode = 0;
  //Update the display data with the current status
  display.clearDisplay();
  String lockStatusText = "Status: " + String(lockStatus ? "Locked" : "Unlocked");
  display.setCursor(18,0);
  display.println(lockStatusText);

  //display the name and username
  //if the name and username are empty, do not display them
  if(username != "") {
    display.setCursor(0, 20);
    String message = "User: " + username;
    display.println(message);
  }

  //draw the lock/unlock icon
  if(lockStatus == true) {
    display.drawBitmap(48, 30, lockIcon, 32, 32, WHITE);
  } else {
    display.drawBitmap(48, 30, unlockIcon, 32, 32, WHITE);
  }
  display.display();
  
  if(username == lastActionUsername && previousLockStatus == lockStatus) {
    return;
  } else {
    sendActionLog(username, lockStatus ? "locked" : "unlocked");
  }
}

void generateConnectCode() {
  String connectCodeStr = "";
  for (int i = 0; i < 6; i++) {
    connectCodeStr += String(random(1,9));
  }
  connectCode = connectCodeStr.toInt();
  Serial.println(connectCode);

  codeCountdown = true;
  codeDuration = 30; //seconds
  codeGenMillis = millis();
}

void updateCountdown() {
  if (codeCountdown) {
    unsigned long currentMillis = millis();    
    if (currentMillis - codeGenMillis >= 1000) {
      codeGenMillis = currentMillis;
      codeDuration--;
      
      if (codeDuration <= 0) {
        setLockStatus(lockStatus, lastActionUsername);
      } else {
        display.clearDisplay();
        display.display();
        //display the current lock status
        String lockStatusText = "Status: " + String(lockStatus ? "Locked" : "Unlocked");
        display.setCursor(18,0);
        display.println(lockStatusText);
        //display the code countdown until it expires               
        String text = "Expires in " + String(codeDuration) + " seconds";
        display.setCursor(0,45);
        display.println(text);
    
        //display the connect code
        display.setCursor(40,25);
        display.println(connectCode);
        display.display();
      }
    }
  }
}

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    playBuzzerShortBeep();
    devicesConnected++;
    if(devicesConnected <= 3) {
      delay(500);
      BLEDevice::startAdvertising();
    }
    digitalWrite(LED_PIN, HIGH);
  };
  void onDisconnect(BLEServer* pServer) {
    devicesConnected--;
    if(devicesConnected <= 3) {
      delay(500);
      BLEDevice::startAdvertising();
    }

    if(devicesConnected == 0) {
      digitalWrite(LED_PIN, LOW);
    }
  }
};

class CommunicationsCharacteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    std::string value = pCharacteristic->getValue();
    Serial.print("Raw value: ");
    Serial.print(value.c_str());
    Serial.print("\n");

    if(value.length() > 0) {  
      if(value == "requestCode") {
        generateConnectCode();
      } else {
        std::string code = value.substr(0, value.find(','));
        Serial.print("Code: ");
        Serial.print(code.c_str());
        Serial.print("\n");

        if(code == String(connectCode).c_str()) {
          String username  = value.substr(value.find(',') + 1).c_str();
          Serial.print("Username: ");
          Serial.print(username.c_str());
          Serial.print("\n");

          lastActionUsername = username;
          setLockStatus(!lockStatus, username);
        }
      }
    }
  }
};

void setup() {
  Serial.begin(115200);

  //setup the pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(MOTIONSENSOR_PIN, INPUT);
  digitalWrite(BUZZER_PIN, HIGH); // Keep buzzer silent

  initWiFi();
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());

  //initialize the display

  DISPLAY_PINS.begin(SDA_PIN, SCL_PIN);
  //initialize the OLED display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {    // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
    for(;;);
  }

  // clear the display
  display.clearDisplay();

  // Set the text color to white with a black background
  display.setTextColor(WHITE);
  display.println("BuildAuth");
  display.display();

  // Init BT
  BLEDevice::init(DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  //create the service and the characteristics
  BLEService *BuildAuthService = pServer->createService(SERVICE_UUID);
  BuildAuthStatusCharacteristic = BuildAuthService->createCharacteristic(STATUS_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  BuildAuthCommunicationCharacteristic = BuildAuthService->createCharacteristic(COMMUNICATION_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_WRITE);

  //add callback for the communication characteristic
  BuildAuthCommunicationCharacteristic->setCallbacks(new CommunicationsCharacteristicCallbacks());

  //add descriptors
  BuildAuthStatusCharacteristic->addDescriptor(new BLE2902());
  BuildAuthCommunicationCharacteristic->addDescriptor(new BLE2902());

  //Add user readable descriptors
  BLEDescriptor *statusDescriptor = new BLEDescriptor(BLEUUID((uint16_t)0x2901)); // User Description Descriptor
  statusDescriptor->setValue("BuildAuth lock status");
  BuildAuthStatusCharacteristic->addDescriptor(statusDescriptor);

  BLEDescriptor *communicationDescriptor = new BLEDescriptor(BLEUUID((uint16_t)0x2901)); // User Description Descriptor
  communicationDescriptor->setValue("BuildAuth communication");
  BuildAuthCommunicationCharacteristic->addDescriptor(communicationDescriptor);

  //Start the BT Service
  BuildAuthService->start();

  //Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Waiting for a client connection to notify...");

  //Set the default value for lockstatus
  setLockStatus(true, "");
}

void loop() {
  updateCountdown();
  unsigned long currentMillis = millis();
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval)) {
    Serial.print(millis());
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
  }

  if(lockStatus == true) {
    checkForMovement();
  }
}