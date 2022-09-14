import { useState } from "react";
import router, { useRouter } from "next/router";
import Link from "next/link";

import style from "./FilterBar.module.css";

let lastFilter;

export const formatQUery = (query = {}) => {
  const { title = "", isPublic = "true" } = query;

  const output = {
    title,
    isPublic: isPublic === "true",
  };

  if (JSON.stringify(output) === JSON.stringify(lastFilter)) {
    //deep compare
    return lastFilter;
  }
  lastFilter = output;
  return output;
};

const FilterBar = ({ query = {} }: any) => {
  const { asPath, pathname } = useRouter();
  const [filterData, setFilterData] = useState(formatQUery(query));

  const onChangeField = (value, fieldName) => {
    setFilterData((filter) => ({ ...filter, [fieldName]: value }));
  };

  return (
    <div>
      <h2>Filter bar:</h2>

      <div className={style["filter-bar__body"]}>
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
            pathname,
            query: filterData,
          }}
        >
          <button>Submit</button>
        </Link>
      </div>
    </div>
  );
};

export default FilterBar;
