import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme";

// A reusable checkbox list that allows selecting MULTIPLE options.
// `selected` is an array of the currently checked option labels.
export default function CheckboxGroup({ options, selected, onChange }) {
  // Add the option if it is not selected yet, otherwise remove it.
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.group}>
      {options.map((option) => {
        const isChecked = selected.includes(option);
        return (
          <Pressable
            key={option}
            style={styles.option}
            onPress={() => toggleOption(option)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
          >
            <View style={[styles.box, isChecked && styles.boxChecked]}>
              {isChecked ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.optionLabel}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: COLORS.card,
  },
  boxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  optionLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
});
