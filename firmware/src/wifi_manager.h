#pragma once

#include <WiFi.h>

#include "config.h"

inline void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.printf("Conectando ao Wi-Fi \"%s\"", WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\nWi-Fi conectado, IP: %s\n", WiFi.localIP().toString().c_str());
}
