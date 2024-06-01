import { Button } from "@material-ui/core";
import { Modal, Progress } from "antd";
import { default as React, useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../taikhoan/taikhoanSlice";
import { chitieuData } from "./chitieuSlice";
import "./doanhthu.css";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import doanhthuAPI from "../../../../api/doanhthuApi";
import moment from "moment";
import { Bar } from "react-chartjs-2";

const plugin = {
  id: "emptyDoughnut",
  afterDraw(chart, args, options) {
    const { datasets } = chart.data;
    const { color, width, radiusDecrease } = options;
    let hasData = false;

    for (let i = 0; i < datasets.length; i += 1) {
      const dataset = datasets[i];
      hasData |= dataset.data.length > 0;
    }

    if (!hasData) {
      const {
        chartArea: { left, top, right, bottom },
        ctx,
      } = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      const r = Math.min(right - left, bottom - top) / 2;

      ctx.beginPath();
      ctx.lineWidth = width || 2;
      ctx.strokeStyle = color || "rgba(255, 128, 0, 0.5)";
      ctx.arc(centerX, centerY, r - radiusDecrease || 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  },
};

const DATE_FORMAT = "MM-DD-yyyy";
export default function Doanhthu() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [state, setState] = useState({
    chitieuthang: "",
    chitieungay: "",
    chitieunam: "",
  });
  // const [usd, setusd] = useState(1);
  const [usd, setusd] = useState(23060);
  const [date, setDate] = useState([
    new Date(moment().subtract(7, "days")),
    new Date(),
  ]);
  const [dataChart, setDataChart] = useState(null);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const chiphi = useSelector((state) => state.chiphis.chiphi.data);
  const dispatch = useDispatch();
  const actionResult = async () => {
    await dispatch(userData());
  };

  let TongChiPhi = 0;

  if (chiphi) {
    for (let i = 0; i < chiphi.length; i++) {
      TongChiPhi += chiphi[i].money;
    }
  }
  const actionChitiet = async () => await dispatch(chitieuData());
  const chitieu = useSelector((state) => state.chitieu.chitieu.data);
  useEffect(() => {
    // Axios.get("https://free.currconv.com/api/v7/convert?q=USD_VND&compact=ultra&apiKey=6c24709f2cfc058a0499").then(data => {
    //     setusd(data.data.USD_VND)
    // })
    actionResult();
    if (chitieu) {
      setState({
        ...state,
        chitieungay: chitieu[0].chitieungay,
        chitieuthang: chitieu[0].chitieuthang,
        chitieunam: chitieu[0].chitieunam,
      });
    } else {
      actionChitiet();
    }
  }, [chitieu]);

  useEffect(() => {
    if (date) {
      doanhthuAPI
        .getByDateRange({
          startDate: moment(date[0]).format(DATE_FORMAT),
          endDate: moment(date[1]).format(DATE_FORMAT),
        })
        .then((data) => {
          setDataChart(data.data);
        });
    } else {
      setDataChart([]);
    }
  }, [date]);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const SoNguoiDung = useSelector((state) => state.taikhoan.user.data);
  const HoaDon = useSelector((state) => state.hoadons.hoadon.data);
  let HoaDonDate = [];
  if (HoaDon) {
    for (let i = 0; i < HoaDon.length; i++) {
      let date = new Date(HoaDon[i].createdAt);
      HoaDonDate.push({
        id: HoaDon[i].id,
        tongtien: HoaDon[i].thanhtien,
        date:
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
          "-" +
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) +
          "-" +
          date.getFullYear(),
      });
    }
  }
  let ThuNhapHomNay = 0;
  if (HoaDonDate) {
    let date = new Date();
    let dateToday =
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      date.getFullYear();
    for (let i = 0; i < HoaDonDate.length; i++) {
      if (HoaDonDate[i].date == dateToday) {
        ThuNhapHomNay += HoaDonDate[i].tongtien;
      }
    }
  }
  let ThuNhapThang = 0;
  if (HoaDonDate) {
    let date = new Date();
    let dateMonth =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      date.getFullYear();
    for (let i = 0; i < HoaDonDate.length; i++) {
      if (HoaDonDate[i].date.substr(3) == dateMonth) {
        ThuNhapThang += HoaDonDate[i].tongtien;
      }
    }
  }
  let ThuNhapNam = 0;
  if (HoaDonDate) {
    let date = new Date();
    let dateYear = date.getFullYear();
    for (let i = 0; i < HoaDonDate.length; i++) {
      if (HoaDonDate[i].date.substr(6) == dateYear) {
        ThuNhapNam += HoaDonDate[i].tongtien;
      }
    }
  }
  let TongThuNhap = 0;
  if (HoaDon) {
    for (let i = 0; i < HoaDon.length; i++) {
      TongThuNhap += HoaDon[i].thanhtien;
    }
  }
  console.log(usd);
  const LoiNhuan = (a, b) => {
    return (b - a).toLocaleString();
  };
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  let thunhap = Number((TongThuNhap / usd).toFixed(0));
  let chiphitong = Number((TongChiPhi / usd).toFixed(0));
  const { chitieunam, chitieuthang, chitieungay } = state;

  const labelChart = dataChart ? dataChart.map((item) => item?.Tour?.name) : [];
  const valueChart = dataChart ? dataChart.map((item) => item?.soLuongDat) : [];
  console.log("🚀 ~ Doanhthu ~ valueChart:", valueChart);

  return (
    <div id="doanhthu">
      <h4>Doanh thu công ty</h4>
      <div className="row">
        <div className="col-md">
          <div className="float-left mr-2">
            <div className="icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="monney">
            <span>
              <strong>$ {TongThuNhap ? thunhap.toLocaleString() : 0}</strong>
            </span>
            <br />
            <span>Tổng thu nhập</span>
          </div>
        </div>

        <div className="col-md">
          <div className="float-right mr-2">
            <div className="icon">
              <i className="fas fa-money-bill-alt"></i>
            </div>
          </div>
          <div className="monney float-right">
            <span>
              <strong>
                ${" "}
                {LoiNhuan(
                  (TongChiPhi / usd).toFixed(0),
                  (TongThuNhap / usd).toFixed(0)
                )}
              </strong>
            </span>
            <br />
            <span>Lợi nhuận</span>
          </div>
        </div>
        <div className="col-md">
          <div className="float-left mr-2">
            <div className="icon">
              <i className="fas fa-chart-pie"></i>
            </div>
          </div>
          <div className="monney">
            <span>
              <strong>$ {chiphitong.toLocaleString()}</strong>
            </span>
            <br />
            <span>Tổng chi</span>
          </div>
        </div>
        <div className="col-md">
          <div className="float-left mr-2">
            <div className="icon">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="monney">
            <span>
              <strong>{SoNguoiDung ? SoNguoiDung.length : 0}</strong>
            </span>
            <br />
            <span>Tổng người dùng</span>
          </div>
        </div>
      </div>
      <h4 className="mt-4 mb-2">Chỉ tiêu</h4>
      <div className="container text-center">
        <div className="row pt-3 pb-2">
          <div className="col-md-4">
            <Progress
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              type="dashboard"
              percent={100}
            />

            <div>
              <h5>Chỉ tiêu ngày</h5>
              <div className="hr"></div>
              <div className="mt-2">
                <span>
                  Tổng thu:{" "}
                  <span className="gold">
                    {ThuNhapHomNay.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Chỉ tiêu:{" "}
                  <span className="gold">
                    {chitieungay.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Vượt chỉ tiêu:{" "}
                  <span className="gold">
                    {(ThuNhapHomNay - chitieungay).toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <Progress
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              type="dashboard"
              percent={100}
            />

            <div>
              <h5>Chỉ tiêu tháng</h5>
              <div className="hr"></div>
              <div className="mt-2">
                <span>
                  Tổng thu:{" "}
                  <span className="gold">
                    {ThuNhapThang.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Chỉ tiêu:{" "}
                  <span className="gold">
                    {chitieuthang.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Vượt chỉ tiêu:{" "}
                  <span className="gold">
                    {(ThuNhapThang - chitieuthang).toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Progress
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              type="dashboard"
              percent={100}
            />

            <div>
              <h5>Chỉ tiêu năm</h5>
              <div className="hr"></div>
              <div className="mt-2">
                <span>
                  Tổng thu:{" "}
                  <span className="gold">
                    {ThuNhapNam.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Chỉ tiêu:{" "}
                  <span className="gold">
                    {chitieunam.toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
                <br />
                <span>
                  Vượt chỉ tiêu:{" "}
                  <span className="gold">
                    {(ThuNhapNam - chitieunam).toLocaleString()}{" "}
                    <span className="text-danger bold">vnđ</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex">
            <label style={{ fontSize: "18px", marginRight: "8px" }}>
              Chọn khoảng ngày:{" "}
            </label>
            <DateRangePicker value={date} onChange={setDate} />
          </div>
          <div className="mt-3">
            {labelChart?.length > 0 ? (
              <Doughnut
                data={{
                  labels: labelChart,
                  datasets: [
                    {
                      label: "Population (millions)",
                      backgroundColor: [
                        "#3e95cd",
                        "#8e5ea2",
                        "#3cba9f",
                        "#e8c3b9",
                        "#c45850",
                      ],
                      data: valueChart,
                    },
                  ],
                }}
                option={{
                  title: {
                    display: true,
                    text: "Predicted world population (millions) in 2050",
                  },
                  plugins: {
                    emptyDoughnut: {
                      color: "rgba(255, 128, 0, 0.5)",
                      width: 2,
                      radiusDecrease: 20,
                    },
                  },
                  plugins: [plugin],
                }}
              />
            ) : (
              <div style={{ fontSize: "18px" }}> Không có dữ liệu </div>
            )}
          </div>
        </div>
      </div>
      <Button
        className="float-right mt-4"
        onClick={showModal}
        variant="contained"
        color="primary"
      >
        Đặt chỉ tiêu
      </Button>
      <Modal
        title="Đặt chỉ tiêu"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div class="form-group">
          <label for="">Chỉ tiêu ngày</label>
          <input
            type="number"
            name="chitieungay"
            value={chitieungay}
            onChange={onChange}
            id=""
            class="form-control"
            placeholder=""
            aria-describedby="helpId"
          />
        </div>

        <div class="form-group">
          <label for="">Chỉ tiêu tháng</label>
          <input
            type="number"
            name="chitieuthang"
            value={chitieuthang}
            onChange={onChange}
            id=""
            class="form-control"
            placeholder=""
            aria-describedby="helpId"
          />
        </div>
        <div class="form-group">
          <label for="">Chỉ tiêu năm</label>
          <input
            type="number"
            name="chitieunam"
            value={chitieunam}
            onChange={onChange}
            id=""
            class="form-control"
            placeholder=""
            aria-describedby="helpId"
          />
        </div>
      </Modal>
    </div>
  );
}
