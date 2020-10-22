<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级为分类设置相关参数"
        type="warning"
        :closable='false'
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- options用来指定数据源 -->
          <!-- props用来指定数据对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="paramslist"
            :props="paramsProps"
            v-model="paramsKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- Tab页签区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数的面板 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled='isBtnDisabled'
            @click="paramsDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default={row}>
                <!-- 循环渲染tag表格 -->
                <el-tag
                  v-for="(item,index) in row.attr_vals"
                  :key="index"
                  closable
                  @close='handleClose(index,row)'
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template #default={row}>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click='removeParams(row.attr_id)'
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态态属性的面板 -->
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled='isBtnDisabled'
            @click="paramsDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态态参数表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default={row}>
                <!-- 循环渲染tag表格 -->
                <el-tag
                  v-for="(item,index) in row.attr_vals"
                  :key="index"
                  closable
                  @close='handleClose(index,row)'
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template #default={row}>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click='removeParams(row.attr_id)'
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->

    <el-dialog
      :title='"添加"
      +titleText'
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close='addDialogClosed'
    >
      <!-- 添加参数的对话框 -->
      <el-form
        ref="paramsFormRef"
        :model="paramsForm"
        :rules="paramsFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->

    <el-dialog
      :title='"修改"
      +titleText'
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close='editDialogClosed'
    >
      <!-- 修改参数的对话框 -->
      <el-form
        ref="editParamsFormRef"
        :model="editParamsForm"
        :rules="editParamsFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      paramslist: [],
      // 级联选择框的配置对象
      paramsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      paramsKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      paramsDialogVisible: false,
      // 控制修改参数对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 修改的表单数据对象
      editParamsForm: {},
      // 添加参数的表单数据对象
      paramsForm: {
        attr_name: ''
      },
      // 添加表单的验证规则
      paramsFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 修改的表单验证规则
      editParamsFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getParamsList()
  },
  methods: {
    // 获取所有的商品分类
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.paramslist = res.data
    },
    // 级联选择框选中项变化时触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async   getParamsData () {
      if (this.paramsKeys.length !== 3) {
        this.paramsKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return ''
      }
      // 根据所选的id，和当前所处的面板获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      // this.$message.success('获取数据失败')

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      // 判断获取到的参数属于动态属性还是静态属性
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听参数对话框的关闭事件
    addDialogClosed () {
      this.$refs.paramsFormRef.resetFields()
    },
    // 监听修改参数对话框的关闭事件
    editDialogClosed () {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击按钮 添加参数
    addParams () {
      this.$refs.paramsFormRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post(`categories/${this.paramsId}/attributes`, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')

        this.$message.success('添加成功')
        this.getParamsData()
        this.paramsDialogVisible = false
      })
    },
    // 点击按钮，展示修改的对话框
    async  showEditDialog (id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取失败失败')
      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
    },
    // 点击按钮修改参数信息
    editParams () {
      this.$refs.editParamsFormRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${this.editParamsForm.attr_id}`, { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('修改参数信息失败')
        this.editParamsDialogVisible = false
        this.getParamsData()
        this.$message.success('修改参数成功')
      })
    },
    // 点击删除参数
    async  removeParams (id) {
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
      const { data: res } = await this.$http.delete(`categories/${this.paramsId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
      this.paramsDialogVisible = false
    },
    // 文本框失去了焦点或者按下了回车都会触发
    async   handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return ''
      }
      // 如果没有return则证明输入了内容，就进行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求保存这次操作
      this.saveAttrVals(row)
    },
    // 点击按钮显示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，就是当页面上的元素被重新渲染后才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 将对attr_vals的修改保存到数据库中
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
    }
  },
  computed: {
    // 如果按钮需要被禁用就返回true 否则返回false
    isBtnDisabled () {
      if (this.paramsKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类id
    paramsId () {
      if (this.paramsKeys.length === 3) return this.paramsKeys[2]
      return null
    },
    // 动态计算标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="scss" scoped>
.cat-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
