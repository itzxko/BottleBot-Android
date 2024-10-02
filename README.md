# BottleBot: A Mobile Recycling Solution for Promoting Plastic Bottle Disposal through Community Rewards

## Description
BottleBot is a mobile recycling bin designed to promote the disposal and recycling of plastic bottles through a community reward system. Users can command the bin via a mobile app to travel to their location, collect plastic bottles, and earn points that can be converted into essential goods such as food, water, and clothing. The bin autonomously navigates using GPS, detects obstacles, and avoids them using various sensors. Admins can monitor the bin and manage the system via a web application.

## Features
### Software
- **Mobile & Web Applications:** Accessible on web and mobile platforms for both citizen users and administrators.
- **Machine Learning:** Integrated model predicts peak days for plastic collection based on historical data.
- **Command-to-Travel:** Users can call the bin to their location for plastic collection via GPS.
- **User Profile:** Allows users to view and update personal information.
- **User History:** Displays user points, available rewards, and transaction history.
- **Location Monitoring:** Real-time tracking of the bin's location.
- **User Management:** Admins can manage user profiles and monitor collected rewards.
- **State Monitoring:** Tracks bin capacity, battery percentage, and other key metrics.
- **Map Plotting:** Admins can set default routes for the bin based on factors like battery levels, capacity, and weather conditions.
- **Reward System:** Admins manage plastic collection points and available rewards.
- **QR Code Scanner:** Users can scan a QR code for rewards if they do not have access to the mobile app.
- **Real-time Alerts:** Notifications are sent for bin arrival, low battery, capacity full, and other events.

### Hardware
- **Object Detection:** Uses You Only Look Once (YOLO) to identify and accept plastic bottles.
- **Autonomous Driving:** GPS-based navigation with obstacle detection.
- **Weight and Overflow Detection:** Prevents overloading and overflow of collected plastic.
- **Water Level Detection:** Detects rising water levels and stops movement to avoid danger.
- **Voice Commands:** Can accept voice commands within a 1-3 meter range.
- **QR Code Receipt Printing:** Issues a receipt for reward collection for users without mobile access.
- **Internet Connectivity:** The bin connects via an onboard SIM module for real-time data exchange.

## Objectives
1. Equip the mobile bin with GPS for autonomous navigation.
2. Implement a path-planning and obstacle avoidance algorithm.
3. Use the YOLO algorithm to identify plastic bottles.
4. Develop a mobile app to command the bin to the user's location.
5. Build a web application for admin monitoring and system configuration.
6. Create a machine learning model to predict peak plastic collection days.

## Scope
### Software:
- Accessible via web and mobile apps.
- Two user levels: Admin and Citizen.
- Predictive model for peak days of plastic collection.
- Command bin navigation via GPS.
- User profile management and history tracking.
- Real-time bin location monitoring.

### Hardware:
- Plastic bottle identification and automatic lid opening.
- GPS-based autonomous navigation.
- Obstacle detection using ultrasonic and infrared sensors.
- Overflow and weight detection.
- Voice command integration.
- Receipt printing with QR codes for rewards.

## Limitations
### Software:
- Requires mobile GPS access.
- Compatible with Android 9+ and iOS 12+.
- Requires active internet connection.
- ML model accuracy dependent on data quality.

### Hardware:
- Only accepts plastic bottles.
- GPS accuracy affected by environmental factors.
- Battery life limits operation time.
- Limited to 5kg capacity.
- Max bottle size: 20.3cm height, 6.35cm diameter.
- Microphone sensitivity may be affected by noise.
- Day-time operation only.
- Environmental factors like rain may affect performance.

## Team
- Bejerano, Joshua A.
- Budlao, Ryan Marc
- Chato Jr., Eduardo J.
- Dela Cruz, Leslie Nicole D.
- Mendador, Jiro G.
- Villarin, Ivan James G.

## License
This project is licensed under the [MIT License](LICENSE).
# BottleBot-Android
