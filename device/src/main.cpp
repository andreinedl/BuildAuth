//Defines
// --Screen
#define SCREEN_WIDTH 128 // px
#define SCREEN_HEIGHT 64 // px

// -- Bluetooth 
#define DEVICE_NAME "BuildAuth"
#define SERVICE_UUID "0ffe0862-658c-4783-a3d6-9d31211c795f" //generated using https://www.uuidgenerator.net/
#define STATUS_CHARACTERISTIC_UUID "3d46c16c-17ac-45c7-8638-0e75b4fed4e7" //generated using https://www.uuidgenerator.net/
#define COMMUNICATION_CHARACTERISTIC_UUID "e8fa2592-5b6a-4bfa-8a86-f8dccb89f488" //generated using https://www.uuidgenerator.net/

// -- Pins
#define LED_PIN 5
#define BUZZER_PIN 4
#define MOTIONSENSOR_PIN 23
#define SDA_PIN 32
#define SCL_PIN 33

// -- Wifi
#define WIFI_SSID "BuildAuth"
#define WIFI_PASSWORD "12345678"


// Includes
// -- BLE
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>
BLEServer *pServer;
BLECharacteristic *BuildAuthStatusCharacteristic;
BLECharacteristic *BuildAuthCommunicationCharacteristic;


// -- OLED SSD1306
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>
TwoWire DISPLAY_PINS = TwoWire(0);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &DISPLAY_PINS, -1);

// -- Internet connection
#include <WiFi.h>
#include "HTTPClient.h"
HTTPClient http;
WiFiClient client;
const char* logsCreationUrl = "http://158.101.197.72/api/logs/create";
const char* movementsCreationUrl = "http://158.101.197.72/api/movements/create";
unsigned long WifiStatusPreviousMillis = 0;

// -- Display icons
#include "lockIcon.cpp"
#include "unlockIcon.cpp"
#include "eyeIcon.cpp"

//Variables
// -- Motion sensor
int pinStateCurrent = LOW;  // current state of pin
int pinStatePrevious = LOW;  // previous state of pin
// -- Timers
unsigned long codeGenMillis = 0;
unsigned long lockMillis = 0;
int codeDuration = 0;
int lockMovementDelayDuration = 0;
// -- Lock status
boolean lockStatus;
int devicesConnected = 0;
String setLockUsername;
int connectCode;

//Functions
// -- Buzzer
void stopSound() {
  digitalWrite(BUZZER_PIN, HIGH);
  noTone(BUZZER_PIN);
}

void playAlarmSound() {
  tone(BUZZER_PIN, 300);
}

void playSingleBeep() {
  digitalWrite(BUZZER_PIN, LOW);
  delay(200);
  digitalWrite(BUZZER_PIN, HIGH);
}

void playDoubleBeep() {
  digitalWrite(BUZZER_PIN, LOW);
  delay(200);
  digitalWrite(BUZZER_PIN, LOW);
  delay(200);
  digitalWrite(BUZZER_PIN, HIGH);
}

// -- WIFI
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
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

// -- Display
int16_t getXCenterPosition(String text) {
  int16_t x1, y1;
  uint16_t textWidth, textHeight;
  display.getTextBounds(text, 0, 0, &x1, &y1, &textWidth, &textHeight);
  return (SCREEN_WIDTH - textWidth) / 2;
}

int16_t getYCenterPosition(String text) {
  int16_t x1, y1;
  uint16_t textWidth, textHeight;
  display.getTextBounds(text, 0, 0, &x1, &y1, &textWidth, &textHeight);
  return (SCREEN_HEIGHT - textHeight) / 2;
}

void startupMessage() {
  display.clearDisplay();
  display.setTextSize(2);
  String message = "BuildAuth";
  display.setCursor(getXCenterPosition(message),getYCenterPosition(message));
  display.println(message);
  display.display();
}

void setLockDisplay(boolean setStatus) {
  display.clearDisplay();
  display.setTextSize(1);
  display.display();

  //Header text
  String headerText = "Status: " + String(setStatus ? "Locked" : "Unlocked");
  display.setCursor(getXCenterPosition(headerText),0);
  display.println(headerText);

  //Action user display text
  if(setLockUsername != "") {
    String userText = "User: " + String(setLockUsername);
    display.setCursor(getXCenterPosition(userText),20);
    display.println(userText);
  }

  //Lock / unlock icon
  if(setStatus == true) {
    display.drawBitmap(28, 30, lockIcon, 32, 32, WHITE);
    display.drawBitmap(68, 30, eyeIcon, 32, 32, WHITE);
  } else {
    display.drawBitmap(48, 30, unlockIcon, 32, 32, WHITE);
  }

  display.display();
}

// -- API Calls
boolean sendPostRequest(String url, String bodyContent) {
  int retries = 0;
  while(retries < 3) {
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(bodyContent);
    if(httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
      http.end();

      if(httpResponseCode == 200 || httpResponseCode == 201) return true;
    }
    Serial.println("POST Error: " + String(httpResponseCode));
    http.end();

    retries++;
    delay(1000);
  }
  return false;
}

void sendActionLog(String username, String action) {
    if(username == "" || action == "" || !username || !action ) return;

    String bodyContent = "{\"username\":\"" + username + "\",\"message\":\"" + action + "\"}";
    if(sendPostRequest(logsCreationUrl, bodyContent)) {
      Serial.println("Action log POST sent");
    } else {
      Serial.println("Action log POST failed");
    }
}

void sendMovementLog() {
    String bodyContent = "{\"message\":\"Movement detected\"}";

    if(sendPostRequest(movementsCreationUrl, bodyContent)) {
      Serial.println("Action log POST sent");
    } else {
      Serial.println("Action log POST failed");
    }
}

// Lock
void setLockStatus(boolean setStatus, String statusSetUser = setLockUsername) {
  boolean previousLockStatus = lockStatus;
  lockStatus = setStatus;
  BuildAuthStatusCharacteristic->setValue(lockStatus ? "true" : "false");
  BuildAuthStatusCharacteristic->notify();

  connectCode = 0;
  codeDuration = 0;
  Serial.print(statusSetUser);

  if(statusSetUser != "") {
    sendActionLog(statusSetUser, lockStatus ? "Locked" : "Unlocked");
  }

  if(lockStatus == true) {
    playSingleBeep();
  } else {
    playDoubleBeep();
  }

  setLockDisplay(lockStatus);
  lockMovementDelayDuration = 5;

  if(lockStatus == true) {
    delay(1000);
    lockMillis = millis();
  }
}

void generateConnectCode() {
  String connectCodeStr = "";
  for (int i = 0; i < 6; i++) {
    connectCodeStr += String(random(1,9));
  }
  connectCode = connectCodeStr.toInt();
  Serial.println(connectCode);

  codeDuration = 30; //seconds
  codeGenMillis = millis();
}

void updateCountdown() {
  if (codeDuration != 0) {
    unsigned long currentMillis = millis();    
    if (currentMillis - codeGenMillis >= 1000) {
      codeGenMillis = currentMillis;
      codeDuration--;
      
      if (codeDuration <= 0) {
        setLockStatus(lockStatus);
      } else {
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(WHITE);

        //display the current lock status
        String statusText = "Status: " + String(lockStatus ? "Locked" : "Unlocked");
        display.setCursor(18,0);
        display.println(statusText);

        //display the code countdown until it expires               
        String countdownText = "Expires in " + String(codeDuration) + " seconds";
        display.setCursor(0,45);
        display.println(countdownText);
    
        //display the connect code
        display.setCursor(40,25);
        display.println(connectCode);
        display.display();
      }
    }
  }
}

// Movement
void checkForMovement() {
  unsigned long currentMillis = millis();

  // Check if delay period is active
  if (lockMovementDelayDuration > 0) {
    pinStatePrevious = LOW; //reset the movement state
    pinStateCurrent = LOW;
    if (currentMillis - lockMillis >= 1000) { // 1 second has passed
      lockMillis = currentMillis;
      lockMovementDelayDuration--;
      Serial.println("Movement check blocked by delay: " + String(lockMovementDelayDuration));
    }
    return;
  }

  // Ensure movement detection is only active when no code is being entered
  if (connectCode != 0 || codeDuration > 0) {
    return;
  }

  // Read the current state of the motion sensor
  pinStatePrevious = pinStateCurrent;
  pinStateCurrent = digitalRead(MOTIONSENSOR_PIN);

  if (pinStatePrevious == LOW && pinStateCurrent == HIGH) {  // Motion detected
    String message = "Motion detected!";
    Serial.println(message);

    // Display popup
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(getXCenterPosition(message), getYCenterPosition(message));
    display.println(message);
    display.display();

    playAlarmSound();
    sendMovementLog();
  }
  else if (pinStatePrevious == HIGH && pinStateCurrent == LOW) { // Motion stopped
    Serial.println("Motion stopped!"); 
    setLockDisplay(lockStatus);
    stopSound();
  }
}

// Bluetooth callbacks
// -- BT server callbacks
class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    devicesConnected++;
    if(devicesConnected <= 3) {
      delay(500); //small delay to let bluetooth get ready
      BLEDevice::startAdvertising();
    }
    digitalWrite(LED_PIN, HIGH);
  };
  void onDisconnect(BLEServer* pServer) {
    devicesConnected--;
    if(devicesConnected <= 3) {
      delay(500); //small delay to let bluetooth get ready
      BLEDevice::startAdvertising();
    }

    if(devicesConnected == 0) {
      digitalWrite(LED_PIN, LOW);
    }
  }
};

// -- BT characteristics callbacks
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

          setLockUsername = username;
          setLockStatus(!lockStatus, username);
        }
      }
    }
  }
};

void setup() {
  Serial.begin(115200);

  //Setup the pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(MOTIONSENSOR_PIN, INPUT);

  initWiFi();

  //Initialize the display
  // -- Set the pins for the display
  DISPLAY_PINS.begin(SDA_PIN, SCL_PIN);
  // -- Initialize the OLED display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {    // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
    for(;;);
  }
  display.setTextColor(WHITE);

  // Startup display message
  startupMessage();

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

  //Set the default lock value;
  setLockStatus(false);
}

void loop() {
  if (codeDuration > 0 && connectCode != 0) {
    updateCountdown();
  }

  if (lockStatus == true && connectCode == 0 && lockMillis != 0) {
    checkForMovement();
  }
  
  // Wifi connection check
  unsigned long WifiStatusCurrentMillis = millis();
  if ((WiFi.status() != WL_CONNECTED) && (WifiStatusCurrentMillis - WifiStatusPreviousMillis >= 30000)) {
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    WifiStatusPreviousMillis = WifiStatusCurrentMillis;
  }
}