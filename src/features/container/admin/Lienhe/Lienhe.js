import React, { useEffect } from 'react'
import { Popconfirm, Spin, Table } from 'antd'
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { lienheData, removelienhe, updatelienhe } from './lienheSlice';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { diadiemData } from '../DiaDiem/diadiemSlice';
function Lienhe() {
    const match = useRouteMatch()

    const columns = [
        {
            title: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
        },
        {
            title: 'địa chỉ',
            dataIndex: 'diachi',
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
    const lienhe = useSelector(state => state.lienhes.lienhe.data);
    const loading = useSelector(state => state.lienhes.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(lienheData()) }

    const history = useHistory()
    const hangdleDelete = e => {
        dispatch(removelienhe(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const hangdleEdit = (id) => {
        history.replace(`${match.url}/sualienhe/${id}`)
    }
    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updatelienhe({ status: 0, idsua: id }))
        } else {
            dispatch(updatelienhe({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    return (
        <div id="admin">
            <div className="heading">
                <h4>Liên hệ</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themlienhe`}><Button variant="outlined" color="secondary"><i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới</Button></Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={lienhe.map((ok, index) => (
                        {
                            key: index + 1,
                            sdt: <span>{ok.sdt}</span>,
                            name: <span>{ok.name}</span>,
                            email: <span>{ok.email}</span>,
                            diachi: <span>{ok.diachi}</span>,
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
                        }))} />
                }
            </div>
        </div>
    )
}

Lienhe.propTypes = {

}

export default Lienhe