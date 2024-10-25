import axios from "axios";
import { useEffect, useState } from "react";
import "./sample-admin-rewards-crud.css";

function SampleAdminRewardsCrud() {
  const url = "http://localhost:8080/api";

  const [rewardData, setRewardData] = useState({
    rewardName: "",
    rewardDescription: "",
    pointsRequired: "",
    stocks: "",
    category: "",
  });

  const [rewardsList, setRewardsList] = useState([]);

  const [rewardImage, setRewardImage] = useState(null);
  const [rewardImageString, setRewardImageString] = useState("");

  const [updateId, setUpdateId] = useState("");

  const fetchRewardsList = async () => {
    try {
      const response = await axios.get(`${url}/rewards`);
      console.log(response.data);
      if (response.data.success) {
        setRewardsList(response.data.rewards);
      } else {
        console.error("Error fetching list");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    fetchRewardsList();
  }, []);

  const onRemoveClick = async (id) => {
    try {
      const response = await axios.delete(`${url}/rewards/${id}`);
      if (response.data.success) {
        alert(response.data.message);
        fetchRewardsList();
      } else {
        console.error("Error deleting reward");
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const onEditClick = async (id) => {
    setUpdateId(id);
    try {
      const response = await axios.get(`${url}/rewards/${id}`);
      console.log(response.data);
      if (response.data.success) {
        let reward = response.data.reward;
        setRewardData({
          rewardName: reward.rewardName,
          rewardDescription: reward.rewardDescription,
          pointsRequired: reward.pointsRequired,
          stocks: reward.stocks,
          category: reward.category,
        });
        setRewardImageString(reward.image);
      } else {
        console.error("Error fetching list");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRewardImage(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRewardData({ ...rewardData, [name]: value });
  };

  const onAddRewardSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rewardName", rewardData.rewardName);
    formData.append("rewardDescription", rewardData.rewardDescription);
    formData.append("pointsRequired", rewardData.pointsRequired);
    formData.append("stocks", rewardData.stocks);
    formData.append("category", rewardData.category);
    formData.append("image", rewardImage);

    let response = null;

    if (!updateId) {
      response = await axios.post(`${url}/rewards`, formData);
    } else {
      // * new image is selected
      if (rewardImage !== null) {
        formData.append("imageChanged", "true");
        formData.append("prevImageString", rewardImageString);
      } else {
        // * image is not modified
        formData.append("imageChanged", "false");
      }
      response = await axios.post(`${url}/rewards/${updateId}`, formData);
    }

    if (response.data.success) {
      alert(response.data.message);
      await fetchRewardsList();
    } else {
      alert(response.data.message);
    }

    // * defaults
    setRewardData({
      rewardName: "",
      rewardDescription: "",
      pointsRequired: "",
      stocks: "",
      category: "",
    });
    setRewardImage(null);
    setRewardImageString("");
    document.getElementById("imageInput").value = null;
  };

  return (
    <>
      <div>
        <h1>REWARDSSSSSSSSSSSSSSSSSSSSSSSSS</h1>
        <form onSubmit={onAddRewardSubmit}>
          <label>
            Reward Name:
            <input
              required
              type="text"
              name="rewardName"
              value={rewardData.rewardName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Reward Desc:
            <input
              required
              type="text"
              name="rewardDescription"
              value={rewardData.rewardDescription}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Points Required:
            <input
              required
              type="number"
              name="pointsRequired"
              value={rewardData.pointsRequired}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Stocks:
            <input
              required
              type="number"
              name="stocks"
              value={rewardData.stocks}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Category:
            <input
              required
              type="text"
              name="category"
              value={rewardData.category}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Choose Image:
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageUpload}
            />
            {rewardImageString && (
              <img
                src={`${url}/images/${rewardImageString}`}
                alt="Current Reward"
                width={100}
                height={100}
              />
            )}
          </label>
          <br />
          <br />
          <button>SAVE REWARD</button>
        </form>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>reward Name</th>
              <th>reward Description</th>
              <th>points Required</th>
              <th>stocks</th>
              <th>category</th>
              <th>image</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {rewardsList.length > 0
              ? rewardsList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.rewardName}</td>
                      <td>{item.rewardDescription}</td>
                      <td>{item.pointsRequired}</td>
                      <td>{item.stocks}</td>
                      <td>{item.category}</td>
                      <td>
                        <img
                          width={100}
                          height={100}
                          src={url + "/images/" + item.image}
                          alt=""
                        />
                      </td>
                      <td>
                        <button onClick={() => onEditClick(item._id)}>
                          EDIT
                        </button>
                        <button onClick={() => onRemoveClick(item._id)}>
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                })
              : rewardsList.length <= 0 && (
                  <tr>
                    <td colSpan={7}>No available rewards...</td>
                    <td></td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SampleAdminRewardsCrud;
