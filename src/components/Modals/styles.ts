import { StyleSheet } from "react-native";
import dimensions from "../../style/dimensions";
import colors from "../../style/colors";

const { vh } = dimensions;

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalText: {
    marginBottom: 4,
    textAlign: "center",
    fontSize: 32,
    color: colors.p_dark,
    fontWeight: "bold",
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
  autocomplete: {
    height: 80,
    borderRadius: 5,
    borderColor: "#51BC7F00",
    borderWidth: 2,
    backgroundColor: "#0000",
  },
  options_autocomplete: {
    borderRadius: 5,
    borderWidth: 1.0,
    borderColor: "#51BC7F00",
    backgroundColor: "#0000",
    height: vh / 4,
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
});
