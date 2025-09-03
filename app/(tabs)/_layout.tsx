import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Pressable } from "react-native";
import { CalendarDays, User } from "lucide-react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import Header from "@/components/Header";
import { useColorScheme } from "@/hooks/useColorScheme";

// Reusable Tab Icon Wrapper
function TabIcon({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
      }}
    >
      {children}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        headerShown: true,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: "#B6EC80",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarButton: (props) => {
          const { ref, ...rest } = props;
          return (
            <Pressable
              android_ripple={{ color: "transparent" }}
              style={({ pressed }) => [
                {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 70,
                },
                pressed && Platform.OS === "ios" && { opacity: 0.7 }, // only subtle feedback on iOS
              ]}
              {...rest}
            />
          );
        },
        tabBarStyle: {
          paddingTop: 15,
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 25,
          backgroundColor: "#111111",
          borderTopWidth: 0,
          marginHorizontal: 20,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon>
              <IconSymbol size={28} name="house.fill" color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon>
              <CalendarDays size={28} color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon>
              <User size={28} color={color} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
