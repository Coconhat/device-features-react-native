import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { AppTheme, TravelEntry } from "@/types/travel-entry";

type TravelEntryItemProps = {
  entry: TravelEntry;
  theme: AppTheme;
  onRemove: (id: string) => void;
};

function TravelEntryItemComponent({
  entry,
  theme,
  onRemove,
}: TravelEntryItemProps) {
  const palette = Colors[theme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.text,
          borderColor: palette.text,
        },
      ]}
    >
      <View style={[styles.imageShell, { backgroundColor: palette.card }]}>
        <Image
          source={{ uri: entry.imageUri }}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.kicker, { color: palette.mutedText }]}>
          Saved Place
        </Text>
        <Text
          style={[styles.address, { color: palette.background }]}
          numberOfLines={3}
        >
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: palette.mutedText }]}>
          {new Date(entry.createdAt).toLocaleString()}
        </Text>

        <Pressable
          onPress={() => onRemove(entry.id)}
          style={({ pressed }) => [
            styles.removeButton,
            {
              borderBottomColor: palette.danger,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.removeText, { color: palette.danger }]}>
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export const TravelEntryItem = memo(TravelEntryItemComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
    padding: 10,
  },
  imageShell: {
    borderRadius: 12,
    padding: 6,
  },
  image: {
    width: "100%",
    height: 270,
    borderRadius: 8,
  },
  content: {
    paddingHorizontal: 2,
    paddingTop: 12,
    gap: 6,
  },
  kicker: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  address: {
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -0.6,
    fontWeight: "700",
    fontFamily: Fonts.serif,
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  removeButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  removeText: {
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
