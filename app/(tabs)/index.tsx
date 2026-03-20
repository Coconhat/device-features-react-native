import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TravelEntryItem } from "@/components/travel-entry-item";
import { Colors } from "@/constants/theme";
import { useAppPreferences } from "@/hooks/use-app-preferences";
import { useTravelEntries } from "@/hooks/use-travel-entries";

export default function HomeScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppPreferences();
  const { entries, isLoaded, removeEntry } = useTravelEntries();
  const palette = Colors[theme];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: palette.text }]}>
            Travel Diary
          </Text>
          <Text style={[styles.subtitle, { color: palette.mutedText }]}>
            Your saved memories
          </Text>
        </View>

        <Pressable
          onPress={() => {
            void toggleTheme();
          }}
          style={({ pressed }) => [
            styles.toggleButton,
            {
              borderColor: palette.border,
              backgroundColor: palette.card,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[styles.toggleText, { color: palette.text }]}>
            {theme === "light" ? "Dark" : "Light"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: palette.mutedText }]}>
            {isLoaded ? "No Entries yet" : "Loading..."}
          </Text>
        }
        renderItem={({ item }) => (
          <TravelEntryItem
            entry={item}
            theme={theme}
            onRemove={(id) => {
              Alert.alert(
                "Remove Entry",
                "Are you sure you want to delete this travel entry?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                      void removeEntry(id);
                    },
                  },
                ],
              );
            }}
          />
        )}
      />

      <Pressable
        onPress={() => router.push("/(tabs)/explore")}
        style={({ pressed }) => [
          styles.floatingButton,
          {
            backgroundColor: palette.text,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text
          style={[styles.floatingButtonText, { color: palette.background }]}
        >
          Add Entry
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 80,
    fontWeight: "600",
  },
  floatingButton: {
    position: "absolute",
    right: 18,
    bottom: 16,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
