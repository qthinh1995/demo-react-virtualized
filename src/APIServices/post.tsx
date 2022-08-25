import { faker } from "@faker-js/faker";

const generatePost = (index) => {
  return {
    id: faker.datatype.uuid(),
    title: `${index}__${faker.lorem.lines()}`,
    description: faker.lorem.paragraph(),
    detail: faker.lorem.paragraph(12),
    thumbnail: faker.image.cats(),
  };
};

export const fetchPost = (id) =>
  new Promise((resolve, reject) => {
    console.log("id: ", id);
    setTimeout(() => {
      resolve(generatePost(id));
    }, 800);
  });

export const fetchPosts = ({ page, pageSize = 20 } = {}) =>
  new Promise((resolve, reject) => {
    console.log("page: ", page);
    setTimeout(() => {
      const indexStartForm = (page - 1) * pageSize;
      const posts = new Array(pageSize)
        .fill()
        .map((_, index) => generatePost(indexStartForm + index));
      resolve(posts);
    }, 800);
  });
