#pragma once

// Wi-Fi e endereço do backend ficam em secrets.h (gitignored) — copie
// secrets.h.example para secrets.h e preencha antes de gravar no ESP32.
#include "secrets.h"

#define API_PORT 3000
#define API_PATH "/api/readings"

// Credencial do dispositivo, gerada pelo backend na criação do ESP32 (ver docs/AUTHENTICATION.md).
#define DEVICE_X_TOKEN "dev-token-esp01"

// Identificação enviada em cada leitura — deve bater com o registro do dispositivo no backend.
#define ESP_ID "esp_01"
#define SETOR "producao"
#define SENSOR_ID "sensor_01"

// Pino digital conectado ao sinal do sensor de fluxo YF-S201.
#define FLOW_SENSOR_PIN 27

// Pulsos por segundo por litro/minuto — constante de calibração do YF-S201 (datasheet do fabricante).
#define FLOW_CALIBRATION_FACTOR 7.5f

// Display OLED SSD1306 via I2C (pinos padrão do ESP32: SDA=21, SCL=22).
#define OLED_WIDTH 128
#define OLED_HEIGHT 64
#define OLED_I2C_ADDRESS 0x3C

// Intervalo entre leituras/envios para a API.
#define SEND_INTERVAL_MS 5000
