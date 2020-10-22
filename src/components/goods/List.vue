<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear='getGoodsList'
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">

          <el-button
            type="primary"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table
        :data="goodslist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="商品创建时间"
          prop="add_time"
          width="140px"
        >
          <template #default={row}>
            {{row.add_time | fongst('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template #default={row}>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showList(row.goods_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editListVisible"
      width="50%"
      @close='editListClosed'
    >

      <el-form
        :model="editList"
        ref="editListRef"
        :rules="editListRules"
        label-width="100px"
      >
        <el-form-item
          label="商品名称"
          prop="goods_name"
        >
          <el-input v-model="editList.goods_name"></el-input>
        </el-form-item>
        <el-form-item
          label="商品价格"
          prop="goods_price"
        >
          <el-input v-model="editList.goods_price"></el-input>
        </el-form-item>
        <el-form-item
          label="商品重量"
          prop="goods_weight"
        >
          <el-input v-model="editList.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editListVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click='editListInfo'
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
      // 控制修改商品列表框的展示与隐藏
      editListVisible: false,
      // 查询到的分类列表信息
      editList: {},
      // 商品修改的检验规则
      editListRules: {
        goods_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取相应的数据列表
    async  getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      // this.$message.success('获取列表成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听pagesize显示页面数据数量事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 显示页码值数量
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击删除商品
    async  removeById (id) {
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
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 点击跳转到添加商品页面
    goAddpage () {
      this.$router.push('goods/add')
    },
    // 展示编辑分类的对话框
    async  showList (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询商品信息失败')
      this.editList = res.data
      this.editListVisible = true
      console.log(this.editList)
    },
    // 监听修改分类对话框的关闭事件
    editListClosed () {
      this.$refs.editListRef.resetFields()
    },
    // 修改商品信息并提交
    editListInfo () {
      this.$refs.editListRef.validate(async val => {
        if (!val) return
        // 发起修改分类信息的数据请求
        const { data: res } = await this.$http.put('goods/' + this.editList.goods_id, this.editList)
        if (res.meta.status !== 200) return this.$message.error('更新商品信息失败')
        this.$message.success('更新商品信息成功')
        this.getGoodsList()
        this.editListVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
