import { Bounce, toast } from "react-toastify";
export const notify = (text, state) => {
  if (state === "success") {
    toast.success(text, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // theme: "light",
      transition: Bounce,
    });
  } else if (state === "failure") {
    toast.error(text, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // theme: "light",
      transition: Bounce,
    });
  } else if (state === "info") {
    toast.info(text, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // theme: "light",
      transition: Bounce,
    });
  }
};
