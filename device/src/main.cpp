#include <Arduino.h>
//Include the libraries for the BLE
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

#include <SimpleTimer.h>

// Include the libraries for the OLED display
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // pixels
#define SCREEN_HEIGHT 64 // pixels
#define DEVICE_NAME "BuildAuth"
#define SERVICE_UUID "0ffe0862-658c-4783-a3d6-9d31211c795f" //generated using https://www.uuidgenerator.net/
#define STATUS_CHARACTERISTIC_UUID "3d46c16c-17ac-45c7-8638-0e75b4fed4e7" //generated using https://www.uuidgenerator.net/
#define COMMUNICATION_CHARACTERISTIC_UUID "e8fa2592-5b6a-4bfa-8a86-f8dccb89f488" //generated using https://www.uuidgenerator.net/
#define LED_PIN 5

//timer for the code generation
SimpleTimer codeGenTimer;

//BT
BLEServer *pServer;
BLECharacteristic *BuildAuthStatusCharacteristic;
BLECharacteristic *BuildAuthCommunicationCharacteristic;
boolean deviceConnected = false;
boolean oldDeviceConnected = false;

//connect code
int connectCode;

//define the screen object
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

boolean lockStatus;

void generateConnectCode() {
  String connectCodeStr = "";
  for (int i = 0; i < 6; i++) {
    connectCodeStr += String(random(1,9));
  }
  connectCode = connectCodeStr.toInt();
  Serial.println(connectCode);

  for(int i = 5; i > 0; i--)
  {
    delay(1000);
    String text = "Expires in " + String(i) + " seconds";
    display.clearDisplay();
    display.display();
    //display the current lock status
    String lockStatusText = "Status: " + String(lockStatus ? "Locked" : "Unlocked");
    display.setCursor(18,0);
    display.println(lockStatusText);
    //display the code countdown until it expires
    display.setCursor(5,45);
    display.println(text);

    //display the connect code
    display.setCursor(40,25);
    display.println(connectCode);
    display.display();
  }
}

void setLockStatus(boolean status) {
  lockStatus = status;
  BuildAuthStatusCharacteristic->setValue(lockStatus ? "true" : "false");
  BuildAuthStatusCharacteristic->notify();
}

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    digitalWrite(LED_PIN, HIGH);
  };
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    digitalWrite(LED_PIN, LOW);
  }
};

class CommunicationsCharacteristicCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    String value = pCharacteristic->getValue().c_str();
    Serial.print("Raw value: ");
    Serial.print(value);
    Serial.print("\n");

    if(value.length() > 0) {
      if (value == "true") {
        setLockStatus(true);
      } else if (value == "false") {
        setLockStatus(false);
      }
    }
  }
};

void setup() {
  Serial.begin(115200);

  //initialize the display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {    // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // clear the display
  display.clearDisplay();

  // Set the text color to white with a black background
  display.setTextColor(WHITE);
  display.println("BuildAuth");
  display.display();

  pinMode(LED_PIN, OUTPUT);

  //Set the timer for the code generation
  codeGenTimer.setInterval(5000, generateConnectCode);

  // Init BT
  BLEDevice::init(DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Create the service
  BLEService *BuildAuthService = pServer->createService(SERVICE_UUID);

  // Create the status characteristic
  BuildAuthStatusCharacteristic = BuildAuthService->createCharacteristic(
                                         STATUS_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_NOTIFY
                                       );

  BuildAuthCommunicationCharacteristic = BuildAuthService->createCharacteristic(
                                         COMMUNICATION_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

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

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Waiting for a client connection to notify...");

  //set the default value for the lock status on startup
  setLockStatus(true);
}

void loop() {
  //start the code gen timer
  codeGenTimer.run();

  // Handle device connection status
  if (deviceConnected && !oldDeviceConnected) {
    // Do stuff here on connecting
    oldDeviceConnected = deviceConnected;
  }
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // Give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // Restart advertising
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;
  }
}