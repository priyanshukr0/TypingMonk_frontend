import axios from "axios";
// testMode,testName,punctuation,number
async function textData(testMode, testName, punctuation, number) {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const url = `${backend_url}/api/data/text`;
    const bodyData = {
        "testMode": `${testMode}`,
        "testName": `${testName}`,
        "punctuation": punctuation,
        "number": number
    }
    const res = await axios.post(url, bodyData)
    return res;
}
export default textData; 