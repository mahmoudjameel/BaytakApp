# Baytak App

A React Native / Expo mobile home services application ("بيتك للخدمات المنزلية").

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **Navigation**: React Navigation (bottom tabs + native stack)
- **Internationalization**: i18next with Arabic (RTL) and English support
- **Fonts**: Outfit and Poppins via @expo-google-fonts
- **Storage**: AsyncStorage for local persistence
- **Package Manager**: npm

## Architecture

- `App.tsx` — entry point, font loading, splash screen, language bootstrap
- `src/navigation/` — AppNavigator (stack) and TabNavigator (bottom tabs)
- `src/screens/` — individual app screens (Home, Login, Cart, Booking, etc.)
- `src/components/` — reusable UI components
- `src/context/` — LanguageContext for global language state
- `src/i18n/` — i18next config, Arabic/English translations, RTL bootstrap
- `src/theme/` — colors and typography constants
- `src/utils/rtl.ts` — RTL direction helpers
- `assets/` — images and icons

## Running the App

The workflow `Start application` runs:
```
npx expo start --web --port 5000
```

The app runs on port 5000 in web mode (Expo web). For native testing, users can scan the QR code from the Expo Go app on their device.

## Web Compatibility Notes

- `I18nManager.swapLeftAndRightInRTL` is skipped on web (not available)
- The `direction` style property shows a warning on web (web uses `writingDirection`)
- These are minor web rendering differences; native (Expo Go) is the source of truth
