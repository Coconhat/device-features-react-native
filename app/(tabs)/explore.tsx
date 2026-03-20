import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useAppPreferences } from '@/hooks/use-app-preferences';
import { useTravelEntries } from '@/hooks/use-travel-entries';
import { sendEntrySavedNotification } from '@/lib/notifications';

function formatAddress(address: Location.LocationGeocodedAddress | null) {
  if (!address) {
    return '';
  }

  const segments = [address.name, address.street, address.city, address.region, address.country].filter(
    (segment) => typeof segment === 'string' && segment.trim().length > 0
  );

  return segments.join(', ');
}

export default function AddTravelEntryScreen() {
  const { theme } = useAppPreferences();
  const { addEntry } = useTravelEntries();
  const palette = Colors[theme];

  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = useCallback(() => {
    setImageUri('');
    setAddress('');
    setErrorText('');
    setIsResolvingAddress(false);
    setIsSaving(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [resetForm])
  );

  const capturePhoto = useCallback(async () => {
    setErrorText('');

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      setErrorText('Camera permission is required to take a photo.');
      return;
    }

    const photoResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (photoResult.canceled || !photoResult.assets?.length) {
      return;
    }

    const selectedUri = photoResult.assets[0].uri.trim();
    if (!selectedUri) {
      setErrorText('Invalid photo selected. Please try again.');
      return;
    }

    setImageUri(selectedUri);
    setAddress('');
    setIsResolvingAddress(true);

    try {
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        setErrorText('Location permission is required to detect your current address.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const parsedAddress = formatAddress(geocodeResult[0] ?? null);
      if (!parsedAddress) {
        setErrorText('Address could not be determined. Please try again.');
        return;
      }

      setAddress(parsedAddress);
    } catch {
      setErrorText('Failed to fetch your current address. Please try again.');
    } finally {
      setIsResolvingAddress(false);
    }
  }, []);

  const saveEntry = useCallback(async () => {
    setErrorText('');

    if (!imageUri.trim()) {
      setErrorText('Please take a photo first.');
      return;
    }

    if (!address.trim()) {
      setErrorText('Current address is required before saving.');
      return;
    }

    if (isResolvingAddress || isSaving) {
      return;
    }

    setIsSaving(true);
    const result = await addEntry({ imageUri, address });

    if (!result.ok) {
      setErrorText(result.error ?? 'Unable to save this travel entry.');
      setIsSaving(false);
      return;
    }

    await sendEntrySavedNotification(address);
    resetForm();
    setIsSaving(false);
    Alert.alert('Saved', 'Your travel entry has been saved successfully.');
  }, [addEntry, address, imageUri, isResolvingAddress, isSaving, resetForm]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: palette.text }]}>Add Travel Entry</Text>
        <Text style={[styles.subtitle, { color: palette.mutedText }]}>Capture a photo and we’ll attach your current address automatically.</Text>

        <View style={[styles.previewContainer, { borderColor: palette.border, backgroundColor: palette.card }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} contentFit="cover" style={styles.previewImage} />
          ) : (
            <Text style={[styles.placeholderText, { color: palette.mutedText }]}>No photo selected</Text>
          )}
        </View>

        <Pressable
          onPress={() => {
            void capturePhoto();
          }}
          style={({ pressed }) => [
            styles.captureButton,
            {
              backgroundColor: palette.text,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.captureButtonText, { color: palette.background }]}>Take Picture</Text>
        </Pressable>

        <View style={[styles.addressBox, { borderColor: palette.border, backgroundColor: palette.card }]}>
          <Text style={[styles.addressLabel, { color: palette.mutedText }]}>Current Address</Text>
          {isResolvingAddress ? (
            <View style={styles.addressLoading}>
              <ActivityIndicator color={palette.text} />
              <Text style={[styles.addressText, { color: palette.text }]}>Detecting address...</Text>
            </View>
          ) : (
            <Text style={[styles.addressText, { color: palette.text }]}> {address || 'No address yet'} </Text>
          )}
        </View>

        {!!errorText && <Text style={[styles.errorText, { color: palette.danger }]}>{errorText}</Text>}

        <Pressable
          onPress={() => {
            void saveEntry();
          }}
          style={({ pressed }) => [
            styles.saveButton,
            {
              borderColor: palette.text,
              opacity: pressed || isSaving ? 0.8 : 1,
            },
          ]}
          disabled={isSaving}>
          <Text style={[styles.saveButtonText, { color: palette.text }]}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  previewContainer: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  captureButton: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  addressBox: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  addressLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
