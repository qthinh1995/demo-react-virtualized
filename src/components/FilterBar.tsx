import { useState } from "react";
import router, { useRouter } from "next/router";
import Link from "next/link";

const FilterBar = ({ query = {} }: any) => {
  const { title = "", isPublic = "true" } = query;

  const [filterData, setFilterData] = useState({
    title,
    isPublic: isPublic === "true",
  });
  console.log("filterData: ", filterData);

  const onChangeField = (value, fieldName) => {
    setFilterData((filter) => ({ ...filter, [fieldName]: value }));
  };

  return (
    <div>
      Filter bar:
      <label>
        Post Title:{" "}
        <input
          value={filterData.title}
          onChange={(e) => {
            onChangeField(e.target.value, "title");
          }}
        />
      </label>
      <label>
        Is Public:{" "}
        <input
          type="checkbox"
          checked={filterData.isPublic}
          onChange={(e) => {
            onChangeField(e.target.checked, "isPublic");
          }}
        ></input>
      </label>
      <Link
        href={{
          pathname: "/",
          query: filterData,
        }}
      >
        <button>Submit</button>
      </Link>
    </div>
  );
};

export default FilterBar;
