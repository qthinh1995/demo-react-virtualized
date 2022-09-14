import Link from "../Link";
import Tab from "../Tab";

const tabs = [
  { label: "Home", link: "/" },
  {
    label: "Post",
    link: "/post",
  },
  {
    label: "Article",
    link: "/article",
  },
  {
    label: "News",
    link: "/news",
  },
  {
    label: "Jobs",
    link: "/jobs",
  },
];
const HeaderBar = ({ query }: any) => {
  return (
    <div>
      {tabs.map((item, index) => (
        <Link href={item.link} key={index}>
          <Tab key={index}>{item.label}</Tab>
        </Link>
      ))}
    </div>
  );
};

export default HeaderBar;
