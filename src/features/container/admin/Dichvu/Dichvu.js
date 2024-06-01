
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '@material-ui/core';
import { Popconfirm, Spin, Table } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { dichvuData, removedichvu, updatedichvu } from './dichvuSlice';
function Dichvu() {
    const match = useRouteMatch();
    const columns = [
        {
            title: 'Loại tour',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'mota',
        },
        {
            title: 'icon',
            dataIndex: 'icon',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
        },
        {
            title: 'hiện trang chủ',
            dataIndex: 'loadhome',
        },
        {
            title: 'Action',
            dataIndex: 'action'
        }
    ];
    const dichvus = useSelector(state => state.dichvus.dichvu.data);
    const loading = useSelector(state => state.dichvus.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(dichvuData()) }

    const history = useHistory()
    const hangdleDelete = e => {
        dispatch(removedichvu(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const hangdleEdit = (id) => {
        history.replace(`${match.url}/suadichvu/${id}`)
    }
    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updatedichvu({ status: 0, idsua: id }))
        } else {
            dispatch(updatedichvu({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const handleLoadhome = (e, id) => {
        if (e === 1) {
            dispatch(updatedichvu({ loadhome: 0, idsua: id }))
        } else {
            dispatch(updatedichvu({ loadhome: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>Dịch vụ</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themdichvu`}><Button variant="outlined" color="secondary"><i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới</Button></Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={dichvus.map((ok, index) => (
                        {
                            key: index + 1,
                            name: <span>{ok.name}</span>,
                            mota: <span>{ok.mota}</span>,
                            icon: <span className={`${ok.icon} text-success`} style={{ fontSize: "1.5rem" }}></span>,
                            loadhome: <div className="action">{ok.loadhome === 1 ? <span onClick={() => { handleLoadhome(ok.loadhome, ok.id) }}><i className="fas fa-check text-success "></i></span> : <span onClick={() => handleLoadhome(ok.loadhome, ok.id)}><i className="fas fa-times text-danger"></i></span>}</div>,
                            status: <div className="action">{ok.status === 1 ? <span onClick={() => { handleStatus(ok.status, ok.id) }}><i className="far fa-thumbs-up text-primary"></i></span> : <span onClick={() => handleStatus(ok.status, ok.id)}><i className="far fa-thumbs-down "></i></span>}</div>,
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
                    />
                }
            </div>
        </div>
    )
}

Dichvu.propTypes = {

}

export default Dichvu