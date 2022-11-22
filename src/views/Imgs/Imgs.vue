<template>
  <div>
    <bread-crumb></bread-crumb>
    <div style="padding: 0px 20px">
      <a-card :bordered="false" id="filterCom" style="overflow: hidden; position: relative">
        <div class="table-operator">
          <a-button-group>
            <a-button type="primary" @click="showContent">
              <a-icon type="plus" />
              新增
            </a-button>
          </a-button-group>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="delAll">
                <a-icon type="delete" />
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <h-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowSelection="rowSelection"
          showPagination="auto"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="tit" slot-scope="text">
            <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="address" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="extra" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="time" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="img" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="form" @click="handleContent(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handleEdit(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip>
                <template slot="title">删除</template>
                <a-popconfirm title="是否删除该数据？" ok-text="确定" cancel-text="取消" @confirm="handleDel(record)">
                  <a-icon type="delete" @click="selectRow(record)" v-if="!asking" style="font-size: 16px"></a-icon>
                  <a-icon type="loading" v-else></a-icon>
                </a-popconfirm>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip slot="actions">
                <template slot="title">配置</template>
                <a-icon style="font-size: 16px" type="diff" @click="handleNext(record)"></a-icon>
              </a-tooltip>
            </template>
          </span>
        </h-table>
        <h-form-modal
          ref="createModal"
          :visible="visible"
          :loading="confirmLoading"
          :models="models"
          :configs="configs"
          @cancel="handleCancel"
          :handle="oked"
          :type="type"
          :typeTitle="typeTitle"
          :destroy="destroy"
          :initModel="initModel"
          :footer="undefined"
          :zIndex="1001"
        ></h-form-modal>
      </a-card>
    </div>
    <a-drawer placement="right" :visible="view_next" @close="close_view_detail" width="550">
      <a-card style="width: 100%" :bordered="false" tabPosition="left" :loading="cardLoading">
        <a slot="extra" href="#">
          <a-tooltip>
            <template slot="title">全选</template>
            <a-checkbox @change="(e) => checkTotal(e)" :checked="totalSelect" />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip>
            <template slot="title">添加素材</template>
            <a-icon type="plus" @click="showContent()" style="font-size: 16px"></a-icon>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip>
            <template slot="title">删除素材</template>
            <a-popconfirm title="是否删除选中数据？" ok-text="确定" cancel-text="取消" @confirm="delMedia">
              <a-icon type="delete" style="font-size: 16px; margin-right: 10px" v-if="!asking"></a-icon>
              <a-icon type="loading" style="font-size: 16px; margin-right: 10px" v-else></a-icon>
            </a-popconfirm>
          </a-tooltip>
        </a>
        <a-list item-layout="horizontal" :data-source="dataNext[tabnextKey]" :bordered="false">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a slot="actions">
              <a-checkbox
                @change="(e) => checkRulenextMedia(e, item, index)"
                :checked="checkednextKeys.indexOf(item.id) >= 0 ? true : false"
              />
            </a>
            <a-tooltip slot="actions">
              <template slot="title">编辑</template>
              <a-icon style="font-size: 16px" type="edit" @click="handlenextEdit(item)"></a-icon>
            </a-tooltip>
            <a-tooltip slot="actions" v-if="tabnextKey === 'book' || tabnextKey === 'sprite2'">
              <template slot="title">配置</template>
              <a-icon style="font-size: 16px" type="diff" @click="handleMore(item)"></a-icon>
            </a-tooltip>
            <a-tooltip slot="actions">
              <template slot="title">删除</template>
              <a-popconfirm
                title="是否删除该数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDell(item)"
                @visibleChange="(e) => shownextPop(e, item)"
              >
                <a-icon type="delete" style="font-size: 16px" v-if="!asking"></a-icon>
                <a-icon type="loading" style="font-size: 16px" v-else></a-icon>
              </a-popconfirm>
            </a-tooltip>

            <a-list-item-meta :description="item.number">
              <a slot="title">{{ item.name }}</a>
              <a-avatar
                class="card-avatar"
                slot="avatar"
                style="color: #f56a00; background-color: #fde3cf"
                size="default"
              >
                C
              </a-avatar>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button type="primary" @click="close_view_detail">关闭</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getImg, getVideo } from "@/core/utils";
import { Ellipsis, HFormModal, HTable } from "@/libs/components";
import { columns, parseFields } from "@/config/options/imgs.js";
import BreadCrumb from "@/views/Components/BreadCrumb";
import { EventBus } from "@/core/event-bus.js";
import { parseFields_img } from "@/config/options/img.js";
let [models, configs] = parseFields();
let [models_img, configs_img] = parseFields_img();
// let [models_video, configs_video] = parseFields_video();
// let [models_imagetext, configs_imagetext] = parseFields_imagetext();
// let [models_images, configs_images] = parseFields_images();
// let [models_books, configs_books] = parseFields_books();
// let [models_videos, configs_videos] = parseFields_videos();
// let [models_imgs, configs_imgs] = parseFields_imgs();
// let [models_text_image, configs_text_image] = parseFields_text_image();
let media_fields = {
  img: {
    models: models_img,
    configs: configs_img,
  },
};
export default {
  provide() {
    return {
      src: {
        grouped: () => this.grouped,
      },
    };
  },
  components: {
    HTable,
    Ellipsis,
    HFormModal,
    BreadCrumb,
  },
  data() {
    this.columns = columns;
    let [models, configs] = parseFields();
    return {
      total: 0,
      dataMedia: { content: [] },
      dataNext: { img: [] },
      destroy: true,
      totalSelect: false,
      totalMoreSelect: false,
      //第一层
      tabKey: "",
      //第二层
      tabnextKey: "",
      //第三层
      tabmoreKey: "",
      asking: false,
      view_next: false,
      view_more: false,
      eleVisible: false,
      selRecord: {},
      moreRecord: {},
      contentRow: {},
      initModel: Object.assign({}, models),
      grouped: [],
      checkedKeys: [],
      checkednextKeys: [],
      checkedmoreKeys: [],
      models,
      configs,
      type: "add",
      typeTitle: "新增",
      visible: false,
      cardLoading: false,
      confirmLoading: false,
      visibleMedia: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$store.dispatch("list_imgs", requestParameters).then((res) => {
          // console.log("刷新表单数据。。。。", res);
          this.total = res.totalCount;
          return Promise.resolve(res);
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      rules: {
        tag: [{ required: true, message: "请输入设备标识", trigger: "change" }],
      },
      srcData: [],
    };
  },
  created() {},
  mounted() {},
  watch: {
    //监听抽屉变化
    // visibleMedia() {
    //   this.$refs.createModal.$emit("cancel");
    //   this.changeModel();
    // },
    view_next() {
      this.$refs.createModal.$emit("cancel");
      this.changenextModel();
    },
    // view_more() {
    //   this.$refs.createModal.$emit("cancel");
    //   this.changemoreModel();
    // },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    handleContent(record) {
      this.$router.push({
        name: "imgmenu",
        params: { imgs: record.id },
        // path: "/box",
        // query: { sections: record.id },
      });
      localStorage.setItem("imgs", record.id);
      this.contentRow = record;
      this.selectRow(record);
    },
    showContent() {
      this.models = { ...this.initModel };
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    // showPop(visible, item) {
    //   visible && this.getCheck(item.id);
    // },
    shownextPop(visible, item) {
      visible && this.getnextCheck(item.id);
    },
    // showmorePop(visible, item) {
    //   visible && this.getmoreCheck(item.id);
    // },
    // checkRuleMedia(e, item, index) {
    //   const checkIndex = this.checkedKeys.indexOf(item.id);
    //   if (checkIndex >= 0) {
    //     this.checkedKeys.splice(checkIndex, 1);
    //   } else {
    //     this.checkedKeys.push(item.id);
    //   }
    //   console.log(this.checkedKeys);
    // },
    checkRulenextMedia(e, item, index) {
      const checknextIndex = this.checkednextKeys.indexOf(item.id);
      if (checknextIndex >= 0) {
        this.checkednextKeys.splice(checknextIndex, 1);
      } else {
        this.checkednextKeys.push(item.id);
      }
      console.log(this.checkednextKeys);
    },
    // checkRulemoreMedia(e, item, index) {
    //   const checkmoreIndex = this.checkedmoreKeys.indexOf(item.id);
    //   if (checkmoreIndex >= 0) {
    //     this.checkedmoreKeys.splice(checkmoreIndex, 1);
    //   } else {
    //     this.checkedmoreKeys.push(item.id);
    //   }
    //   console.log(this.checkedmoreKeys);
    // },
    getCheck(id) {
      this.checkedKeys = [];
      this.checkedKeys.push(id);
      console.log(this.checkedKeys);
    },
    getnextCheck(id) {
      this.checkednextKeys = [];
      this.checkednextKeys.push(id);
      console.log(this.checkednextKeys);
    },
    // getmoreCheck(id) {
    //   this.checkedmoreKeys = [];
    //   this.checkedmoreKeys.push(id);
    //   console.log(this.checkedmoreKeys);
    // },
    // closeOpt() {
    //   this.visibleMedia = false;
    // },
    close_view_detail() {
      this.view_next = false;
    },
    // close_view_more() {
    //   this.view_more = false;
    // },
    handleAdd() {
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    // handleMore(record) {
    //   this.view_more = true;
    //   this.checkednextKeys = [];
    //   if (this.tabnextKey === "imagetext") {
    //     this.tabmoreKey = "text_image";
    //   } else if (this.tabnextKey === "books") {
    //     this.tabmoreKey = "imgs";
    //   }
    //   this.getnextCheck(record.id);
    //   this.moreRecord = record;
    // },
    handleNext(record) {
      this.tabnextKey = "img";
      console.log(this.tabnextKey);
      this.checkednextKeys = [];
      this.getCheck(record.id);
      this.view_next = true;
      this.selRecord = record;
    },
    handlenextEdit(record) {
      this.getnextCheck(record.id);
      !this.visibleMedia && this.selectRow(record);
      this.visible = true;
      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "编辑：" + this.models.name;
    },
    // handlemoreEdit(record) {
    //   this.getmoreCheck(record.id);
    //   !this.visibleMedia && this.selectRow(record);
    //   this.visible = true;
    //   this.models = { ...record };
    //   this.type = "update";
    //   this.typeTitle = "编辑：" + this.models.name;
    // },
    handleEdit(record) {
      this.selectRow(record);
      this.visible = true;
      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "编辑：" + this.models.name;
    },
    delAll() {
      this.$confirm({
        title: `确定删除所选${this.selectedRowKeys.length}项吗?`,
        content: () => <div style="color:red;">删除{this.getSelectBy("title").join("，")}后数据无法恢复</div>,
        onOk: () => {
          this.asking = true;
          this.sumbit({ ids: this.selectedRowKeys }, "del_multi");
        },
        onCancel() {},
        cancelText: "取消",
        okText: "确定",
      });
    },
    delMedia() {
      if (this.checkedKeys.length > 0 && this.view_next) {
        this.asking = true;
        this.sumbit({ ids: this.checkednextKeys, imgs: this.selRecord.id }, "del_multi");
        console.log(".");
      } else {
        this.$message.error("未择操作数据");
      }
    },
    limitMul(vals, form, paths, fnc) {
      let [width, height] = this.getVideoPx("mwidth", "mheight");
      if (!width || !height || height == 0 || width == 0) {
        return this.sumbit(vals, form.type).then(() => {});
      }
      let videos = paths.map((item) => {
        return fnc(vals.get(item))
          .then((res) => {
            return res;
          })
          .catch(() => {
            return false;
          });
      });
      return Promise.all(videos)
        .then((res) => {
          let failList = [];
          res.forEach((res) => {
            if (res.width > width || res.height > height) {
              failList.push(res);
              this.$message.error(res.name + `像素需要在${width}*${height}内,请删除后再上传该视频`);
            }
          });
          console.log(failList);
          if (failList.length == 0) {
            return this.sumbit(vals, form.type).then(() => {});
          }
        })
        .catch(() => {
          return this.sumbit(vals, form.type).then(() => {});
        });
    },
    getVideoPx(w, h) {
      // if (localStorage.getItem(this.$store.getters.userInfo.name)) {
      //   let username = this.$store.getters.userInfo.name;
      //   let res = JSON.parse(localStorage.getItem(username));
      //   let [width, height] = [res[w], res[h]];
      //   return [width, height];
      // }
      if (localStorage.getItem("config")) {
        let res = JSON.parse(localStorage.getItem("config"));
        let [width, height] = [res[w], res[h]];
        return [width, height];
      }
      return ["", ""];
    },
    oked(vals, form) {
      if (this.view_next) {
        vals.set("imgs", this.selRecord.id);
        return this.limitMul(vals, form, ["img"], getImg);
      } else {
        return this.sumbit(vals, form.type);
      }
    },
    checkTotal(e) {
      this.totalSelect = this.totalSelect ? false : true;
      if (this.totalSelect) {
        this.dataNext[this.tabnextKey].forEach((item) => {
          this.checkednextKeys.push(item.id);
        });
      } else if (!this.totalSelect) {
        this.checkednextKeys = [];
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleDel(vals) {
      this.getCheck(vals.id);
      this.asking = true;
      this.sumbit(vals, "del");
    },
    handleDell(vals) {
      this.getnextCheck(vals.id);
      this.asking = true;
      this.sumbit(vals, "del");
    },
    // handlemoreDell(vals) {
    //   this.getmoreCheck(vals.id);
    //   this.asking = true;
    //   this.sumbit(vals, "del");
    // },
    sumbit(vals, type, form) {
      let table = this.$refs.table;
      // console.log("vals.>>>", vals, ">>>>", vals.get("options"));
      if (this.view_next) {
        vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
        return this.$store.dispatch(type + "_" + this.tabnextKey, vals).then((res) => {
          this.dataNext[this.tabnextKey] = res.data;
          this.visible && this.handleCancel(type);
          type.indexOf("del") > -1 && (this.checkenextdKeys = []);
          this.asking = false;
          this.totalSelect = false;
          return Promise.resolve(res);
        });
      } else {
        vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
        return this.$store.dispatch(type + "_imgs", vals).then((res) => {
          // this.onClose();
          this.$refs.filtrate && this.$refs.filtrate.reload(res.data);
          // 刷新表格
          table.refresh();
          // this.$message.info(type + "成功");
          this.visible && this.handleCancel(type);
          type.indexOf("del") > -1 && this.resetSelect();
          this.asking = false;
          this.models = { ...this.initModel };
          return Promise.resolve(res);
        });
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    selectRow(record) {
      this.selectedRowKeys = [record.id];
      this.selectedRows = [record];
      this.$refs.table.updateSelect(this.selectedRowKeys, this.selectedRows);
    },
    resetSelect() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.$refs.table.updateSelect(this.selectedRowKeys, this.selectedRows);
    },
    getSelectBy(name) {
      return this.selectedRows.map((val) => val[name]);
    },
    // changeModel() {
    //   if (this.visibleMedia && !this.view_next) {
    //     let { models = {}, configs = {} } = media_fields[this.tabKey] ? media_fields[this.tabKey] : {};
    //     this.models = models;
    //     this.configs = configs;
    //     this.cardLoading = true;
    //     let tabKey = this.tabKey,
    //       apiName = "list_" + tabKey;
    //     this.checkedKeys = [];
    //     this.$store.dispatch(apiName, this.contentRow).then((res) => {
    //       this.cardLoading = false;
    //       this.dataMedia[tabKey] = res.data;
    //     });
    //   } else {
    // this.models = models;
    // this.configs = configs;
    //   }
    // },
    changenextModel() {
      if (this.view_next) {
        let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
        this.models = models;
        this.configs = configs;
        this.cardLoading = true;
        let tabnextKey = this.tabnextKey,
          apiName = "list_" + tabnextKey;
        this.cardLoading = false;
        this.dataNext[tabnextKey] = [];
        this.$store.dispatch(apiName, this.selRecord).then((res) => {
          this.dataNext[tabnextKey] = res.data;
        });
      } else {
        this.models = models;
        this.configs = configs;
      }
    },
    // changemoreModel() {
    //   if (this.view_more) {
    //     let { models = {}, configs = {} } = media_fields[this.tabmoreKey] ? media_fields[this.tabmoreKey] : {};
    //     this.models = models;
    //     this.configs = configs;
    //     this.cardLoading = true;
    //     let tabmoreKey = this.tabmoreKey,
    //       apiName = "list_" + tabmoreKey;
    //     this.cardLoading = false;
    //     this.dataMore[tabmoreKey] = [];
    //     this.$store.dispatch(apiName, this.moreRecord).then((res) => {
    //       this.dataMore[tabmoreKey] = res.data;
    //     });
    //   } else {
    // let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
    // this.models = models;
    // this.configs = configs;
    //   }
    // },
  },
};
</script>

<style scoped>
.table-operator {
  margin: 20px 0;
}
</style>
