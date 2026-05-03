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
- **Backend API**: `https://api.abdallah-ghazal.cloud` (JWT Bearer auth)

## Architecture

- `App.tsx` — entry point, font loading, splash screen, language bootstrap
- `src/navigation/AppNavigator.tsx` — root stack navigator (all routes) + AuthProvider wrapper
- `src/navigation/TabNavigator.tsx` — consumer bottom tabs (Home, Booking, Cart, Contract, Profile)
- `src/navigation/ProviderTabNavigator.tsx` — provider bottom tabs (Home, Performance, Add FAB, Orders, Wallet)
- `src/screens/` — consumer screens (Home, Login, Cart, Booking, etc.)
- `src/screens/provider/` — Service Provider screens (see below)
- `src/components/` — reusable UI components
- `src/context/AuthContext.tsx` — global auth state (isAuthenticated, user, role, signIn, signOut, refreshUser)
- `src/context/LanguageContext.tsx` — global language state
- `src/services/` — all API service modules (see below)
- `src/i18n/` — i18next config, Arabic/English translations, RTL bootstrap
- `src/theme/` — colors and typography constants
- `src/utils/rtl.ts` — RTL direction helpers
- `assets/` — images and icons

## API Services (`src/services/`)

| File | Description |
|------|-------------|
| `api.ts` | Base `apiRequest()` client, `TokenStorage` (AsyncStorage), auto token refresh on 401 |
| `auth.service.ts` | `signIn`, `register` (CLIENT/PROVIDER/COMPANY), `requestOtp`, `verifyOtp`, `signOut` |
| `categories.service.ts` | `getAll`, `getOne`, `getSubCategories` |
| `providers.service.ts` | `getAll`, `getOne`, `getReviews`, `createReview`, `setAvailability` |
| `products.service.ts` | `getAll`, `getOne`, `create`, `update`, `remove`, `getReviews`, `createReview` |
| `bookings.service.ts` | `create`, `update`, `updateStatus`, `getMyBookings` |
| `profile.service.ts` | `getProfile`, `updateProfile`, `changePassword`, `updateProviderProfile`, `uploadAvatar` |
| `wallet.service.ts` | `getWallet`, `getTransactions`, `createTransaction` |
| `teams.service.ts` | `create`, `update`, `addMember`, `updateMember`, `removeMember`, `resetMemberPassword` |
| `notifications.service.ts` | `registerDeviceToken`, `send` |

## Auth Flow

- JWT tokens stored in AsyncStorage via `TokenStorage`
- `AuthContext` wraps `AppNavigator` — provides `useAuth()` hook everywhere
- Auto token refresh on 401 via `refreshAccessToken()` in `api.ts`
- After login: CLIENT → `Main` (TabNavigator), PROVIDER → `ProviderMain` (ProviderTabNavigator)

## Screens Connected to Real API

| Screen | API Used |
|--------|----------|
| `LoginScreen` | `AuthService.signIn` |
| `CreateAccountScreen` | `AuthService.register` (CLIENT/PROVIDER/COMPANY) |
| `VerificationScreen` | `AuthService.verifyOtp` |
| `HomeScreen` | `CategoriesService`, `ProductsService`, `ProvidersService` |
| `AllCategoriesScreen` | `CategoriesService.getAll` |
| `AllProductsScreen` | `ProductsService.getAll` with category filter chips |
| `BookingScreen` | `BookingsService.getMyBookings` |
| `ProfileScreen` | `useAuth()` for user data, `signOut` |
| `ProviderProfileScreen` | `useAuth()` for user data, `signOut` |
| `ProviderOrderScreen` | `BookingsService.getMyBookings` |
| `ProviderWalletScreen` | `WalletService.getWallet + getTransactions` |
| `WalletScreen` | `WalletService.getWallet + getTransactions` |
| `ProviderSelectServicesScreen` | `CategoriesService.getAll` + `ProfileService.updateProviderProfile` |
| `TeamsScreen` | `TeamsService.create` |

## Service Provider Flow

Registration: ChooseAccount → CreateAccount (Step 2/3 indicator) → ProviderSelectServices (Step 3/3) → ProviderAccountSuccess → ProviderMain

Provider screens in `src/screens/provider/`:
- `ProviderSelectServicesScreen` — grid of real API categories to pick offered services (registration step 3)
- `ProviderAccountSuccessScreen` — success state after registration
- `ProviderHomeScreen` — dashboard with Service & Teams cards + Add New Service button
- `ProviderPerformanceScreen` — stats cards, line chart, last orders list
- `ProviderOrderScreen` — real orders from API with New/In-Progress/Completed badges
- `ProviderTimeScreen` — calendar + time picker (used from AddNewService)
- `ProviderWalletScreen` — real wallet balance, Transfers/Deposits, real transactions list
- `AddNewServiceScreen` — form to add a new service (title, price, time, location, image)
- `TeamsScreen` — form to create a team via `TeamsService.create`

## Running the App

The workflow `Start application` runs:
```
npm run web -- --port 5000
```

The app runs on port 5000 in web mode (Expo web). For native testing, users can scan the QR code from the Expo Go app on their device.

## Web Compatibility Notes

- `I18nManager.swapLeftAndRightInRTL` is skipped on web (not available)
- The `direction` style property shows a warning on web (web uses `writingDirection`)
- `useNativeDriver` animation warning on web (expected, native is source of truth)
- These are minor web rendering differences; native (Expo Go) is the source of truth
