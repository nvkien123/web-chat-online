import "./infoUser.css";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase";
import { useState } from "react";
const InfoUser = ({ oppositeUser, user, setUser, setConversations }) => {
  //console.log("member ",currentChat.members)
  //console.log("oppositeUser ", oppositeUser)
  const [statusAvatar, setStatusAvatar] = useState(false);
  const [file, setFile] = useState();
  const [stateFile, setStateFile] = useState("Submit");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.setItem("token", "");
    setUser("");
    navigate("/login");
  };

  const handleCancelConnect = async () => {
    // await deleteConversations(oppositeUser._id, user._id);
    // setConversations(await getConversations(user._id));
    // window.location.reload();
  };

  const changeHandler = (event) => {
    setFile(event.target.files[0]);
    console.log("file ", event.target.files[0]);
  };
  const handleSubmission = () => {
    if (!file) return;
    const sotrageRef = ref(storage, `avatar/${file.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, file);

    setStateFile("updating");
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => console.log("err ", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // await updateAvatarUser(user._id, downloadURL);
          user.profilePicture = downloadURL;
          localStorage.setItem("user", JSON.stringify(user));
          setFile(null);
          setStateFile("Submit");
        });
      }
    );
  };

  return (
    <>
      {oppositeUser.id ? (
        <div className="opposite">
          <div className="oppositeAvatar">
            <img
              src={
                oppositeUser.avatar
                  ? oppositeUser.avatar
                  : "http://hethongxephangtudong.net/public/client/images/no-avatar.png"
              }
              alt=""
            />
          </div>
          <p>{oppositeUser.id}</p>
          <p>{oppositeUser.firstName + " " + oppositeUser.lastName}</p>
          <div className="btn-user">
            <button onClick={handleCancelConnect}> Huỷ kết nối </button>
            <button> Chặn kết nối </button>
          </div>
        </div>
      ) : (
        <div className="opposite">
          <div className="oppositeAvatar">
            <img
              src={
                user.avatar
                  ? user.avatar
                  : "http://hethongxephangtudong.net/public/client/images/no-avatar.png"
              }
              alt=""
            />
          </div>
          <p> {user.id} </p>
          <p> {user.firstName + " " + user.lastName} </p>
          <p> {user.email} </p>
          <div className="btn-user">
            <button onClick={handleLogout}> Đăng xuất </button>
            <button
              onClick={() => {
                setStatusAvatar((statusAvatar) => !statusAvatar);
              }}
            >
              {" "}
              Set Avatar{" "}
            </button>
          </div>
          {statusAvatar && (
            <div className="set-avatar">
              <div className="choose-avatar">
                <input type="file" name="file" onChange={changeHandler} />
              </div>

              <div className="submit-button">
                <button onClick={handleSubmission}>{stateFile}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default memo(InfoUser);
