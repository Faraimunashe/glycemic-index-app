import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function MedicalPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Classification</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>GI Range</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Examples</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.highGI]}>
          <Text style={styles.cellText}>High GI</Text>
        </View>
        <View style={[styles.cell, styles.highGI]}>
          <Text style={styles.cellText}>70 and above</Text>
        </View>
        <View style={[styles.cell, styles.highGI]}>
          <Text style={styles.cellText}>Baked Potatoes, White Bread, Rice Pasta, Corn Flakes, Fruit Roll-Ups, Special K, Rice Cakes, Dates, Soda Crackers, Doughnut</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.mediumGI]}>
          <Text style={styles.cellText}>Medium GI</Text>
        </View>
        <View style={[styles.cell, styles.mediumGI]}>
          <Text style={styles.cellText}>56–69</Text>
        </View>
        <View style={[styles.cell, styles.mediumGI]}>
          <Text style={styles.cellText}>Macaroni & Cheese, Table Sugar, Brown Rice, Sweet Potato, Banana, Raisins, Grapefruit Juice (unsweetened)</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.lowGI]}>
          <Text style={styles.cellText}>Low GI</Text>
        </View>
        <View style={[styles.cell, styles.lowGI]}>
          <Text style={styles.cellText}>55 or less</Text>
        </View>
        <View style={[styles.cell, styles.lowGI]}>
          <Text style={styles.cellText}>Most Fruits and Vegetables, Beans, Whole Grains, Meat, Eggs, Milk, Nuts, Fructose and Products Low in Carbohydrates</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#fff",
  },
  cell: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cellText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: 'bold'
  },
  highGI: {
    backgroundColor: "#f44336",
  },
  mediumGI: {
    backgroundColor: "#ffeb3b",
  },
  lowGI: {
    backgroundColor: "#8bc34a",
  },
});

