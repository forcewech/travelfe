
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '@material-ui/core';
import { Popconfirm, Spin, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { loaitourData, removeloaitour, updateloaitour } from './loaitourSlice';
function Loaitour(props) {
    const match = useRouteMatch()

    const columns = [
        {
            title: 'Loại tour',
            dataIndex: 'name',
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
    const loaitours = useSelector(state => state.loaitours.loaitour.data);
    const loading = useSelector(state => state.loaitours.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(loaitourData()) }

    const history = useHistory()
    const hangdleDelete = e => {
        dispatch(removeloaitour(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const hangdleEdit = (id) => {
        history.replace(`${match.url}/sualoaitour/${id}`)
    }
    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updateloaitour({ status: 0, idsua: id }))
        } else {
            dispatch(updateloaitour({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }

    return (
        <div id="admin">
            <div className="heading">
                <h4>Loại tour</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themloaitour`}><Button variant="outlined" color="secondary"><i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới</Button></Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={loaitours.map((ok, index) => (
                        {
                            key: index + 1,
                            name: <span>{ok.name}</span>,
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

Loaitour.propTypes = {

}

export default Loaitour