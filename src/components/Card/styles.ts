import { StyleSheet } from "react-native";
import colors from "../../style/colors";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    marginTop: 12,
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 18,
    paddingRight: 18,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  addNewObservation: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButton: {
    marginLeft: 10,
  },
  observationsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  observations: {
    fontSize: 23,
    color: colors.p_dark,
    marginBottom: 10,
  },
  observationsOptionsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  observationsOptions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  observationsTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  observationsText: {
    flex: 1,
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
    color: colors.green,
  },
  observationsDelete: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginTop: 20,
    borderRadius: 25,
    fontSize: 16,
    color: "#FFF",
    paddingHorizontal: 20,
    textAlign: "center",
    backgroundColor: colors.p_,
    marginBottom: 10,
  },
  buttonPlusInput: {
    flexDirection: "column",
  },
});
