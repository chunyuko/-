<template>
  <div>
    <bread-crumb></bread-crumb>
    <div style="padding: 0px 20px">
      <a-card :bordered="false" id="filterCom" style="overflow: hidden; position: relative">
        <div class="table-operator">
          <a-button-group>
            <a-button type="primary" @click="returnback">
              <a-icon type="rollback" />
              返回
            </a-button>
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
            <a-tooltip slot="actions" v-if="tabnextKey === 'imagetext' || tabnextKey === 'books'">
              <template slot="title">配置</template>
              <a-icon style="font-size: 16px" type="diff" @click="handleMore(item)"></a-icon>
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
import { columns, parseFields } from "@/config/options/videomenu.js";
import BreadCrumb from "@/views/Components/BreadCrumb";
import { parseFields_video1 } from "@/config/options/video1.js";
let [models, configs] = parseFields();
let [models_video1, configs_video1] = parseFields_video1();
let media_fields = {
  video1: {
    models: models_video1,
    configs: configs_video1,
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
      dataNext: { video1: [] },
      destroy: true,
      //第一层
      asking: false,
      eleVisible: false,
      totalSelect: false,
      selRecord: {},
      moreRecord: {},
      contentRow: {},
      initModel: Object.assign({}, models),
      grouped: [],
      checkedKeys: [],
      checkednextKeys: [],
      checkedmoreKeys: [],
      models,
      tab: "",
      tabnextKey: "",
      configs,
      type: "add",
      typeTitle: "新增",
      view_next: false,
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
        const requestParameters = Object.assign({}, parameter, this.queryParam, {
          videos: localStorage.getItem("videos"),
        });
        if (this.tab === "add" || this.tab === "update" || this.tab === "del" || this.tab === "del_multi") {
          requestParameters["refresh"] = false;
        } else {
          requestParameters["refresh"] = true;
        }
        return this.$store.dispatch("list_videomenu", requestParameters).then((res) => {
          console.log("刷新表单数据。。。。", res);
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
    returnback() {
      this.$router.back();
    },
    showContent() {
      if (this.view_next) {
        let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
        this.models = models;
        console.log(">>>");
      } else {
        this.models = { ...this.initModel };
        console.log(">");
      }
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    shownextPop(visible, item) {
      visible && this.getnextCheck(item.id);
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
    checkRulenextMedia(e, item, index) {
      const checknextIndex = this.checkednextKeys.indexOf(item.id);
      if (checknextIndex >= 0) {
        this.checkednextKeys.splice(checknextIndex, 1);
      } else {
        this.checkednextKeys.push(item.id);
      }
      console.log(this.checkednextKeys);
    },
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
    handleAdd() {
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    handleNext(record) {
      this.tabnextKey = "video1";
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
      this.typeTitle = "编辑：";
    },
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
          this.sumbit({ ids: this.selectedRowKeys, gxaq: localStorage.getItem("gxaq") }, "del_multi");
        },
        onCancel() {},
        cancelText: "取消",
        okText: "确定",
      });
    },
    delMedia() {
      if (this.checkednextKeys.length > 0 && this.view_next) {
        this.asking = true;
        this.sumbit({ ids: this.checkednextKeys, videomenu: this.selRecord.id }, "del_multi");
        console.log("..");
      } else {
        this.$message.error("未择操作数据");
      }
    },
    limitMul(vals, form, paths, fnc) {
      let [width, height] = this.getVideoPx("vwidth", "vheight");
      if (!width || !height) {
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
      if (localStorage.getItem(this.$store.getters.userInfo.name)) {
        let username = this.$store.getters.userInfo.name;
        let res = JSON.parse(localStorage.getItem(username));
        let [width, height] = [res[w], res[h]];
        return [width, height];
      }
      return ["", ""];
    },
    oked(vals, form) {
      if (this.view_next === true) {
        vals.set("videomenu", this.selRecord.id);
        return this.limitMul(vals, form, ["video"], getVideo);
      } else {
        vals.set("videos", localStorage.getItem("videos"));
        return this.sumbit(vals, form.type);
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
        vals["refresh"] = true;
        return this.$store.dispatch(type + "_videomenu", vals).then((res) => {
          // this.onClose();
          this.tab = type;
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
  },
};
</script>

<style scoped>
.table-operator {
  margin: 20px 0;
}
</style>
