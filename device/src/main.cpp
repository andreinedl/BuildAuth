#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define DEVICE_NAME "BuildAuth"
#define SERVICE_UUID "0ffe0862-658c-4783-a3d6-9d31211c795f" //generated using https://www.uuidgenerator.net/
#define STATUS_CHARACTERISTIC_UUID "3d46c16c-17ac-45c7-8638-0e75b4fed4e7" //generated using https://www.uuidgenerator.net/
#define LED_PIN 5

BLEServer *pServer;
BLECharacteristic *BuildAuthStatusCharacteristic;
boolean deviceConnected = false;
boolean oldDeviceConnected = false;

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    digitalWrite(LED_PIN, HIGH);
  };
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    digitalWrite(LED_PIN, LOW);
  }
};

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // Init BT
  BLEDevice::init(DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the service
  BLEService *BuildAuthService = pServer->createService(SERVICE_UUID);

  // Create the status characteristic
  BuildAuthStatusCharacteristic = BuildAuthService->createCharacteristic(
                                         STATUS_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_NOTIFY |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  BuildAuthStatusCharacteristic->addDescriptor(new BLE2902());

  BuildAuthService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Waiting for a client connection to notify...");
}

void loop() {
  // Simulate changing the boolean value
  delay(5000); // Wait for 5 seconds
  boolean randomBool = random(0, 2); // Generate a random boolean value (0 or 1)

  // Send the boolean value over BLE
  BuildAuthStatusCharacteristic->setValue(randomBool ? "true" : "false");
  BuildAuthStatusCharacteristic->notify();

  Serial.print("Sent value: ");
  Serial.println(randomBool ? "true" : "false");

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