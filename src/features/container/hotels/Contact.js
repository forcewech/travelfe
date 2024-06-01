import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import Footer from '../trangchu/footer/Footer'
import img9 from "./img/9.jpg"
import "./contact.css"
import Axios from 'axios'
import { message } from 'antd'
export default function Contact() {
    const [hoten, setHoTen] = useState("");
    const [email, setEmail] = useState("");
    const [diachi, setDiaChi] = useState("");
    const [yeucau, setYeuCau] = useState("");
    const history = useHistory();
    function handle(){
        Axios.post("http://localhost:666/sendemail/email/hotel", {
                    hoten,
                    email,
                    diachi,
                    yeucau
                })
        message.success("Liên hệ thành công!");
        history.push(`/`);
    }
    return (
        <div id="contact">
            <div className="breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/"><i className="fas fa-home mr-2"></i>Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/hotels">Khách sạn</Link></li>
                        <li className="breadcrumb-item">Liên hệ khách sạn</li>
                    </ol>
                </nav>
            </div>
            <div className="content container">
                <div className="content___box">
                    <div className="content___box___left">
                        <div className="content___box___left___title">
                            <div className="contact_name">
                                Vinpearl Resort & Spa Đà Nẵng
                        </div>
                            <h3>Liên hệ đặt phòng</h3>
                            <div className="contact_mail">
                                <i className="fas fa-envelope"></i>
                                {/* <i className="material-icons">email</i> */}
                            khachsan@dulichviet.com.vn
                        </div>
                            <div className="contact_number">
                                <div className="contact_number-icon">
                                    <i className="fas fa-mobile-alt"></i>
                                </div>
                                <div className="contact_number-a">
                                    <p>0909.502.588</p>
                                    <p>0944.242.705</p>
                                </div>
                            </div>
                            <div className="contact_img">
                                <img src={img9} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="content___box___right">
                        <form action="" method="post">
                            <p>Dấu <span className="color-red">*</span> là thông tin bắt buộc</p>
                            <div className="form-group">
                                <label for="">Họ tên <span className="color-red">*</span></label>
                                <input type="text" className="form-control" value={hoten} onChange={(event) => setHoTen(event.target.value)} id="name" aria-describedby="helpId"/>
                            </div>
                            <div className="form-group">
                                <label for="">Email <span className="color-red">*</span></label>
                                <input type="text" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} id="email" aria-describedby="helpId"
                                     />
                            </div>
                            <div className="form-group">
                                <label for="">Địa chỉ <span className="color-red">*</span></label>
                                <input type="text" className="form-control" value={diachi} onChange={(event) => setDiaChi(event.target.value)} id="diachi" aria-describedby="helpId"
                                     />
                            </div>
                            <div className="form-group">
                                <label for="">Yêu cầu <span className="color-red">*</span></label>
                                <textarea  className="form-control" value={yeucau} onChange={(event) => setYeuCau(event.target.value)} id="yeucau" cols="30" rows="3"></textarea>
                            </div>
                            <div className="btn-dt">
                                <Button className=" pl-5 pr-5" variant="contained" color="secondary" onClick={handle}>
                                    Liên hệ ngay
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
