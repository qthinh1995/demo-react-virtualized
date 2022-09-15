import type { NextPage } from "next";
import { selectPageState, setPagesState } from "../store/pageSlice";
import { useDispatch, useSelector } from "react-redux";

const Home: NextPage = () => {
  const pagesState = useSelector(selectPageState("Asd"));
  const dispatch = useDispatch();
  console.log("pagesState: ", pagesState);
  return (
    <div>
      <button
        onClick={() =>
          dispatch(setPagesState({ data: { data: "ne" }, key: "Asd" }))
        }
      >
        Change page state
      </button>
    </div>
  );
};

export default Home;
