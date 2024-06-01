
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '@material-ui/core';
import { Image, message, Popconfirm, Spin, Table } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import './tintuc.css'
import { removetintuc, tintucData, updatetintuc } from "./tintucSlice"
function Tintuc() {
    const match = useRouteMatch()

    const dispatch = useDispatch()
    const tintucs = useSelector(state => state.tintucs.tintuc.data);
    const loading = useSelector(state => state.tintucs.Loading);

    var sort = []
    if (tintucs) {
        for (let i = 0; i < tintucs.length; i++) {
            sort.unshift(tintucs[i])
        }
    }
    const actionResult = async () => await dispatch(tintucData());
    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'name',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
        },
        {
            title: 'Ảnh',
            dataIndex: 'anh',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action'
        }
    ];
    const history = useHistory()
    const hangdleDelete = e => {
        if (users.role === "biên tập viên") {
            message.warning("Bạn không có đủ quyền để thực thi!")
        } else {
            dispatch(removetintuc(e));
            setTimeout(() => {
                actionResult();
            }, 500);
        }
    }
    const users = useSelector(state => state.infor.infor.data);
    const hangdleEdit = (id) => {
        if (users.role === "biên tập viên") {
            message.warning("Bạn không có đủ quyền để thực thi!")
        } else {
            history.replace(`${match.url}/suatintuc/${id}`)
        }
    }
    const handleStatus = (e, id) => {
        if (users.role === "biên tập viên") {
            message.warning("Bạn không có đủ quyền để thực thi!")
        } else {
            if (e === 1) {
                dispatch(updatetintuc({ status: 0, idsua: id }))
            } else {
                dispatch(updatetintuc({ status: 1, idsua: id }))
            }
            setTimeout(() => {
                actionResult();
            }, 500);
        }
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>Quản lý tin tức</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themtintuc`}><Button variant="outlined" color="secondary"><i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới</Button></Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> : <Table columns={columns} dataSource={sort.map((ok, index) => (
                    {
                        key: index + 1,
                        name: <Link to={`${match.url}/chitiettintuc/${ok.id}`}>{ok.name}</Link>,
                        author: <span>{ok.tacgia}</span>,
                        anh: <Image src={ok.anh} width="200px" height="150px" alt="" />,
                        status: <div className="action">{ok.status === 1 ? <Link onClick={() => { handleStatus(ok.status, ok.id) }}><i className="far fa-thumbs-up "></i></Link> : <Link onClick={() => handleStatus(ok.status, ok.id)}><i className="far fa-thumbs-down "></i></Link>}</div>,
                        action:
                            <div className="action">
                                <Popconfirm title="Bạn có muốn sửa？" onConfirm={() => { hangdleEdit(ok.id) }} icon={<QuestionCircleOutlined style={{ color: 'green' }} />}>
                                    <i className="far fa-edit mr-4"></i>
                                </Popconfirm>
                                <Popconfirm title="Bạn có muốn xoá？" onConfirm={() => { hangdleDelete(ok.id) }} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                                    <i className="far fa-trash-alt" ></i>
                                </Popconfirm>
                            </div>
                    }))}
                />}
            </div>
        </div>
    )
}

Tintuc.propTypes = {

}

export default Tintuc
