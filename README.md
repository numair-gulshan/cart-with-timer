# React Native Assessment App

Small demo app showing product reservations with timed holds.

Features
- Reserve items for 5 minutes when adding to cart.
- Live countdown timers in the cart.
- Reservations persist across app restarts using AsyncStorage.
- Auto-removal of expired reservations and stock restoration.

Quick start

1. Install dependencies

```bash
# using npm
npm install

# install async-storage (if you haven't yet)
expo install @react-native-async-storage/async-storage

# start the app
npm run start
```

Notes
- Key files:
  - `context/CartContext.tsx` — reservation logic, persistence, timers
  - `app/index.tsx` — product list and Open Cart button with badge
  - `app/cart.tsx` — cart UI with live timers, remove and checkout actions
- The app already expects `@react-native-async-storage/async-storage`. If you used `yarn add @react-native-async-storage/async-storage` it's fine.
- Timers are scheduled on load and persisted reservations are filtered by expiry, so reopening the app restores countdowns correctly.

Testing tips
- Add an item to the cart and open the cart to see the countdown.
- Close/reopen the app to confirm the reservation persists and the remaining time is accurate.

Possible improvements
- Show local notifications when reservations expire.
- Add an explicit checkout flow to consume reserved items permanently.

If you want, I can commit these changes or run the app here to verify behavior.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
