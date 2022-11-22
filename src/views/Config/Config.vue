<template>
  <div>
    <bread-crumb></bread-crumb>
    <div style="padding: 0px 20px">
      <a-card :bordered="false" id="filterCom" style="overflow: hidden; position: relative">
        <div class="table-operator">
          <div style="height: 32px; padding: 0 15px"></div>
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
  </div>
</template>

<script>
import { getImg, getVideo } from "@/core/utils";
import { Ellipsis, HFormModal, HTable } from "@/libs/components";
import { columns, parseFields } from "@/config/options/config.js";
import BreadCrumb from "@/views/Components/BreadCrumb";
import { parseFields_img } from "@/config/options/img.js";
let [models, configs] = parseFields();
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
        return this.$store.dispatch("list_config", requestParameters).then((res) => {
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
    showContent() {
      this.models = { ...this.initModel };
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
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
    // close_view_more() {
    //   this.view_more = false;
    // },
    handleAdd() {
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    handleEdit(record) {
      this.selectRow(record);
      this.visible = true;
      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "上传配置";
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
        this.sumbit({ ids: this.checkednextKeys, config: this.selRecord.id }, "del_multi");
        console.log(".");
      } else {
        this.$message.error("未择操作数据");
      }
    },
    oked(vals, form) {
      if (this.view_next) {
        vals.set("config", this.selRecord.id);
        return this.limitMul(vals, form, ["img"], getImg);
      } else {
        // console.log(arguments[2]);
        localStorage.setItem("config", JSON.stringify(arguments[2]));
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
        return this.$store.dispatch(type + "_config", vals).then((res) => {
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
