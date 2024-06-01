import { message } from "antd";
import axiosClient from "./axiosClient";

class DoanhthuAPI {
  getByDateRange = (params) => {
    const url = `/hoadons/thongke/tour`;
    return axiosClient.get(url, { params });
  };
}
const doanhthuAPI = new DoanhthuAPI();
export default doanhthuAPI;
