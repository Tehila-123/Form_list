import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { COLORS } from "../theme";
import { formatFileSize } from "../utils/format";

// Reusable file upload field.
// `value` is the chosen file ({ name, mimeType, size, uri }) or null.
// `onChange` receives the file object, or null when it is removed.
export default function FileUpload({ value, onChange }) {
  const [error, setError] = useState("");

  const pickFile = async () => {
    try {
      setError("");
      // Opens the device's native file picker.
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      // The user closed the picker without choosing anything.
      if (result.canceled) return;

      const asset = result.assets[0];
      onChange({
        name: asset.name,
        size: asset.size ?? 0,
        mimeType: asset.mimeType ?? "unknown",
        uri: asset.uri,
      });
    } catch {
      setError("Could not pick a file. Please try again.");
    }
  };

  return (
    <View>
      <Pressable style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>
          {value ? "Choose a different file" : "Choose a file"}
        </Text>
      </Pressable>

      {value ? (
        <View style={styles.fileCard}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {value.name}
            </Text>
            <Text style={styles.fileMeta}>
              {value.mimeType} • {formatFileSize(value.size)}
            </Text>
          </View>
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.hint}>No file selected</Text>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: COLORS.card,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  fileInfo: {
    flex: 1,
    paddingRight: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  fileMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  removeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.error,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 8,
  },
});
