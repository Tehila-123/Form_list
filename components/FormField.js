import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme";

// A small wrapper that renders a field label above its input.
// Reusing it keeps the spacing and label styling identical for every field.
export default function FormField({ label, children }) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.label,
    marginBottom: 8,
  },
});
