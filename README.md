# Touchdown

Touchdown is a **private, city‑first relationship recall app**. It helps you remember who you know by city and quickly open your favourite messaging apps to reconnect at the right time.

This app is intentionally minimal and privacy‑first. It stores all data locally on your device. Touchdown is not a messaging platform and will never automate your communication. It simply helps you remember and launch existing apps with a couple of taps.

## Features

- **Local‑first storage**: All information is stored in a local SQLite database using Expo’s SQLite API. No network connection is required to use the app.
- **People by city**: Assign a primary city and additional cities to the people you know, then browse your contacts by city.
- **Quick actions**: From the city detail view you can open contact methods with one tap. Touchdown never sends messages; it just opens your existing apps via deep links.
- **Trips and timing**: Create manual trips with a city and date range. The Home screen surfaces your next upcoming trip and shows how many people you know there.
- **Inbox**: Keep track of incomplete records – people with no name or no city – and complete them when you have more information.
- **Capture friction minimised**: Add new people quickly from anywhere. Assign cities, tier, notes and multiple contact methods.
- **No AI or automation**: Touchdown does not suggest messages, scrape data or perform any network operations. It’s a simple launcher for your memories.

## Installation & Running

1. **Install dependencies**.

   Navigate into the project directory and install the dependencies. You’ll need Node.js and the Expo CLI installed globally (`npm install -g expo-cli`) if you haven’t already.

   ```bash
   cd touchdown
   npm install
   ```

2. **Start the development server**.

   Use Expo to start the app in development mode. You can run on iOS, Android or Web.

   ```bash
   npm run start
   # or
   expo start
   ```

   Follow the CLI instructions to open the app on a simulator, emulator or physical device.

## Project Structure

```
touchdown/
├── app.json             # Expo configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── babel.config.js      # Babel configuration for Expo
├── assets/              # App icons and splash images
├── src/
│   ├── App.tsx          # Entry point – wraps navigation and data context
│   ├── data/
│   │   ├── database.ts   # SQLite table definitions and CRUD helpers
│   │   └── models.ts     # Type definitions for Person, City, ContactMethod and Trip
│   ├── context/
│   │   └── DataContext.tsx  # React context providing app state and CRUD functions
│   ├── utils/
│   │   ├── linking.ts    # Helpers to build and open deep links for contact methods
│   │   └── date.ts       # Date helpers for formatting and upcoming trip logic
│   ├── navigation/
│   │   └── RootNavigator.tsx  # Bottom tab and stack navigators
│   └── screens/          # All UI screens
│       ├── HomeScreen.tsx
│       ├── CitiesScreen.tsx
│       ├── CityDetailScreen.tsx
│       ├── PeopleScreen.tsx
│       ├── PersonDetailScreen.tsx
│       ├── AddEditPersonScreen.tsx
│       ├── InboxScreen.tsx
│       ├── TripsScreen.tsx
│       ├── AddEditTripScreen.tsx
│       └── SettingsScreen.tsx
└── README.md            # This file
```

## Usage Notes

- **Adding people**: Use the floating “+” button on the People tab to quickly add a new person. You can also add a person from the City detail screen, which will pre‑assign the city.
- **Assigning cities**: When creating or editing a person, choose a primary city from existing cities or type a new city name. You can also select additional cities via the “Additional Cities” selector.
- **Contact methods**: Add as many contact methods as you like. Supported platforms are Phone, SMS, Instagram, WhatsApp, Telegram, LinkedIn, TikTok and Email. Touchdown generates a deep link and opens the corresponding app or website when tapped.
- **Trips**: The Trips tab lets you create manual trips. Choose a city and a start and end date. The Home tab will show your next upcoming trip and how many people you know there.
- **Inbox**: Records with missing names or cities appear in the Inbox. Use this to clean up incomplete entries.
- **Privacy**: Everything stays on your device. Touchdown does not sync, analyse or transmit your data. There is no AI, no suggestions and no automation.

## Contributing

This project is a proof‑of‑concept and is intentionally minimal. Feel free to fork it and add features that align with the core philosophy: improve recall, improve timing and reduce capture friction – and nothing more.