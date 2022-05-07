import React, { useState, useEffect } from "react";
import APIAddress from "../../APIAddress";
import { useParams } from "react-router-dom";
import CountUp from "react-countup";
import {toast} from "react-toastify";
import SyncLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/react";
import Select from "react-dropdown-select";

import axios from "../../services/api-interceptor"

const options = [];

const override = css`
  margin: 0 auto;
  border-color: red;
`;

const AddModerators = (props) => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [usersData, setUsersData] = useState();
    const [emails, setEmails] = useState([]);
    const [ids, setIds] = useState([]);
    const [userID, setUserID] = useState("");
    const [userEmail, setUserEmail] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(APIAddress.value + "/api/User")
            .then(function (response) {
              console.log(response.data);
              setUsersData(response.data);
              for (let i = 0; i < response.data.length; i++) {
                options.push({
                  value: response.data[i].id,
                  label: response.data[i].email,
                });
              }
              console.log(options);
            });
        } catch (err) {
          toast.error(err.response.data.message);
        }
        setLoading(false);
      };
      fetchData();
    }, []);
  
    const handleChange = (e) => {
      console.log(e[0].value);
      setUserID(e[0].value);
      setUserEmail(e[0].label);
    };
    const handleAddToList = () => {
      if (emails.includes(userEmail)) {
        toast.error("Email znajudje się już na liście!");
      } else {
        setEmails([...emails, userEmail]);
        setIds([...ids, userID]);
      }
    };
    const sendInvites = async () =>{
      setLoading(true);
      try {
          let respone = await axios.put(APIAddress.value + "/api/Poll/SetModerators/" + id,{userIds: ids})
          .then(function (response) {
              toast.success("Podane osoby zostały dodane jako moderatorzy!!")
          }).catch(error =>{
            toast.error("Nie możesz zapraszać do tej ankiety");
          });
      } catch (err) {
        toast.error(err.response.data);
      }
      setLoading(false);
    }
  
    let invitedPeopleToRender = [];
    for (let i = 0; i < emails.length + 1; i++) {
      invitedPeopleToRender.push(<div>{emails[i]}</div>);
    }
  
    return (
      <div className="inviteArea">
        Lista do zaproszenia: {invitedPeopleToRender}
        <Select
          placeholder="Użytkownicy"
          className="choose"
          options={options}
          onChange={(e) => handleChange(e)}
          color="#000080"
        />
        <button onClick={() => handleAddToList()}>Dodaj do listy</button>
        {emails.length > 0 ? <button onClick={async () =>sendInvites()}>Zaproś podane osoby</button> : <></>}
        <SyncLoader
          loading={loading}
          color={"#ffffff"}
          css={override}
          size={15}
        />
      </div>
    );
  };
  
  export default AddModerators;