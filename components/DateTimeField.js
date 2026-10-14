import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../theme";
import { formatDate, formatTime } from "../utils/format";

// Native (iOS / Android) date or time field.
// Shows the current value and opens the system picker when tapped.
// `mode` is either "date" or "time".
export default function DateTimeField({ mode, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selected) => {
    // Android shows a dialog that should close after a choice.
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selected) {
        onChange(selected);
      }
      return;
    }
    // On iOS the spinner stays open, so update on every change.
    if (selected) {
      onChange(selected);
    }
  };

  const displayValue = mode === "date" ? formatDate(value) : formatTime(value);

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setShowPicker((previous) => !previous)}
      >
        <Text style={styles.value}>{displayValue}</Text>
        <Text style={styles.hint}>Tap to change</Text>
      </Pressable>
      {showPicker ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={mode === "time"}
          maximumDate={mode === "date" ? new Date() : undefined}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
  },
  hint: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
