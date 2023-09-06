import axios from "axios";
import Routes from "./Route";

const api = () => {
  return {
    signin: async (phoneNumber, password) => {
      console.log("called");
      return await axios.post(Routes.signin, {
        credentials: {
          phoneNumber,
          password,
        },
      });
    },
    signup: async (phoneNumber, password, profilePic, about, userName) => {
      return await axios.post(Routes.signup, {
        credentials: {
          phoneNumber,
          password,
          profilePic,
          about,
          userName,
        },
      });
    },
    getALlUsers: () => {
      return axios.get(Routes.allUsers);
    },
    sendMessage: (inputMessage, userId, chatMateId) => {
      return axios.post(Routes.sendMessage, {
        content: inputMessage,
        senderId: userId,
        receiverId: chatMateId,
        isDelivered: false,
        isSeen: false,
      });
    },
    blockUser: async (userId,chatMateId) => {
      return await axios.put(`/users/block/${userId}/${chatMateId}`);
    },
    unBlockUser: async (userId,chatMateId) => {
      return await axios.put(`/users/unblock/${userId}/${chatMateId}`);
    },
    updateUser:async(updatedUser)=>{
        return await axios.put("/users/updateUserData", { updatedUser });
    },
    deleteChats:async(userId,chatMateId)=>{
        await axios.delete(`/messages/deleteChats/${userId}/${chatMateId}`);
    }
  };
};

export default api;
