const listPost = new Array(500)
  .fill({
    title: "Post Title",
    description: "Post description",
    detail:
      "lorem isum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem sed diam nonumy eum erat",
  })
  .map((item, index) => ({
    ...item,
    id: index,
    title: `${item.title} ${index}`,
    description: `${item.description} ${index}`,
  }));

export default listPost;
