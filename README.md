# Home for Homebridge
> A face for the embedded

Home is an application for Homebridge users that let's them control their embedded devices via their computers. While Apple has a native Home application on all macOS devices running macOS Mojave and newer, Windows users are left in the dark. Well no more, this 'Home' app aims to bring most features to the masses.

[![Build Status](https://travis-ci.com/LawyerMorty97/Home.svg?token=cuZyxzPpztjXPKTE1kbN&branch=master)](https://travis-ci.com/LawyerMorty97/Home)

If you like this project i'm working on be sure to Watch/Star it!

# Requirements
- Homebridge
- Homebridge MQTT
- Patience
- (Optional) Raspberry Pi 3B

# Running Home
- Clone the repository
- `npm i`
- `cd source && npm start`

# Features:
- [x] Connecting to the Homebridge MQTT broker
- [x] Basic UI for toggling devices
- [ ] Create a Get Started page
- [ ] Possibility to add new devices through Home
- [ ] Settings page
- [x] Support for changing the MQTT broker
- [ ] Settings functionality
- [x] Updating UI when devices change states via Home macOS/iOS
- [] UI animations and transitions (Started)

# Homekit Features:
- [x] Retrieving devices
- [x] Toggling device states
- [x] Support for Switches
- [ ] Support for Sensors
- [ ] Support for Brightness

# FAQ
To use this program, you'll have to have an MQTT broker active. I recommend installing one onto a Raspberry Pi (or on the same device running Homebridge) as this makes things less complicated. Below are links that are helpful to getting MQTT setup on Raspberry Pi
- [Homebridge MQTT Plugin](https://www.npmjs.com/package/homebridge-mqtt)
- [Setting up Raspberry Pi as an MQTT Broker](https://appcodelabs.com/introduction-to-iot-build-an-mqtt-server-using-raspberry-pi)
