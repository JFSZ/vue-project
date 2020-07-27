<template>
  <div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getLocalFile()">
      <el-form-item>
        <el-input v-model="dataForm.keyword" placeholder="请输入查询内容" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getLocalFile()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('sys:oss:all')" @click="uploadLocal()" type="success">上传</el-button>
        <el-button v-if="isAuth('sys:oss:all')" @click="deleteStorage()" type="danger"
                   :disabled="selectedList.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="文件名">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseUrl + '/file/' +  row.type + '/' + row.realName"
            :preview-src-list="[baseUrl + '/file/' +  row.type + '/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="suffix"
        header-align="center"
        align="center"
        label="文件类型">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类别">
      </el-table-column>
      <el-table-column
        prop="size"
        header-align="center"
        align="center"
        label="大小">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="上传日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:oss:all')" @click="editStorage(scope.row.id)" type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button v-if="isAuth('sys:oss:all')" @click="deleteStorage(scope.row.id)" type="danger" icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;margin-top: 20px"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <Upload v-if="visible" ref="Upload" @refreshDataList="getLocalFile()"></Upload>
  </div>
</template>

<script>
import Upload from './upload'
export default {
  name: 'localStorage',
  data () {
    return {
      dataForm: {
        keyword: ''
      },
      selectedList: [],
      dataListLoading: false,
      dataList: [],
      visible: false,
      baseUrl: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  components: {Upload},
  activated () {
    this.getLocalFile()
    this.baseUrl = this.$api.baseUrl
  },
  methods: {
    // 获取本地存储列表
    getLocalFile: function () {
      let param = {
        keyword: this.dataForm.keyword,
        page: this.pageIndex,
        limit: this.pageSizes
      }
      this.$api.get('/sys/oss/list', param).then((res) => {
        if (res != null) {
          this.dataList = res.list
        }
      })
    },
    // 上传
    uploadLocal: function (val) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Upload.init(val)
      })
    },
    // 删除存储
    deleteStorage: function (val) {
    },
    handleSelectionChange: function (val) {
      this.selectedList = val
    },
    editStorage: function () {

    },
    sizeChangeHandle: function (val) {
      this.pageSize = val
      this.pageIndex = 1
    },
    currentChangeHandle: function (val) {
      this.pageIndex = val
    }
  }
}
</script>

<style scoped>

</style>
