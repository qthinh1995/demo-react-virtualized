import type { NextPage } from 'next'
import ListVirtualized from "../components/ListVirtualized";
import FilterBar from "../components/FilterBar";
const Home: NextPage = ({ query }: any) => {
  return (
    <div>
      <FilterBar query={query} />
      <ListVirtualized />
    </div>
  );
};

export default Home;

export async function getServerSideProps(context) {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  };
}