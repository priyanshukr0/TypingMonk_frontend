import { useDispatch } from "react-redux";
import textData from "../utils/textApi";
import { updateTextData } from "../redux/slices/gameSlice";

export const textDataUpdater = async (selectedOption, testName, isPunc, isNum) => {
    const dispatch = useDispatch();
    const ans = await textData(selectedOption, testName, isPunc, isNum);
    const data = ans.data.textData.split(" ");
    // setText(ans.data.textData)
    dispatch(updateTextData(data));

}

