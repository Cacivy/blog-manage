<template>
    <div id="tag">
        <el-row :gutter="12">
            <el-col :span="6">
                <el-input
                placeholder="请输入分类名称"
                @keyup.enter.native="onCommit"
                v-model="input">
                </el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="edit" @click="onCommit()">添加分类</el-button>
            </el-col>
        </el-row>
        <el-tag 
        v-for="category, index in categories"
        :closable="true"
        :hit="true"
        class="el-tag-custome"
        @close="onClose(category._id, index)">
            {{category.text}}
        </el-tag>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: '',
            categories: [],
            total: 0
        }
    },
    mounted() {
        this.$api.get_category().then(res => {
            this.categories = res.data.result
            this.total = res.data.total
        })
    },
    methods: {
        onCommit() {
            this.$api.post_category({text: this.input}).then(res => {
                this.categories.push(res.data.result)
                this.input = ''
                this.$message({
                    type: 'success',
                    message: '已添加'
                });
            })
        },
        onClose(id, index) {
            this.$confirm('确定删除吗?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.delete_tag(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.categories.splice(index, 1)
                })
            })
        }
    }
}
</script>