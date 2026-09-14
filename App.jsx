// App.tsx
import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/Navigation/AppNavigator";
import { initI18n } from "./src/i18n/index";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { store } from "./src/Redux/store";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationToast from "./src/Components/NotificationToast";
import { setToastRef } from "./src/services/toastService";


const customFonts = {
  "CinzelDecorative-Regular": require("./src/assests/fonts/CinzelDecorative-Regular.ttf"),
  "CinzelDecorative-Bold": require("./src/assests/fonts/CinzelDecorative-Bold.ttf"),
  "CinzelDecorative-Black": require("./src/assests/fonts/CinzelDecorative-Black.ttf"),
  "Poppins-Regular": require("./src/assests/fonts/Poppins-Regular.ttf"),
  "Poppins-Bold": require("./src/assests/fonts/Poppins-Bold.ttf"),
  "Poppins-Black": require("./src/assests/fonts/Poppins-Black.ttf"),
  "Inter-SemiBold": require("./src/assests/fonts/Inter_28pt-SemiBold.ttf"),
  "Inter-Medium": require("./src/assests/fonts/Inter_28pt-Medium.ttf"),
  "Inter-Regular": require("./src/assests/fonts/Inter_28pt-Regular.ttf"),
  "Inter-Thin": require("./src/assests/fonts/Inter_28pt-Thin.ttf"),
  "Inter-Bold": require("./src/assests/fonts/Inter_28pt-Bold.ttf"),
};

const queryClient = new QueryClient();

const linking = {
  prefixes: ["alluvo://", "https://alluvo.life"],
  config: {
    screens: {
      User: {
        screens: {
          ReelDetail: {
            path: "reel/:reelId",
            parse: {
              reelId: (reelId) => Number(reelId),
            },
          },
        },
      },
    },
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initI18n();
        await Font.loadAsync(customFonts);
      } catch (e) {
        console.warn("Font loading error:", e);
      } finally {
        if (mounted) setFontsLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const theme = {
    ...DefaultTheme,
    fonts: {
      displayLarge: { fontFamily: "CinzelDecorative-Black", fontWeight: "900" },
      displayMedium: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },
      displaySmall: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },

      headlineLarge: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },
      headlineMedium: {
        fontFamily: "CinzelDecorative-Bold",
        fontWeight: "700",
      },
      headlineSmall: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },

      titleLarge: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },
      titleMedium: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },
      titleSmall: { fontFamily: "CinzelDecorative-Regular", fontWeight: "400" },

      bodyLarge: { fontFamily: "CinzelDecorative-Regular", fontWeight: "400" },
      bodyMedium: { fontFamily: "CinzelDecorative-Regular", fontWeight: "400" },
      bodySmall: { fontFamily: "CinzelDecorative-Regular", fontWeight: "400" },

      labelLarge: { fontFamily: "CinzelDecorative-Bold", fontWeight: "600" },
      labelMedium: { fontFamily: "CinzelDecorative-Bold", fontWeight: "700" },
      labelSmall: { fontFamily: "CinzelDecorative-Regular", fontWeight: "400" },
    },
  };

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer linking={linking}>
              <AppNavigator />
            </NavigationContainer>
            <NotificationToast ref={(ref) => setToastRef(ref)} />
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
