import React from 'react';
import { NavLink } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import account from './login.json'
import './Login.scss';
const sha256 = require('js-sha256');
class SignUp1 extends React.Component {
    constructor() {
        super()
        this.state = {
            isLogin: false,
            isWrongUsername: false,
        }
        this.username = React.createRef()
        this.password = React.createRef()
    }
    componentDidMount = () => {
        if (localStorage.getItem("username") && localStorage.getItem("password") && localStorage.getItem("username") == account.username && localStorage.getItem("password") == account.password) {
            this.props.history.push("/lottery")
        }
    }
    handleLogOut = () => {
        localStorage.removeItem("isLogin")
        this.setState({ isLogin: false })
    }

    handleLogIn = () => {
        if (this.username.current.value == account.username && sha256(this.password.current.value) == account.password) {
            this.setState({ isWrongUsername: false })
            localStorage.setItem("username", this.username.current.value)
            localStorage.setItem("password", account.password)
            this.props.history.push("/lottery")

        }
        else {
            this.setState({ isWrongUsername: true })
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div className="auth-wrapper">
                        <div className="auth-content">
                            <div className="auth-bg">
                                <span className="r" />
                                <span className="r s" />
                                <span className="r s" />
                                <span className="r" />
                            </div>
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="mb-4">
                                        <i className="feather icon-unlock auth-icon" />
                                    </div>
                                    <h3 className="mb-4">LOTTERY</h3>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="UserName" ref={this.username} />
                                    </div>
                                    <div className="input-group mb-4">
                                        <input type="password" className="form-control" placeholder="Password" ref={this.password} />
                                    </div>
                                    {this.state.isWrongUsername ?
                                        <Alert className="mb-4" severity="error">Sai tên tài khoản hoặc mật khẩu</Alert>
                                        : null}
                                    <button className="btn btn-primary shadow-2 mb-4" onClick={() => this.handleLogIn()}>LOGIN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp1;