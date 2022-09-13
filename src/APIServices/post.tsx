import { faker } from "@faker-js/faker";

const generatePost = (index) => {
  return {
    id: faker.datatype.uuid(),
    title: `${index}__${faker.lorem.lines()}`,
    description: faker.lorem.paragraphs(20),
    detail: faker.lorem.paragraphs(50),
    thumbnail: faker.image.cats(),

    author: {
      name: faker.name,
      age: faker.datatype.bigInt({ min: 0, max: 100 }),
      tel: faker.phone,
    },
  };
};

export const fetchPost = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(generatePost(id));
    }, 800);
  });

export const fetchPosts = ({ page, pageSize = 20 } = {}) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const indexStartForm = (page - 1) * pageSize;
      const posts = new Array(pageSize)
        .fill()
        .map((_, index) => generatePost(indexStartForm + index));
      resolve(posts);
    }, 800);
  });
