<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="showaddCateDialog"
          >添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="TreeTable"
        :data='catelist'
        :columns='columns'
        :selection-type='false'
        :expand-type='false'
        show-index
        index-text='#'
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isok='{row}'>
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="row.cat_deleted===false"
          ></i>
          <i
            class="el-icon-error"
            style="color:red"
            v-else
          ></i>
        </template>
        <!-- 有效 -->
        <template v-slot:order='{row}'>
          <el-tag
            size="mini"
            v-if="row.cat_level===0"
          >一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if='row.cat_level===1'
          >二级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else
          >三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt={row}>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showCate(row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close='addCateDialogClosed'
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称:"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props用来指定数据对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChange"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateVisible"
      width="50%"
      @close='editCateClosed'
    >
      <el-form
        :model="editCate"
        ref="editCateRef"
        :rules="editCateRules"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCateInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类的数据列表默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      }, {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      }, {
        label: '操作',
        // 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt'

      }],
      // 控制修改分类对话框的显示与隐藏
      editCateVisible: false,
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1, // 页码
        pagesize: 5// 每一页显示的数据数量
      },
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 查询到的分类信息
      editCate: {},
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认是一级分类
        cat_level: 0

      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类id数组
      selectedKeys: [],
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 修改分类的表单验证规则
      editCateRules: {
        cat_name: [{ required: true, message: '请输分类名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮展示添加分类对话框
    showaddCateDialog  () {
      // 想获取父级分类数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async  getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选项发生变化时触发这个函数
    parentCateChange () {
      console.log(this.selectedKeys)
      // 如果selectedKeys中的length大于0证明选中了父级分类反之就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return ''
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
        return 'i'
      }
    },
    // 点击按钮添加新分类
    addCate () {
      this.$refs.addCateFormRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post('categories', { cat_name: this.addCateForm.cate_name, cat_pid: this.selectedKeys[this.selectedKeys.length - 1], cat_level: this.selectedKeys.length })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加新分类失败')
        this.$message.success('添加新分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示编辑分类的对话框
    async  showCate (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询分类信息失败')
      this.editCate = res.data
      this.editCateVisible = true
    },
    // 监听修改分类对话框的关闭事件
    editCateClosed () {
      this.$refs.editCateRef.resetFields()
    },
    // 修改分类并提交
    editCateInfo () {
      this.$refs.editCateRef.validate(async val => {
        if (!val) return console.log(1)
        // 发起修改分类信息的数据请求
        const { data: res } = await this.$http.put('categories/' + this.editCate.cat_id, { cat_name: this.editCate.cat_name })
        if (res.meta.status !== 200) return this.$message.error('更新分类信息失败')
        this.$message.success('更新分类信息成功')
        this.getCateList()
        this.editCateVisible = false
      })
    }, // 根据id删除对应的分类信息
    async removeCateById (id) {
    //  弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果确认删除则返回值为字符串confirm
      // 如果取消删除则返回值为字符串cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除分类信息失败')
      this.$message.success('删除分类成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="scss" scoped>
.TreeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
