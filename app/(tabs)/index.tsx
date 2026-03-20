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
import { Colors, Fonts } from "@/constants/theme";
import { useAppPreferences } from "@/hooks/use-app-preferences";
import { useTravelEntries } from "@/hooks/use-travel-entries";

export default function HomeScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppPreferences();
  const { entries, isLoaded, removeEntry } = useTravelEntries();
  const palette = Colors[theme];
  const today = new Date();

  const formattedDate = today.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <View style={styles.metaRow}>
        <View style={[styles.sotdBadge, { borderColor: palette.text }]}></View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => {
              void toggleTheme();
            }}
            style={({ pressed }) => [
              styles.linkAction,
              { opacity: pressed ? 0.75 : 1, borderBottomColor: palette.text },
            ]}
          >
            <Text style={[styles.linkActionText, { color: palette.text }]}>
              {theme === "light" ? "DARK" : "LIGHT"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={[styles.dateCaption, { color: palette.mutedText }]}>
        Save your favorite places
      </Text>

      <Text style={[styles.title, { color: palette.text }]}>
        TRAVEL{"\n"}
        DIARY ARCHIVE
      </Text>

      <View style={styles.taglineRow}>
        <View style={[styles.taglineDot, { backgroundColor: palette.text }]} />
        <Text style={[styles.taglineText, { color: palette.text }]}>
          The Places You Saved
        </Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: palette.mutedText }]}>
              {isLoaded ? "No Entries yet" : "Loading..."}
            </Text>
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  sotdBadge: {
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: "row",
    overflow: "hidden",
  },
  sotdText: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "700",
    borderRightWidth: 1,
    borderRightColor: "#7D7D7D",
  },
  sotdValue: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "800",
    fontFamily: Fonts.serif,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
  },
  linkAction: {
    borderBottomWidth: 1,
    paddingBottom: 1,
  },
  linkActionText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  dateCaption: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    fontFamily: Fonts.serif,
  },
  title: {
    marginTop: 18,
    fontSize: 58,
    lineHeight: 56,
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: -1.4,
  },
  taglineRow: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  taglineDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
  },
  taglineText: {
    fontSize: 22,
    fontFamily: Fonts.serif,
    textDecorationLine: "underline",
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 22,
    flexGrow: 1,
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
});
