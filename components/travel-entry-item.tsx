import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
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
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
      ]}
    >
      <Image
        source={{ uri: entry.imageUri }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text
          style={[styles.address, { color: palette.text }]}
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
              borderColor: palette.danger,
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
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 14,
    gap: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
  },
  removeButton: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  removeText: {
    fontWeight: "700",
    fontSize: 13,
  },
});
