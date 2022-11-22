export const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "视频像素高",
    dataIndex: "vheight",
    customRender: (text) => {
      if (text === "0" || text === "") {
        return "无宽高限制";
      }
      return text + "px";
    },
  },
  {
    title: "视频像素宽",
    dataIndex: "vwidth",
    customRender: (text) => {
      if (text === "0" || text === "") {
        return "无宽高限制";
      }
      return text + "px";
    },
  },
  {
    title: "图片像素高",
    dataIndex: "mheight",
    customRender: (text) => {
      if (text === "0" || text === "") {
        return "无宽高限制";
      }
      return text + "px";
    },
  },
  {
    title: "图片像素宽",
    dataIndex: "mwidth",
    customRender: (text) => {
      if (text === "0" || text === "") {
        return "无宽高限制";
      }
      return text + "px";
    },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "200px",
    scopedSlots: { customRender: "action" },
  },
];

export const fields = {
  id: {
    init: "",
    label: "ID",
    placeholder: "唯一标识，自动生成",
    decorator: { initialValue: 0 },
    disabled: true,
    optional: true,
  },
  vheight: {
    init: "",
    label: "视频像素高(px)",
    placeholder: "请输入序号",
    tip: "数据显示顺序,自动生成,也可自定义",
  },
  vwidth: {
    init: "",
    label: "视频像素宽(px)",
    placeholder: "请输入序号",
    tip: "数据显示顺序,自动生成,也可自定义",
  },
  mheight: {
    init: "",
    label: "图片像素高(px)",
    placeholder: "请输入序号",
    tip: "数据显示顺序,自动生成,也可自定义",
  },
  mwidth: {
    init: "",
    label: "图片像素高(px)",
    placeholder: "请输入序号",
    tip: "数据显示顺序,自动生成,也可自定义",
  },
};

export const parseFields = () => {
  let models = {},
    configs = {};
  Object.keys(fields).forEach((key, index) => {
    let field = { ...fields[key] };
    field["init"] = field["init"] != undefined ? field["init"] : "";
    models[key] = field["init"];
    delete field.init;
    configs[key] = {};
    Object.assign(configs[key], field);
  });
  return [models, configs];
};
