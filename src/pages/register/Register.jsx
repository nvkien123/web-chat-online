import { useRef, useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/apiUser";
import TextField from "@mui/material/TextField";
import { uploadFile } from "../../ultis/uploadFile";
import OpenNotifi from "../../hooks/openNotifi";
import OpenLoading from "../../hooks/openLoading";

export default function Register() {
  const MAX_SIZE = useRef(1048576000);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [describe, setDescribe] = useState("");
  const [avatar, setAvatar] = useState();
  const [notifi, setNotifi] = useState([null]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.length < 6 || password.length > 12) {
      setNotifi(["Mật khẩu từ 6 - 12 ký tự"]);
      return;
    }
    if (passwordAgain !== password) {
      setNotifi(["Nhập lại mật khẩu không đúng"]);
      return;
    }
    if (avatar.size > MAX_SIZE.current) {
      setNotifi(["Ảnh phải nhỏ hơn 1 mb"]);
      return;
    }
    setLoading(true);
    const url = await uploadFile(avatar);
    console.log(url);
    const newUser = {
      id: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      avatar: url,
    };
    const res = await registerUser(newUser);
    if (res.statusCode === "200") {
      setNotifi([
        "Đăng ký thành công, kiểm tra email để hoàn tất quá trình",
        "success",
      ]);
      // navigate("/login");
      setLoading(false);
      return;
    }
    setNotifi([res.message]);
    setLoading(false);
  };

  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Nhắn tin online</h3>
            <span className="loginDesc">
              Đăng nhập vào ứng để kết nối đến mọi người.
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Tên đăng nhập"
                  required
                  variant="outlined"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  sx={{ marginRight: "30px", width: "270px" }}
                />
                <TextField
                  id="outlined-basic-1"
                  label="Email"
                  required
                  variant="outlined"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  sx={{ width: "270px" }}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic-2"
                  label="Họ"
                  required
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  sx={{ marginRight: "30px", width: "270px" }}
                />
                <TextField
                  id="outlined-basic-3"
                  label="tên"
                  required
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  sx={{ width: "270px" }}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic-4"
                  label="Mật khẩu"
                  required
                  variant="outlined"
                  type="password"
                  minLength="6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  sx={{ marginRight: "30px", width: "270px" }}
                />
                <TextField
                  id="outlined-basic-5"
                  label="Nhập lại mật khẩu"
                  required
                  variant="outlined"
                  type="password"
                  minLength="6"
                  value={passwordAgain}
                  onChange={(e) => {
                    setPasswordAgain(e.target.value);
                  }}
                  sx={{ width: "270px" }}
                />
              </div>
              <TextField
                id="outlined-basic-6"
                label="Mô tả"
                variant="outlined"
                value={describe}
                onChange={(e) => {
                  setDescribe(e.target.value);
                }}
              />
              <TextField
                id="outlined-basic-7"
                label="Ảnh đại diện"
                variant="outlined"
                type="file"
                required
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                }}
                sx={{ paddingLeft: "150px", width: "300px" }}
              />
              {loading === false ? (
                <button className="loginButton" type="submit">
                  Đăng ký
                </button>
              ) : (
                <div className="loginButton">
                  <OpenLoading />
                </div>
              )}
              <button
                className="loginRegisterButton"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <p style={{ color: "white", textDecoration: "none" }}>
                  Đăng nhập
                </p>
              </button>
            </form>
          </div>
        </div>
      </div>
      {notifi[0] && <OpenNotifi notifi={notifi} setNotifi={setNotifi} />}
    </>
  );
}
