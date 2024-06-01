import React, { useEffect } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Popconfirm, Spin, Table } from 'antd'
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { diadiemData, removediadiem, updatediadiem } from './diadiemSlice';
import { QuestionCircleOutlined } from '@ant-design/icons';

function Diadiem() {
    const match = useRouteMatch()
    console.log({ match });
    const columns = [
        {
            title: 'tên địa điểm',
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
    const diadiems = useSelector(state => state.diadiems.diadiem.data);
    const loading = useSelector(state => state.diadiems.loading)
    const dispatch = useDispatch();
    const actionResult = async () => { await dispatch(diadiemData()) }
    useEffect(() => {
        //actionResult();
    }, [])
    const history = useHistory()
    const hangdleDelete = e => {
        dispatch(removediadiem(e));
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    const hangdleEdit = (id) => {
        history.push(`${match.url}/suadiadiem/${id}`)
    }
    const handleStatus = (e, id) => {
        if (e === 1) {
            dispatch(updatediadiem({ status: 0, idsua: id }))
        } else {
            dispatch(updatediadiem({ status: 1, idsua: id }))
        }
        setTimeout(() => {
            actionResult();
        }, 500);
    }
    return (
        <div id="admin">
            <div className="heading">
                <h4>Địa điểm</h4>
                <div className="hr"></div>
            </div>
            <div className="content">
                <div className="add">
                    <Link to={`${match.url}/themdiadiem`}><Button variant="outlined" color="secondary"><i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới</Button></Link>
                </div>
                {loading ? <div className="spin"><Spin className="mt-5" /></div> :
                    <Table columns={columns} dataSource={diadiems.map((ok, index) => (
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
                        }))} />
                }
            </div>
        </div>

    )
}

Diadiem.propTypes = {

}

export default Diadiem