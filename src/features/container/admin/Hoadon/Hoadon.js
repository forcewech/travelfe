import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button } from "@material-ui/core";
import { Popconfirm, Popover, Spin, Table, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hoadonData, removehoadon } from "./hoadonSlice";
import moment from "moment";
import { CSVLink } from "react-csv";

function Hoadon() {
  const columns = [
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: "Người dùng",
      dataIndex: "name",
    },
    {
      title: "Tour",
      dataIndex: "tour",
    },
    {
      title: "Số lượng",
      dataIndex: "soluong",
    },
    {
      title: "Tổng tiền",
      dataIndex: "tien",
    },

    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const hoadons = useSelector((state) => state.hoadons.hoadon.data);
  const soluong = (nguoilon, treem, embe) => {
    return nguoilon + treem + embe;
  };
  const loading = useSelector((state) => state.hoadons.loading);
  const dispatch = useDispatch();
  const actionResult = async () => {
    await dispatch(hoadonData());
  };

  const hangdleDelete = (e) => {
    dispatch(removehoadon(e));
    setTimeout(() => {
      actionResult();
    }, 500);
  };
  const tongtien = (nguoilon, treem, embe, gnl, gte, geb) => {
    return (nguoilon * gnl + treem * gte + embe * geb).toLocaleString();
  };
  const title = (nguoilon, treem, embe) => {
    return (
      <div>
        <span>Người lớn: {nguoilon}</span>
        <br />
        <span>Trẻ em: {treem}</span>
        <br />
        <span>Em bé: {embe}</span>
      </div>
    );
  };

  const data = hoadons.map((ok, index) => ({
    key: index + 1,
    name: <span>{ok.User.name}</span>,
    tour: <span>{ok.Tour.name}</span>,
    createdAt: <span>{moment(ok.createdAt).format("DD/MM/yyyy")}</span>,
    soluong: (
      <Tooltip title={title(ok.nguoilon, ok.treem, ok.embe)}>
        <span>{soluong(ok.nguoilon, ok.treem, ok.embe)}</span>
      </Tooltip>
    ),
    tien: (
      <span>
        {tongtien(
          ok.nguoilon,
          ok.treem,
          ok.embe,
          ok.Tour.gianguoilon,
          ok.Tour.giatreem,
          ok.Tour.giaembe
        )}{" "}
        vnđ
      </span>
    ),
    action: (
      <div className="action">
        <Popconfirm
          title="Bạn có muốn xoá？"
          onConfirm={() => {
            hangdleDelete(ok.id);
          }}
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <i className="far fa-trash-alt"></i>
        </Popconfirm>
      </div>
    ),
  }));
  console.log(hoadons);
  return (
    <div id="admin">
      <div className="heading">
        <h4>Hoá đơn</h4>
        <CSVLink
          filename="hoadon.csv"
          data={hoadons.map((ok, index) => ({
            key: index + 1,
            name: ok.User.name,
            tour: ok.Tour.name,
            createdAt: ok.createdAt,
            soluong: soluong(ok.nguoilon, ok.treem, ok.embe),
            tien: `${tongtien(
              ok.nguoilon,
              ok.treem,
              ok.embe,
              ok.Tour.gianguoilon,
              ok.Tour.giatreem,
              ok.Tour.giaembe
            )} vnđ`,
          }))}
        >
          Xuất dữ liệu
        </CSVLink>
        <div className="hr"></div>
      </div>
      <div className="content">
        {loading ? (
          <div className="spin">
            <Spin className="mt-5" />
          </div>
        ) : (
          <Table columns={columns} dataSource={data} />
        )}
      </div>
    </div>
  );
}

export default Hoadon;
