import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme";

// A reusable radio group that allows selecting only ONE option.
// `selected` is a single string (the currently chosen option label).
export default function RadioGroup({ options, selected, onChange }) {
  return (
    <View style={styles.group}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <Pressable
            key={option}
            style={styles.option}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={[styles.circle, isSelected && styles.circleSelected]}>
              {isSelected ? <View style={styles.dot} /> : null}
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
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: COLORS.card,
  },
  circleSelected: {
    borderColor: COLORS.primary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
});
