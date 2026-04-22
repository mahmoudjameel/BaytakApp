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
- `src/navigation/AppNavigator.tsx` — root stack navigator (all routes)
- `src/navigation/TabNavigator.tsx` — consumer bottom tabs (Home, Booking, Cart, Contract, Profile)
- `src/navigation/ProviderTabNavigator.tsx` — provider bottom tabs (Home, Performance, Add FAB, Orders, Wallet)
- `src/screens/` — consumer screens (Home, Login, Cart, Booking, etc.)
- `src/screens/provider/` — Service Provider screens (see below)
- `src/components/` — reusable UI components
- `src/context/` — LanguageContext for global language state
- `src/i18n/` — i18next config, Arabic/English translations, RTL bootstrap
- `src/theme/` — colors and typography constants
- `src/utils/rtl.ts` — RTL direction helpers
- `assets/` — images and icons

## Service Provider Flow

Registration: ChooseAccount → CreateAccount (Step 2/3 indicator) → ProviderSelectServices (Step 3/3) → ProviderAccountSuccess → ProviderMain

Provider screens in `src/screens/provider/`:
- `ProviderSelectServicesScreen` — grid to pick offered services (registration step 3)
- `ProviderAccountSuccessScreen` — success state after registration
- `ProviderHomeScreen` — dashboard with Service & Teams cards + Add New Service button
- `ProviderPerformanceScreen` — stats cards, line chart, last orders list
- `ProviderOrderScreen` — orders list with New/In-Progress/Completed badges
- `ProviderTimeScreen` — calendar + time picker (used from AddNewService)
- `ProviderWalletScreen` — available balance, Transfers/Deposits, transactions list
- `AddNewServiceScreen` — form to add a new service (title, price, time, location, image)
- `TeamsScreen` — form to create a team (name, description, members, profile image)

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
