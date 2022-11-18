let baseUrl = "/videos";
export const videos = {
  list: `${baseUrl}/list`,
  add: { post: `${baseUrl}/add` },
  edit: { post: `${baseUrl}/update` },
  del: { post: `${baseUrl}/del` },
  del_multi: { post: `${baseUrl}/del_multi` },
};
