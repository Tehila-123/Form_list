import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../theme";
import { formatDate, formatTime } from "../utils/format";

// Web fallback: the native date/time picker has no web version, so we let the
// user type the value instead. Values are parsed when the field loses focus.
function parseDate(text) {
  const match = text.trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return isValid ? date : null;
}

function parseTime(text) {
  const match = text.trim().match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export default function DateTimeField({ mode, value, onChange }) {
  // `draft` holds what the user is currently typing. When it is null we simply
  // display the real value, so external changes (like Reset) show up instantly.
  const [draft, setDraft] = useState(null);

  const valueText = mode === "date" ? formatDate(value) : formatTime(value);
  const text = draft === null ? valueText : draft;

  const commit = () => {
    if (draft === null) return;
    const parsed = mode === "date" ? parseDate(draft) : parseTime(draft);
    if (parsed) {
      onChange(parsed);
    }
    // Clearing the draft re-displays the formatted value (reverts invalid input).
    setDraft(null);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setDraft}
        onBlur={commit}
        onSubmitEditing={commit}
        placeholder={mode === "date" ? "DD/MM/YYYY" : "HH:MM"}
        placeholderTextColor={COLORS.placeholder}
      />
      <Text style={styles.hint}>
        {mode === "date"
          ? "Type a date as DD/MM/YYYY"
          : "Type a time as HH:MM (24-hour)"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
});
